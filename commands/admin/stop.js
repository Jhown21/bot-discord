// commands/admin/stop.js
// 🛑 Para o servidor Minecraft com segurança (save-all + stop)

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Rcon } = require("rcon-client");
const { OWNER_ID, RCON_HOST, RCON_PORT, RCON_PASS } = require("../../config/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("🛑 Para o servidor Minecraft"),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: "❌ Você não tem permissão para usar este comando.", ephemeral: true });
    }

    await interaction.reply("⏳ Enviando comandos para salvar e parar...");

    try {
      const rcon = await Rcon.connect({ host: RCON_HOST, port: RCON_PORT, password: RCON_PASS });
      await rcon.send("save-all");
      await rcon.send("stop");
      await rcon.end();

      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("🛑 Servidor parado!")
        .setDescription("O servidor foi **salvo** e parado com segurança.")
        .setTimestamp();

      interaction.editReply({ embeds: [embed] });
    } catch (err) {
      interaction.editReply(`❌ Erro ao parar: ${err.message}`);
    }
  }
};
