// events/discordChat.js
// ✳️ Captura mensagens enviadas no canal do Discord (CHAT_CHANNEL_ID)
//     e envia para o chat do Minecraft via RCON com formatação bonita.

const { CHAT_CHANNEL_ID, RCON_HOST, RCON_PORT, RCON_PASS } = require("../config/config");
const { Rcon } = require("rcon-client");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    // Ignora bots
    if (message.author.bot) return;

    // Só aceita mensagens do canal de chat configurado
    if (message.channel.id !== CHAT_CHANNEL_ID) return;

    try {
      // Conecta ao RCON
      const rcon = await Rcon.connect({
        host: RCON_HOST,
        port: RCON_PORT,
        password: RCON_PASS,
      });

      // Monta a mensagem formatada em JSON (tellraw)
      const jsonMsg = JSON.stringify([
        { text: "[DISCORD] ", color: "dark_blue", bold: true },
        { text: `${message.author.username} `, color: "gold" },
        { text: `: ${message.content}`, color: "white" }
      ]);

      // Envia para todos os jogadores
      await rcon.send(`tellraw @a ${jsonMsg}`);
      await rcon.end();

      console.log(`📤 Mensagem enviada para o Minecraft: ${message.author.username}: ${message.content}`);
    } catch (err) {
      console.error("❌ Erro ao enviar mensagem para o Minecraft:", err);
    }
  }
};
