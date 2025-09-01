// handlers/consoleHandler.js
// ✳️ Envia mensagem do OWNER como se fosse digitada direto no console do servidor.

const { rconSend } = require("../utils/rcon");

async function consoleHandler(message) {
  try {
    const resposta = await rconSend(message.content);
    return message.reply("📜 Console → " + resposta);
  } catch (err) {
    return message.reply("❌ Erro console: " + err.message);
  }
}

module.exports = consoleHandler;
