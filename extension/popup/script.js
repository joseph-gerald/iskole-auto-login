const content = document.getElementById("content");
const usernameElm = document.getElementById("username");
const passwordElm = document.getElementById("password");

let username = "";
let password = "";

chrome.storage.local.get(["username", "password"], function (result) {
    result.username ??= "";
    result.password ??= "";

    username = result.username;
    password = result.password;

    usernameElm.value = username;
    passwordElm.value = password;
});

usernameElm.addEventListener("input", function (e) {
    username = e.target.value;
    chrome.storage.local.set({ username });
});

passwordElm.addEventListener("input", function (e) {
    password = e.target.value;
    chrome.storage.local.set({ password });
});

async function updateContent() {
    const res = await fetch("https://kv.jooo.tech/iskole-auto-login");
    const data = await res.text();

    content.innerHTML = data;
}

async function init() {
    while (true) {
        await updateContent();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
}

init();