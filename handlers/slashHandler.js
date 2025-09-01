// handlers/slashHandler.js
// ✳️ Processa slash commands
//    Os comandos ficam organizados em duas pastas:
//    - commands/normal/
//    - commands/admin/

const fs = require("fs");
const path = require("path");

function loadSlashCommands(client) {
  client.slashCommands = new Map();

  const basePath = path.join(__dirname, "..", "commands");

  // Carrega normais
  const normalPath = path.join(basePath, "normal");
  fs.readdirSync(normalPath).forEach(file => {
    const command = require(path.join(normalPath, file));
    client.slashCommands.set(command.name, command);
  });

  // Carrega admin
  const adminPath = path.join(basePath, "admin");
  fs.readdirSync(adminPath).forEach(file => {
    const command = require(path.join(adminPath, file));
    client.slashCommands.set(command.name, command);
  });
}

async function handleSlash(interaction, client) {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: "❌ Erro ao executar o comando.", ephemeral: true });
  }
}

module.exports = { loadSlashCommands, handleSlash };
