// log/chatLog.js
// ✳️ Captura mensagens normais do chat do Minecraft e envia para o Discord

const { CHAT_CHANNEL_ID } = require("../config/config");
const { logEmitter } = require("./logHandler");
const { EmbedBuilder } = require("discord.js");
const { getAvatar } = require("../utils/avatar");

function startChatLog(client) {
  console.log("💬 ChatLog iniciado → mensagens normais vão para o canal de chat");

  logEmitter.on("logLine", async (line) => {
    const canalChat = client.channels.cache.get(CHAT_CHANNEL_ID);
    if (!canalChat) return;

    // 🎮 Mensagens de chat no formato: <Nick> mensagem
    if (line.includes("MinecraftServer/]: <")) {
      const rawMsg = line.split("MinecraftServer/]: ").pop();
      const match = rawMsg.match(/^<([^>]+)>\s(.+)$/);

      if (match) {
        const usuario = match[1];
        const mensagem = match[2];

        const icon = await getAvatar(usuario);

        const embed = new EmbedBuilder()
          .setColor(0x3498db)
          .setAuthor({ name: usuario, iconURL: icon })
          .setDescription(`💬 ${mensagem}`)
          .setTimestamp();

        canalChat.send({ embeds: [embed] }).catch(console.error);
      }
    }
  });
}

module.exports = startChatLog;
