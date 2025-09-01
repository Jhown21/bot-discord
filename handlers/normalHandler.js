// handlers/normalHandler.js
// ✳️ Processa comandos normais via RCON
//    Esses comandos podem ser usados por qualquer player
//    no canal de comandos definido em config.

const { rconSend } = require("../utils/rcon");

async function normalHandler(message) {
  const content = message.content.trim().toLowerCase();

  // !say <mensagem>
  if (content.startsWith("!say ")) {
    const msg = message.content.slice(5);
    try {
      await rconSend(`tellraw @a {"text":"[Discord] ${message.author.username}: ${msg}","color":"aqua"}`);
      return message.reply("📢 Mensagem enviada para o servidor!");
    } catch (err) {
      return message.reply("❌ Erro: " + err.message);
    }
  }


  return null; // se não for nenhum comando normal
}

module.exports = normalHandler;
