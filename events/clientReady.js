// events/clientReady.js
// ✳️ Disparado quando o bot conecta ao Discord
// Aqui ativamos os módulos principais:
//  - Atualizador de status dinâmico
//  - FullLog (todos os logs brutos)
//  - EventLog (entradas, saídas, conquistas, mortes, start/stop)
//  - PerformanceLog (lag, TPS, memória)

// importa os utilitários/módulos que criamos
const { updateStatus } = require("../utils/updateStatus");
const { startLogHandler } = require("../log/logHandler"); // importa o start
const startFullLog = require("../log/fullLog");
const startEventLog = require("../log/eventLog");
const startPerformanceLog = require("../log/performanceLog");
const startChatLog = require("../log/chatLog");

module.exports = {
  name: "clientReady",
  once: true,
  execute(client) {
    console.log(`🤖 Bot logado como ${client.user.tag}`);

    // 🔹 Inicia captura real dos logs
    startLogHandler();

    // 🔹 Conecta os módulos que escutam o logEmitter
    updateStatus(client);
    startFullLog(client);
    startEventLog(client);
    startPerformanceLog(client);
    startChatLog(client);
  }
};