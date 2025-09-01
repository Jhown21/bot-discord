// logs/performanceLog.js
// ✳️ Captura logs de performance e envia alertas no canal de logs.
//    Usa translatePerformance.js para traduzir mensagens.

const { EmbedBuilder } = require("discord.js");
const { LOGS_CHANNEL_ID } = require("../config/config");
const { logEmitter } = require("./logHandler");
const { translatePerformance } = require("../utils/translatePerformance");

function startPerformanceLog(client) {
  console.log("📡 PerformanceLog iniciado → monitorando lag, TPS e memória");

  logEmitter.on("logLine", (line) => {
    const { tipo, msg } = translatePerformance(line);

    if (tipo === "default" || !msg) return; // ignora irrelevantes

    const colorMap = {
      lag: 0xf1c40f,      // amarelo
      tps: 0xe67e22,      // laranja
      memory: 0x9b59b6,   // roxo
      watchdog: 0xe74c3c, // vermelho forte
      default: 0x95a5a6,  // cinza
    };

    const embed = new EmbedBuilder()
      .setColor(colorMap[tipo] || colorMap.default)
      .setDescription(msg)
      .setTimestamp();

    const canal = client.channels.cache.get(LOGS_CHANNEL_ID);
    if (canal) canal.send({ embeds: [embed] }).catch(console.error);
  });
}

module.exports = startPerformanceLog;
