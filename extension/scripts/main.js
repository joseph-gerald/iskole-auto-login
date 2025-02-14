setTimeout(() => {
    if (!window.oniskoleloaded) return;
    
    chrome.runtime.sendMessage({ type: "init" });

    console.log("Hello from main.js");

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log(request)
        if (request.type == "init") {

            const secretData = document.createElement("super-secret-data");
            
            secretData.setAttribute("username", request.data.username);
            secretData.setAttribute("password", request.data.password);

            document.body.appendChild(secretData);

            window.oniskoleloaded();
        }
    });
}, 0);