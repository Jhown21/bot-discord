// commands/admin/restart.js
// 🔄 Reinicia o servidor Minecraft (stop + start)

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const { OWNER_ID } = require("../../config/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("🔄 Reinicia o servidor Minecraft"),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: "❌ Você não tem permissão para usar este comando.", ephemeral: true });
    }

    await interaction.reply("♻️ Reiniciando servidor...");

    // Primeiro para o serviço
    exec("service minecraft stop", (err) => {
      if (err) return interaction.editReply(`❌ Erro ao parar: ${err.message}`);

      // Aguarda 5 segundos e inicia de novo
      setTimeout(() => {
        exec("service minecraft start", (error) => {
          if (error) return interaction.editReply(`❌ Erro ao iniciar: ${error.message}`);

          const embed = new EmbedBuilder()
            .setColor(0xf39c12)
            .setTitle("♻️ Servidor reiniciado!")
            .setDescription("O serviço **minecraft** foi reiniciado com sucesso.")
            .setTimestamp();

          interaction.editReply({ embeds: [embed] });
        });
      }, 5000);
    });
  }
};
