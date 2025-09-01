const { EmbedBuilder } = require("discord.js");
const { LOGS_CHANNEL_ID } = require("../config/config");
const { logEmitter } = require("./logHandler");
const { translate } = require("../utils/translate");
const { getUUID } = require("../utils/playerCache");

function startEventLog(client) {
  console.log("📡 EventLog iniciado → enviando eventos traduzidos para LOGS_CHANNEL");

  logEmitter.on("logLine", async (line) => {
    const { tipo, msg, player } = translate(line);

    if (tipo === "default") return; // ignora irrelevantes

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
      const uuid = await getUUID(player);
      embed.setAuthor({
        name: player,
        iconURL: uuid
          ? `https://crafatar.com/avatars/${uuid}?overlay`
          : `https://crafatar.com/avatars/${player}?overlay`, // fallback por nick
      });
    }

    const canal = client.channels.cache.get(LOGS_CHANNEL_ID);
    if (canal) canal.send({ embeds: [embed] }).catch(console.error);
  });
}

module.exports = startEventLog;
