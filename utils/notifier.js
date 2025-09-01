// utils/notifier.js
// ✳️ Centraliza o envio de embeds para Discord (padroniza cores, author e thumbnail)

const { EmbedBuilder } = require("discord.js");
const { getAvatar } = require("./avatar");

const colorMap = {
  chat: 0x3498db,
  join: 0x2ecc71,
  quit: 0xe74c3c,
  advancement: 0xf1c40f,
  death: 0x9b59b6,
  server_start: 0x3498db,
  server_stop: 0xe67e22,
  lag: 0xe67e22,
  tps: 0xf39c12,
  watchdog: 0xc0392b,
  default: 0x95a5a6,
};

// options: { tipo, msg, player, showThumb }
// - chat: showThumb padrão = false
// - outros: showThumb padrão = true
async function sendEmbed(client, channelId, { tipo = "default", msg, player, showThumb }) {
  if (!msg) return;

  const embed = new EmbedBuilder()
    .setColor(colorMap[tipo] || colorMap.default)
    .setDescription(msg)
    .setTimestamp();

  let icon;
  if (player) {
    icon = await getAvatar(player);
    embed.setAuthor({ name: player, iconURL: icon });
  }

  // por padrão só coloca thumbnail em eventos (não em chat)
  const shouldThumb = typeof showThumb === "boolean"
    ? showThumb
    : (tipo !== "chat");

  if (shouldThumb && icon) {
    embed.setThumbnail(icon);
  }

  const canal = client.channels.cache.get(channelId);
  if (canal) {
    return canal.send({ embeds: [embed] }).catch(console.error);
  }
}

module.exports = { sendEmbed };
