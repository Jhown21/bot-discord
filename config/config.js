// config/config.js
// ✳️ Junta e valida todas as variáveis de ambiente em um único objeto "config".
//    Vantagem: qualquer arquivo do projeto importa "config" e usa as chaves com segurança.

function required(name, value) {
  // Helper: se a variável estiver faltando, lança erro claro.
  if (!value || String(value).trim() === "") {
    throw new Error(`Variável de ambiente ausente: ${name}. Defina no .env`);
  }
  return value;
}

const config = {
  // Token do bot (nunca commitar isso! fica no .env)
  DISCORD_TOKEN: required("DISCORD_TOKEN", process.env.DISCORD_TOKEN),

  // IDs da aplicação e guild (usados quando você for registrar slash commands)
  CLIENT_ID: required("CLIENT_ID", process.env.CLIENT_ID),
  GUILD_ID: required("GUILD_ID", process.env.GUILD_ID),

  // Canais (você copia os IDs do Discord com o "modo desenvolvedor" ligado)
  CHAT_CHANNEL_ID: required("CHAT_CHANNEL_ID", process.env.CHAT_CHANNEL_ID),
  CHAT_COMMANDS_CHANNEL_ID: required("CHAT_COMMANDS_CHANNEL_ID", process.env.CHAT_COMMANDS_CHANNEL_ID),
  LOGS_CHANNEL_ID: required("LOGS_CHANNEL_ID", process.env.LOGS_CHANNEL_ID),
  FULL_LOGS_CHANNEL_ID: required("FULL_LOGS_CHANNEL_ID", process.env.FULL_LOGS_CHANNEL_ID),
  ADMIN_CHANNEL_ID: required("ADMIN_CHANNEL_ID", process.env.ADMIN_CHANNEL_ID),

  // Admin (seu ID de usuário para permissões especiais)
  OWNER_ID: required("OWNER_ID", process.env.OWNER_ID),

  // RCON (Minecraft)
  RCON_HOST: required("RCON_HOST", process.env.RCON_HOST),
  RCON_PORT: Number(required("RCON_PORT", process.env.RCON_PORT)),
  RCON_PASS: required("RCON_PASS", process.env.RCON_PASS),

  // Logs (para quando você criar o watcher de latest.log)
  LOG_FILE: required("LOG_FILE", process.env.LOG_FILE),

  // Mandar eventos para o canal de texto tambem
  SEND_EVENTS_TO_CHAT: process.env.SEND_EVENTS_TO_CHAT === "true",
};

module.exports = config;
