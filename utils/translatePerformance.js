// utils/translatePerformance.js
// ✳️ Traduz mensagens de performance do Minecraft

function translatePerformance(line) {
  let tipo = "default";
  let msg = null;
  let severity = "info"; // info | warning | critical

  if (line.includes("Can't keep up!")) {
    tipo = "lag";
    msg = "⚠️ **O servidor não está conseguindo acompanhar os ticks (lag detectado).**";
    severity = "warning";
  } else if (line.includes("Running") && line.includes("ticks behind")) {
    tipo = "tps";
    msg = "⏱️ **O servidor está atrasado nos ticks! TPS baixo detectado.**";
    severity = "warning";
  } else if (line.toLowerCase().includes("watchdog")) {
    tipo = "watchdog";
    msg = "⛔ **Watchdog detectou travamento do servidor!**";
    severity = "critical";
  }

  return { tipo, msg, severity };
}

module.exports = { translatePerformance };
