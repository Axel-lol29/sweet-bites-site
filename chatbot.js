const chatbotHTML = `
<div id="chatbot-container">
  <div id="chatbot-button">💬</div>

  <div id="chatbot-box">
    <div id="chatbot-header">
      Sweet Bites Assistant
      <span id="chatbot-close">✖</span>
    </div>

    <div id="chatbot-messages"></div>

    <div id="chatbot-input-area">
      <input id="chatbot-input" placeholder="Escribe tu mensaje..." />
      <button id="chatbot-send">Enviar</button>
    </div>
  </div>
</div>
`;

document.body.insertAdjacentHTML("beforeend", chatbotHTML);

const button = document.getElementById("chatbot-button");
const box = document.getElementById("chatbot-box");
const close = document.getElementById("chatbot-close");
const send = document.getElementById("chatbot-send");
const input = document.getElementById("chatbot-input");
const messages = document.getElementById("chatbot-messages");

button.onclick = () => box.style.display = "flex";
close.onclick = () => box.style.display = "none";

function addMessage(text, sender){
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(){

  const text = input.value.trim();
  if(!text) return;

  addMessage(text,"user");
  input.value="";

  try{

    const res = await fetch("http://localhost:5678/webhook/chatbot",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({message:text})
    });

    const data = await res.json();

    console.log("Respuesta servidor:",data);

    // intentar varias formas de leer la respuesta
    let botReply =
      data.response ||
      (data[0] && data[0].response) ||
      "Lo siento, no pude generar respuesta.";

    addMessage(botReply,"bot");

  }catch(err){

    console.error(err);

    addMessage(
      "⚠️ Error conectando con el asistente. Intenta de nuevo.",
      "bot"
    );

  }

}

send.onclick = sendMessage;

input.addEventListener("keypress", e=>{
  if(e.key==="Enter") sendMessage();
});