async function sendMessage(){

  const text = input.value.trim();
  if(!text) return;

  addMessage(text,"user");
  input.value="";

  try{

    const res = await fetch("https://laquita-noncontrolled-deneen.ngrok-free.dev/webhook/chatbot",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({message:text})
    });

    const data = await res.json();

    console.log("Respuesta servidor:",data);

    let botReply =
      data.reply ||
      data.response ||
      (data[0] && data[0].reply) ||
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