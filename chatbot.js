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

let welcomeShown = false;

// abrir chat
button.onclick = () => {
  box.style.display = "flex";

  if(!welcomeShown){
    addMessage(
`¡Hola! 👋 Bienvenido a Sweet Bites.

Puedo ayudarte con información sobre:

• Precios
• Sabores
• Ubicación
• Horario de envíos

¿En qué te gustaría información?`,
    "bot"
    );

    welcomeShown = true;
  }
};

// cerrar chat
close.onclick = () => box.style.display = "none";

function addMessage(text, sender){

  const msg = document.createElement("div");
  msg.className = sender;

  // detectar links
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const formattedText = text.replace(urlRegex, url => {

    // si es link de WhatsApp mostrar botón
    if(url.includes("wa.me")){
      return `
      <br><br>
      <a href="${url}" target="_blank" 
      style="
        display:inline-block;
        padding:10px 14px;
        background:#25D366;
        color:white;
        border-radius:8px;
        text-decoration:none;
        font-weight:bold;
      ">
      Pedir por WhatsApp
      </a>
      `;
    }

    // si es otro link normal
    return `<a href="${url}" target="_blank">${url}</a>`;
  });

  msg.innerHTML = formattedText;

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(){

  const text = input.value.trim();
  if(!text) return;

  addMessage(text,"user");
  input.value = "";

  try{

    const res = await fetch("https://laquita-noncontrolled-deneen.ngrok-free.dev/webhook/chatbot",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({message:text})
    });

    const data = await res.json();

    console.log("Respuesta servidor:", data);

    let botReply =
      data.text ||
      data.reply ||
      data.response ||
      (Array.isArray(data) && data[0]?.text) ||
      (Array.isArray(data) && data[0]?.reply) ||
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