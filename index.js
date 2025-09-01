// index.js
// 🚀 Ponto de entrada do bot

require("dotenv").config(); // carrega variáveis do .env
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

// ===============================
// 1. Cria uma nova instância do cliente Discord
// ===============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,          // eventos de servidores
    GatewayIntentBits.GuildMessages,   // mensagens nos canais
    GatewayIntentBits.MessageContent   // ler conteúdo das mensagens
  ]
});

// ===============================
// 2. Cria a coleção de comandos
// ===============================
client.commands = new Collection();

// ===============================
// 3. Carregar comandos (suporta subpastas)
// ===============================
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`⚠️ O comando em ${filePath} não tem "data" ou "execute".`);
    }
  }
}

// ===============================
// 4. Carregar eventos
// ===============================
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ===============================
// 5. Listener para interações (Slash Commands)
// ===============================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ Comando não encontrado: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "❌ Erro ao executar o comando.", ephemeral: true });
  }
});

// ===============================
// 6. Login
// ===============================
client.login(process.env.DISCORD_TOKEN);
