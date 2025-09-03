// commands/admin/start.js
// 🚀 Inicia o serviço do Minecraft
// Só o dono (OWNER_ID) pode rodar

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { exec } = require("child_process");
const { OWNER_ID } = require("../../config/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("📊 Mostra status do servidor Minecraft"),

  async execute(interaction) {
    // 🔒 Verifica se é o dono
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: "❌ Você não tem permissão para usar este comando.",
        ephemeral: true
      });
    }

    // 🚀 Executa systemctl para puxar dados do serviço
    exec(
      "systemctl show minecraft.service -p ActiveState -p SubState -p MainPID -p MemoryCurrent -p CPUUsageNSec",
      (error, stdout) => {
        if (error) {
          console.error("❌ Erro ao consultar systemctl:", error);
          return interaction.reply("❌ Não consegui pegar o status do serviço.");
        }

        // 📦 Converte as linhas retornadas em objeto
        const status = {};
        stdout.trim().split("\n").forEach(line => {
          const [key, value] = line.split("=");
          status[key] = value;
        });

        // 📊 Converte números para formatos mais legíveis
        const memoryGB = (status.MemoryCurrent / 1024 / 1024 / 1024).toFixed(2);
        const cpuHoras = (status.CPUUsageNSec / 1e9 / 3600).toFixed(1);

        // 🎨 Monta embed para o Discord
        const embed = new EmbedBuilder()
          .setTitle("📊 Status do Servidor Minecraft")
          .addFields(
            { name: "Estado", value: `${status.ActiveState} (${status.SubState})`, inline: true },
            { name: "PID", value: status.MainPID || "-", inline: true },
            { name: "Memória", value: `${memoryGB} GB`, inline: true },
            { name: "CPU", value: `${cpuHoras} h`, inline: true }
          )
          .setColor("Green")
          .setTimestamp();

        interaction.reply({ embeds: [embed] });
      }
    );
  }
};