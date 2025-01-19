let clicked = false;
let redirCount = 0;

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
                chrome.tabs.query({ // change the tab url
                    currentWindow: true
                }, function (tab) {
                    redirCount++;

                    const path = redirCount > 1 ? "https://iskole.net/iskole_login/dataporten_login?RelayState=/elev" : "https://iskole.net/elev/?isFeideinnlogget=true&ojr=timeplan";
                    
                    chrome.tabs.update(tab.id, { url: path });
                });

                resetTimeout = setTimeout(() => {
                    redirCount = 0;
                }, 1000);
                break;
        }

        if (host == "auth.dataporten.no" && url.pathname == "/accountchooser" && !clicked) {
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
chrome.tabs.onUpdated.addListener(handleTabUpdates);
