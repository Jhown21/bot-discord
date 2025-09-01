// commands/admin/start.js
// 🚀 Inicia o serviço do Minecraft
// Só o dono (OWNER_ID) pode rodar

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const { OWNER_ID } = require("../../config/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("🚀 Inicia o servidor Minecraft"),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: "❌ Você não tem permissão para usar este comando.", ephemeral: true });
    }

    interaction.reply("⏳ Verificando servidor...");

    exec("systemctl is-active minecraft", (err, stdout) => {
      if (stdout.trim() === "active") {
        return interaction.editReply("⚡ O servidor já está rodando!");
      }

      exec("service minecraft start", (error) => {
        if (error) {
          return interaction.editReply(`❌ Erro ao iniciar: ${error.message}`);
        }

        const embed = new EmbedBuilder()
          .setColor(0x2ecc71)
          .setTitle("✅ Servidor iniciado!")
          .setDescription("O serviço **minecraft** foi iniciado com sucesso.")
          .setTimestamp();

        interaction.editReply({ embeds: [embed] });
      });
    });
  }
};
