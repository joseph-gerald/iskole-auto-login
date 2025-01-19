const content = document.getElementById("content");

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