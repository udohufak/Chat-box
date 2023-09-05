const chatInput = document.querySelector(".chat-input textarea")
const sendChatBtn = document.getElementById("send-btn")
const chatBox = document.querySelector(".chatbox")
const chatbotToggle = document.querySelector(".chatbot-toggle")
const chatbotCloseBtn = document.querySelector(".close-btn ")

let userMessage; 

const API_KEY ="sk-jPa1c22EziLHISrxbAvQT38lbkFJY9WCOZiqdBhebjUy2xpH";
const inputInHeight = chatInput.scroolHeight
const createChatLi = (message, className) => {
    //CREATE A CHAT <LI>ELEMENT WITH PASSED MESSAGE AND CLASSNAME
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` :  ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent =message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages:[{role: "user", content: userMessage}]

        })
    }
        //send POST request to API, get response
    fetch(API_URL, requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! something went wrong. please try again";
    }).finally(() => chatBox.scroolTo(0, chatBox.scrollHeight))
}
function handleChat() {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInHeight}px`;
    // APPEND THE USER'S MESSAGE TO THE CHATBOX
   chatBox.appendChild(createChatLi(userMessage, "outgoing"));
   chatBox.scroolTo(0, chatBox.scrollHeight);

   setTimeout(() => {
    const incomingChatLi = (createChatLi("Thinking.....", "incoming"));
    chatBox.appendChild(incomingChatLi);
    chatBox.scroolTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLi);
   }, 700)
}
chatInput.addEventListener("input",() => {
    // ADJUST THE HEIGHT OF THE INPUT TEXTAREA BASED ON ITS CONTENT
    chatInput.style.height = `${inputInHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("Keydown",(e) => {
    //IF THE ENTER KEY IS PRESSED WITHOUT SHIFT KEY AND THE WINDOW
    // WIDTH IS GREATER THAN 800PX, HANDLE THE CHAT
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
})

sendChatBtn.addEventListener("click", handleChat) 
chatbotCloseBtn.addEventListener('click',() => document.body.classList.remove("show-chatbot"))
chatbotToggle.addEventListener('click',() => document.body.classList.toggle("show-chatbot"))
