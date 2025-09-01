// events/messageCreate.js
// ✳️ Disparado sempre que alguém manda mensagem no Discord
//    Aqui não processamos nada, apenas passamos para o roteador.

const router = require("../handlers/router");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // Ignora mensagens de bots
    if (message.author.bot) return;

    // Repassa para o roteador decidir o destino
    router(message);
  }
};
