// deploy-commands.js
// 🚀 Registra TODOS os comandos do bot no Discord (slash commands)

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = require("./config/config");

// Array onde vamos colocar todos os comandos encontrados
const commands = [];

// Caminho base da pasta "commands"
const foldersPath = path.join(__dirname, "commands");

// Lê todas as subpastas (admin, normal, etc.)
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️ O comando em ${filePath} está faltando "data" ou "execute".`);
    }
  }
}

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🔄 Atualizando ${commands.length} comandos no Discord...`);

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("✅ Comandos atualizados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao registrar comandos:", error);
  }
})();
