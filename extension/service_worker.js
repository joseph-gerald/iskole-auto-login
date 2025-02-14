let clicked = false;
let redirCount = 0;

let username = null;
let password = null;

async function updateCredentials() {
    await chrome.storage.local.get(["username", "password"], function (result) {
        result.username ??= "";
        result.password ??= "";

        username = result.username;
        password = result.password;
    });
}

async function executeScript(tabId, func) {
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId },
            func
        }, ([result]) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.result);
            }
        });
    });
}

async function executeScript(tabId, func) {
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId },
            func
        }, ([result]) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result.result);
            }
        });
    });
}

let resetTimeout = null;

async function handleTabUpdates(tabIdentifier, info, tabDetails) {
    if (info.status === "loading" && tabDetails.url) {
        var url = new URL(tabDetails.url);

        const host = url.hostname;

        const firstCon = host == tabDetails.title;
        console.log("firstCon", firstCon)
        switch (tabDetails.url) {
            case "https://iskole.net/elev/?isFeideinnlogget=true&ojr=login":
                chrome.tabs.query({
                    currentWindow: true
                }, function (tab) {
                    redirCount++;

                    const path = redirCount > 1 ? "https://iskole.net/iskole_login/dataporten_login?RelayState=/elev" : "https://iskole.net/elev/?isFeideinnlogget=true&ojr=timeplan";

                    chrome.tabs.update(tab.id, { url: path });
                });

                clearInterval(resetTimeout);

                resetTimeout = setTimeout(() => {
                    redirCount = 0;
                }, 5000);
                break;
        }

        if (host == "idp.feide.no" && url.pathname == "/simplesaml/module.php/feide/login" && clicked) {
            setTimeout(() => {
                executeScript(tabIdentifier, () => {
                    window.oniskoleloaded = () => {
                        const usernameElm = document.getElementById("username");
                        const passwordElm = document.getElementById("password");

                        const dataElm = document.querySelector("super-secret-data");
                        const username = dataElm.getAttribute("username");
                        const password = dataElm.getAttribute("password");

                        console.log(usernameElm, passwordElm);
                        console.log(username, password);

                        if (usernameElm && passwordElm) {
                            usernameElm.value = username ?? "";
                            passwordElm.value = password ?? "";

                            document.querySelector("button[type='submit']").click();
                        }
                    }
                });
            }, 0);
        }

        if (host == "auth.dataporten.no" && url.pathname == "/accountchooser" && !clicked) {
            console.log("clicking");
            clicked = true;

            setTimeout(() => {
                executeScript(tabIdentifier, () => {
                    window.onload = () => {
                        document.querySelector(".section-list").click();
                    }
                });
            }, 0);

            redirCount = 0;
        } else {
            clicked = false;
        }
    }
}

setInterval(() => {
    updateCredentials();
}, 250);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.type == "init") {
        await chrome.tabs.sendMessage(sender.tab.id, { type: "init", data: { username, password } });
    }
});

chrome.tabs.onUpdated.addListener(handleTabUpdates);
