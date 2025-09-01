// logs/fullLog.js
// ✳️ Envia TODO o conteúdo do latest.log em tempo real para o canal FULL_LOGS.
//    Agora: se muitos logs chegarem rápido, ele agrupa até 10 linhas (ou 1800 chars)
//    e envia de uma vez só para não estourar limite do Discord.

const { EmbedBuilder } = require("discord.js");
const { FULL_LOGS_CHANNEL_ID } = require("../config/config");
const { logEmitter } = require("./logHandler");

function parseLog(line) {
  const upper = line.toUpperCase();

  if (upper.includes("ERROR") || upper.includes("SEVERE") || upper.includes("EXCEPTION")) {
    return { color: 0xe74c3c, emoji: "🔴" }; // Vermelho
  }
  if (upper.includes("WARN")) {
    return { color: 0xf1c40f, emoji: "🟡" }; // Amarelo
  }
  if (upper.includes("INFO")) {
    return { color: 0x2ecc71, emoji: "🟢" }; // Verde
  }

  return { color: 0x95a5a6, emoji: "⚪" }; // Cinza padrão
}

function startFullLog(client) {
  console.log("📡 FullLog iniciado → enviando logs para o canal FULL_LOGS");

  const buffer = []; // guarda logs temporários
  let timer = null;

  logEmitter.on("logLine", (line) => {
    buffer.push(line);

    // Limite de segurança → se passar 10 linhas OU 1800 chars, envia já
    const totalChars = buffer.join("\n").length;
    if (buffer.length >= 10 || totalChars >= 1800) {
      flushBuffer(client, buffer);
    }

    // Caso não atinja limite, espera 1s para enviar lote
    if (!timer) {
      timer = setTimeout(() => {
        flushBuffer(client, buffer);
        timer = null;
      }, 1000);
    }
  });
}

function flushBuffer(client, buffer) {
  if (buffer.length === 0) return;

  const canal = client.channels.cache.get(FULL_LOGS_CHANNEL_ID);
  if (!canal) {
    buffer.length = 0;
    return;
  }

  // Usa cor/emoji do último log como "prioridade"
  const { color, emoji } = parseLog(buffer[buffer.length - 1]);

  const embed = new EmbedBuilder()
    .setColor(color)
    .setDescription(`${emoji} \`\`\`\n${buffer.join("\n")}\n\`\`\``)
    .setTimestamp();

  canal.send({ embeds: [embed] }).catch(console.error);

  buffer.length = 0; // limpa o buffer
}

module.exports = startFullLog;
