// events/clientReady.js
// ✳️ Disparado quando o cliente conecta ao Discord.
//    Aqui a gente só loga e inicia o atualizador de status.

const startStatusUpdater = require("../utils/updateStatus");

module.exports = {
  name: "clientReady", // v15+ usa "clientReady" em vez de "ready"
  once: true,          // roda uma vez (quando o bot entra online)

  execute(client) {
    // Mostra no terminal com qual usuário ele logou (ex: MeuBot#1234)
    console.log(`🤖 Bot logado como ${client.user.tag}`);

    // Inicia o loop que atualiza o "jogando ..." com players online
    startStatusUpdater(client);
  }
};
