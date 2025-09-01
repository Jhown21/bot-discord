// handlers/router.js
// ✳️ Decide o destino de cada mensagem:
//    - Canal de comandos → normalHandler (se não for admin).
//    - Canal de comandos → adminHandler (se for admin).
//    - Canal de full logs → consoleHandler (owner manda comandos).
//    - start/stop/restart no full logs → adminHandler.

const { CHAT_COMMANDS_CHANNEL_ID, FULL_LOGS_CHANNEL_ID, OWNER_ID } = require("../config/config");

const normalHandler = require("./normalHandler");
const adminHandler = require("./adminHandler");
const consoleHandler = require("./consoleHandler");

function router(message) {
  const content = message.content.trim().toLowerCase();
  const isOwner = message.author.id === OWNER_ID;

  // 1️⃣ Canal de comandos
  if (message.channel.id === CHAT_COMMANDS_CHANNEL_ID) {
    if (isOwner) {
      // Dono pode usar tanto admin quanto normal
      return adminHandler(message) || normalHandler(message);
    } else {
      // Outros só podem usar normal
      return normalHandler(message);
    }
  }

  // 2️⃣ Canal de logs completos (console ao vivo)
  if (message.channel.id === FULL_LOGS_CHANNEL_ID) {
    if (isOwner) {
      // Se for comando crítico → adminHandler
      if (["start", "stop", "restart"].includes(content)) {
        return adminHandler(message);
      }
      // Senão → vai como comando direto no console (RCON)
      return consoleHandler(message);
    }
  }

  // 3️⃣ Qualquer outro canal → ignorado
  return;
}

module.exports = router;
