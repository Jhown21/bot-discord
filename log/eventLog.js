const { EmbedBuilder } = require("discord.js");
const { LOGS_CHANNEL_ID, CHAT_CHANNEL_ID, SEND_EVENTS_TO_CHAT } = require("../config/config");
const { logEmitter } = require("./logHandler");
const { translate } = require("../utils/translate");
const { getAvatar } = require("../utils/avatar");

function startEventLog(client) {
  console.log("📡 EventLog iniciado → eventos traduzidos vão para o canal de logs");

  logEmitter.on("logLine", async (line) => {
    const { tipo, msg, player } = translate(line);
    if (tipo === "default") return;

    const colorMap = {
      join: 0x2ecc71,
      quit: 0xe74c3c,
      advancement: 0xf1c40f,
      death: 0x9b59b6,
      server_start: 0x3498db,
      server_stop: 0xe67e22,
      default: 0x95a5a6,
    };

    const embed = new EmbedBuilder()
      .setColor(colorMap[tipo] || colorMap.default)
      .setDescription(msg)
      .setTimestamp();

    if (player) {
      const icon = await getAvatar(player);
      embed.setAuthor({ name: player, iconURL: icon });
      embed.setThumbnail(icon);
    }

    // Sempre envia para o canal de logs
    const canalLogs = client.channels.cache.get(LOGS_CHANNEL_ID);
    if (canalLogs) canalLogs.send({ embeds: [embed] }).catch(console.error);

    // Opcional: também enviar para o canal de chat
    if (SEND_EVENTS_TO_CHAT) {
      const canalChat = client.channels.cache.get(CHAT_CHANNEL_ID);
      if (canalChat) canalChat.send({ embeds: [embed] }).catch(console.error);
    }
  });
}

module.exports = startEventLog;
