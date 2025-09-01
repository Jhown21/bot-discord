// utils/translatePerformance.js
// ✳️ Traduz mensagens de performance do Minecraft para português
//     Compatível com Vanilla, Forge e NeoForge (mods como Spark, AllTheLeaks, TickProfiler, etc.)

function translatePerformance(line) {
  let tipo = "default";
  let msg = null;

  // ======================
  // ⚠️ LAG VANILLA
  // ======================
  if (line.includes("Can't keep up!")) {
    tipo = "lag";
    msg = "⚠️ **O servidor não está conseguindo acompanhar os ticks (lag detectado).**";
  }

  else if (line.includes("Running") && line.includes("ticks behind")) {
    tipo = "tps";
    msg = "⏱️ **O servidor está atrasado nos ticks! TPS baixo detectado.**";
  }

  // ======================
  // 🧹 Garbage Collector
  // ======================
  else if (line.toLowerCase().includes("explicit gc") || line.toLowerCase().includes("explicit gc disabled")) {
    tipo = "memory";
    msg = "🧹 **Execução explícita do Garbage Collector detectada.**";
  }

  // ======================
  // 💾 Memory leaks
  // ======================
  else if (line.toLowerCase().includes("memory leak") || line.toLowerCase().includes("leaks detected")) {
    tipo = "memory";
    msg = "💾 **Possível vazamento de memória detectado.**";
  }

  // ======================
  // ⛔ Watchdog (travamento)
  // ======================
  else if (line.toLowerCase().includes("watchdog")) {
    tipo = "watchdog";
    msg = "⛔ **Watchdog detectou travamento do servidor!**";
  }

  // ======================
  // 📊 Spark profiler
  // ======================
  else if (line.toLowerCase().includes("spark profiler")) {
    tipo = "profiler";
    msg = "📊 **Spark registrou dados de performance.**";
  }

  else if (line.toLowerCase().includes("spark heapdump")) {
    tipo = "memory";
    msg = "📊 **Spark gerou um heapdump de memória (análise de consumo).**";
  }

  // ======================
  // 🕒 TickProfiler (Forge)
  // ======================
  else if (line.toLowerCase().includes("tickprofiler")) {
    tipo = "profiler";
    msg = "🕒 **TickProfiler registrou análise de performance (ticks por segundo).**";
  }

  // ======================
  // 🔍 AllTheLeaks (NeoForge/ATM10)
  // ======================
  else if (line.toLowerCase().includes("alltheleaks")) {
    tipo = "memory";
    msg = "🔍 **AllTheLeaks detectou possíveis vazamentos de memória.**";
  }

  // ======================
  // Mods que avisam de processamento lento
  // ======================
  else if (line.toLowerCase().includes("ms behind") || line.toLowerCase().includes("took too long")) {
    tipo = "lag";
    msg = "🐌 **Um processo demorou mais do que o esperado (lag).**";
  }

  return { tipo, msg };
}

module.exports = { translatePerformance };
