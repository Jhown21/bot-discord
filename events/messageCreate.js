// events/messageCreate.js
// ✳️ Exemplo didático: como reagir a mensagens com condicionais combinadas.
//    Aqui mostramos:
//    - ignorar bots
//    - responder "ping" → "pong"
//    - checar canal específico
//    - checar dono (OWNER_ID) E canal ao mesmo tempo

const config = require("../config/config");

module.exports = {
  name: "messageCreate",
  once: false, // roda toda vez que chega mensagem

  async execute(message) {
    // 1) Nunca converse com bots (evita loops)
    if (message.author.bot) return;

    // 2) Exemplo simples: ping/pong
    if (message.content.trim().toLowerCase() === "ping") {
      return message.reply("pong!");
    }

    // 3) Exemplo de filtro por canal
    //    Só responde com "oi" se for no canal de chat configurado.
    if (
      message.channel.id === config.CHAT_CHANNEL_ID &&
      message.content.trim().toLowerCase() === "oi"
    ) {
      return message.reply("👋 Olá! Bem-vindo ao canal de chat!");
    }

    // 4) Exemplo de condicional dupla:
    //    Somente o dono pode usar "segredo" e apenas no canal de comandos.
    if (
      message.author.id === config.OWNER_ID &&                         // É o dono?
      message.channel.id === config.CHAT_COMMANDS_CHANNEL_ID &&       // Está no canal certo?
      message.content.trim().toLowerCase() === "segredo"              // Texto certo?
    ) {
      return message.reply("🔒 Acesso autorizado. (Exemplo didático)");
    }

    // 5) Caso queira ver os IDs para configurar .env, descomente:
    // console.log("Canal:", message.channel.id, "Autor:", message.author.id);
  }
};
