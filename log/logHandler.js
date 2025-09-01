// logs/logHandler.js
// ✳️ Responsável por CAPTURAR as linhas do log em tempo real.
//    Usa "tail -f" para seguir o arquivo latest.log
//    e emite um evento interno para outros módulos tratarem.

const { spawn } = require("child_process");
const EventEmitter = require("events");
const { LOG_FILE } = require("../config/config");

// Criamos um EventEmitter → um "megafone" que grita para outros módulos
class LogEmitter extends EventEmitter {}
const logEmitter = new LogEmitter();

// Função que inicia o tail -f
function startLogHandler() {
  console.log("📂 Iniciando captura de logs:", LOG_FILE);

  // tail -f LOG_FILE
  const tail = spawn("tail", ["-n", "0", "-F", LOG_FILE]);

  // Sempre que sair uma linha nova do log...
  tail.stdout.on("data", (data) => {
    const lines = data.toString().split("\n").filter(Boolean);
    for (const line of lines) {
      logEmitter.emit("logLine", line); // 🔊 emite evento para outros módulos
    }
  });

  // Captura erros do tail
  tail.stderr.on("data", (data) => {
    console.error("❌ Erro no tail:", data.toString());
  });

  // Se o processo morrer, tenta reiniciar
  tail.on("close", (code) => {
    console.warn(`⚠️ Tail finalizado (code ${code}), reiniciando em 5s...`);
    setTimeout(startLogHandler, 5000);
  });
}

// Exportamos o emitter e o start
module.exports = { startLogHandler, logEmitter };
