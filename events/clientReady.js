// events/clientReady.js
// ✳️ Disparado quando o bot conecta ao Discord
// Aqui ativamos os módulos principais:
//  - Atualizador de status dinâmico
//  - FullLog (todos os logs brutos)
//  - EventLog (entradas, saídas, conquistas, mortes, start/stop)
//  - PerformanceLog (lag, TPS, memória)

// importa os utilitários/módulos que criamos
const startStatusUpdater = require("../utils/updateStatus");
const startFullLog = require("../log/fullLog");
const startEventLog = require("../log/eventLog");
const startPerformanceLog = require("../log/performanceLog"); // <-- novo

module.exports = {
  name: "clientReady", // em discord.js v15+, o evento é "clientReady"
  once: true,          // roda só uma vez quando o bot entra online

  execute(client) {
    // 🖥️ Mostra no terminal que o bot entrou
    console.log(`🤖 Bot logado como ${client.user.tag}`);

    // 🔹 Ativa o status dinâmico (players online, uptime etc.)
    startStatusUpdater(client);

    // 🔹 Ativa o full log (canal com tudo do servidor)
    startFullLog(client);

    // 🔹 Ativa os logs de eventos importantes (entradas, saídas, conquistas, mortes)
    startEventLog(client);

    // 🔹 Ativa logs de performance (lag, TPS baixo, memória/GC)
    startPerformanceLog(client); // <-- agora ligado aqui também
  }
};
