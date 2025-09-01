// logs/eventLog.js
// ✳️ Captura eventos traduzidos (entrada, saída, morte, conquistas, start/stop)
//     Envia para o canal definido em LOGS_CHANNEL_ID
//     Mostra avatar do jogador via mc-heads.net (funciona com UUID ou nickname)

const { EmbedBuilder } = require("discord.js");
const { LOGS_CHANNEL_ID } = require("../config/config"); // Canal de logs do Discord
const { logEmitter } = require("./logHandler");           // Emissor de logs do servidor
const { translate } = require("../utils/translate");      // Função que interpreta os eventos
const { getUUID } = require("../utils/playerCache");      // Utilitário para buscar UUID

// 🔎 Resolve URL do avatar do jogador
async function resolveAvatarIcon(playerName) {
  try {
    const uuid = await getUUID(playerName);
    if (uuid) {
      return `https://mc-heads.net/avatar/${uuid}/64`; // pelo UUID (premium)
    }
  } catch (e) {
    console.error("❌ Erro ao buscar UUID:", e.message);
  }
  return `https://mc-heads.net/avatar/${encodeURIComponent(playerName)}/64`; // fallback por nome (offline-mode)
}

function startEventLog(client) {
  console.log("📡 EventLog iniciado → enviando eventos traduzidos para LOGS_CHANNEL");

  logEmitter.on("logLine", async (line) => {
    const { tipo, msg, player } = translate(line); // traduz a linha para tipo, mensagem e jogador

    if (tipo === "default") return; // ignora linhas irrelevantes

    // 🎨 Paleta de cores por tipo de evento
    const colorMap = {
      join: 0x2ecc71,        // verde
      quit: 0xe74c3c,        // vermelho
      advancement: 0xf1c40f, // amarelo
      death: 0x9b59b6,       // roxo
      server_start: 0x3498db,// azul
      server_stop: 0xe67e22, // laranja
      default: 0x95a5a6,     // cinza
    };

    // 🖼️ Cria embed do evento
    const embed = new EmbedBuilder()
      .setColor(colorMap[tipo] || colorMap.default)
      .setDescription(msg) // mensagem já traduzida
      .setTimestamp();

    // 👤 Se houver jogador, adiciona nome + avatar
    if (player) {
      const icon = await resolveAvatarIcon(player);
      embed.setAuthor({
        name: player,
        iconURL: icon,
      });
    }

    // 📩 Envia para o canal de logs configurado
    const canal = client.channels.cache.get(LOGS_CHANNEL_ID);
    if (canal) canal.send({ embeds: [embed] }).catch(console.error);
  });
}

module.exports = startEventLog;
