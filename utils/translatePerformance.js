// utils/translatePerformance.js
// ✳️ Traduz mensagens de performance do Minecraft para português
//     Compatível com Vanilla, Forge e NeoForge (Spark, AllTheLeaks, TickProfiler, etc.)
//     Inclui sistema de debounce → evita flood de mensagens duplicadas em pouco tempo.

const lastMessages = new Map(); // cache { msg: timestamp }

function shouldSend(msg, cooldownMs = 10_000) {
  if (!msg) return false;
  const now = Date.now();
  const last = lastMessages.get(msg) || 0;

  if (now - last < cooldownMs) {
    // ainda dentro do intervalo → ignora
    return false;
  }

  // atualiza timestamp
  lastMessages.set(msg, now);
  return true;
}

function translatePerformance(line) {
  let tipo = "default";
  let msg = null;

  const lower = line.toLowerCase();

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
  // 🔍 AllTheLeaks (NeoForge/ATM10)
  // ======================
  else if (lower.includes("alltheleaks") && lower.includes("memory leaks detected")) {
    tipo = "memory";
    msg = "🔍 **AllTheLeaks detectou possíveis vazamentos de memória.**";
  }

  // ======================
  // 🧹 Garbage Collector
  // ======================
  else if (lower.includes("explicit gc") || lower.includes("explicit gc disabled")) {
    tipo = "memory";
    msg = "🧹 **Execução explícita do Garbage Collector detectada.**";
  }

  // ======================
  // 💾 Memory leaks (genérico)
  // ⚠️ Executa só se não for AllTheLeaks
  // ======================
  else if ((lower.includes("memory leak") || lower.includes("leaks detected")) && !lower.includes("alltheleaks")) {
    tipo = "memory";
    msg = "💾 **Possível vazamento de memória detectado.**";
  }

  // ======================
  // ⛔ Watchdog (travamento)
  // ======================
  else if (lower.includes("watchdog")) {
    tipo = "watchdog";
    msg = "⛔ **Watchdog detectou travamento do servidor!**";
  }

  // ======================
  // 📊 Spark profiler
  // ======================
  else if (lower.includes("spark profiler")) {
    tipo = "profiler";
    msg = "📊 **Spark registrou dados de performance.**";
  }

  else if (lower.includes("spark heapdump")) {
    tipo = "memory";
    msg = "📊 **Spark gerou um heapdump de memória (análise de consumo).**";
  }

  // ======================
  // 🕒 TickProfiler (Forge)
  // ======================
  else if (lower.includes("tickprofiler")) {
    tipo = "profiler";
    msg = "🕒 **TickProfiler registrou análise de performance (ticks por segundo).**";
  }

  // ======================
  // 🐌 Processos lentos genéricos
  // ======================
  else if (lower.includes("ms behind") || lower.includes("took too long")) {
    tipo = "lag";
    msg = "🐌 **Um processo demorou mais do que o esperado (lag).**";
  }

  // 🔙 Retorna só se a mensagem for nova ou estiver fora do cooldown
  if (!shouldSend(msg)) {
    return { tipo: "default", msg: null }; // ignora duplicado
  }

  return { tipo, msg };
}

module.exports = { translatePerformance };
