// index.js
// ✳️ Este é o arquivo principal: cria o cliente do Discord, carrega eventos e faz login.

// 1) Carrega variáveis de ambiente do arquivo .env (ex: DISCORD_TOKEN)
require("dotenv").config();

// 2) Importa classes do discord.js
const { Client, GatewayIntentBits, Collection } = require("discord.js");

// 3) Módulos nativos do Node para ler pastas/arquivos (vamos carregar eventos automaticamente)
const fs = require("fs");
const path = require("path");

// 4) Carrega nossa configuração consolidada (lê process.env e valida)
const config = require("./config/config");

// 5) Cria a instância do cliente do Discord com os "intents"
//    Intents dizem ao Discord "quais eventos eu quero receber".
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,          // eventos de servidor (guild)
    GatewayIntentBits.GuildMessages,   // eventos de mensagens em canais de texto
    GatewayIntentBits.MessageContent   // permite ler o conteúdo da mensagem (texto)
  ]
});

// 6) Espaço para comandos (no futuro, quando você criar /comandos)
client.commands = new Collection();

// 7) Carrega automaticamente todos os eventos de ./events/*.js
//    Assim, para adicionar um evento novo, basta criar um arquivo lá.
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));

  // Espera-se que cada arquivo exporte { name, once, execute }
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// 8) Faz login no Discord com o token (nunca codifique token aqui, use .env!)
client.login(config.DISCORD_TOKEN);
