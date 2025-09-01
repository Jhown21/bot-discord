// handlers/adminHandler.js
// ✳️ Processa comandos de administração do servidor (start/stop/restart)

const { exec } = require("child_process");
const { rconSend } = require("../utils/rcon");

async function adminHandler(message) {
  const cmd = message.content.trim().toLowerCase();

  if (cmd === "stop") {
    await rconSend("save-all");
    await rconSend("stop");
    return message.reply("🛑 Servidor foi parado com segurança!");
  }

  if (cmd === "start") {
    exec("service minecraft start", (err) => {
      if (err) return message.reply("❌ Erro ao iniciar: " + err.message);
      return message.reply("🚀 Servidor iniciado!");
    });
    return;
  }

  if (cmd === "restart") {
    exec("service minecraft restart", (err) => {
      if (err) return message.reply("❌ Erro ao reiniciar: " + err.message);
      return message.reply("♻️ Servidor reiniciado!");
    });
    return;
  }
}

module.exports = adminHandler;
