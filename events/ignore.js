// events/ignore.js
// ✳️ Este módulo decide se uma mensagem deve ser ignorada ou não.
//    Assim a lógica não fica espalhada em vários lugares.

const { OWNER_ID , FULL_LOGS_CHANNEL_ID } = require("../config/config");

function ignore(message) {
  // Exemplo 1: Ignorar mensagens privadas (DMs)
  if (message.channel.type === 1) return true;

  // Exemplo 2: Ignorar mensagens de usuários que não são o dono
  // Mas só se estiver no canal admin
  if (message.channel.id === FULL_LOGS_CHANNEL_ID && message.author.id !== OWNER_ID) {
    return true;
  }

  // Exemplo 3: Ignorar mensagens muito curtas (exemplo prático)
  if (message.content.length < 2) return true;

  // Caso contrário, NÃO ignora
  return false;
}

module.exports = ignore;
