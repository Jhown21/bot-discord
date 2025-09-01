// logs/chatLog.js
// ✳️ Captura mensagens do chat do Minecraft e também eventos traduzidos
//     Usa o translate.js para formatar mortes, conquistas, entrada/saída

const { CHAT_CHANNEL_ID } = require("../config/config");
const { logEmitter } = require("./logHandler");
const { translate } = require("../utils/translate");

function startChatLog(client) {
  console.log("💬 ChatLog iniciado → mensagens + eventos vão para o canal do Discord");

  logEmitter.on("logLine", (line) => {
    const canalChat = client.channels.cache.get(CHAT_CHANNEL_ID);
    if (!canalChat) return;

    // ========================
    // 🎮 Mensagens normais do chat
    // ========================
    if (line.includes("MinecraftServer/]: <")) {
      const rawMsg = line.split("MinecraftServer/]: ").pop();
      const match = rawMsg.match(/^<([^>]+)>\s(.+)$/);

      if (match) {
        const usuario = match[1];
        const mensagem = match[2];

        // URL do avatar baseado no nick
        const avatarUrl = `https://crafatar.com/avatars/${usuario}?size=64&overlay`;

        canalChat.send({
          embeds: [{
            color: 0x3498db, // azul
            author: {
              name: usuario,
              icon_url: avatarUrl // 👤 ícone do jogador
            },
            description: `💬 ${mensagem}`,
            timestamp: new Date()
          }]
        }).catch(console.error);
      }
    }

    // ========================
    // 🏆 Eventos traduzidos (entrada, saída, morte, conquista, etc.)
    // ========================
    const { tipo, msg, player } = translate(line); // vamos capturar também o nome do jogador

    if (tipo !== "default") {
      const colorMap = {
        join: 0x2ecc71,        // verde
        quit: 0xe74c3c,        // vermelho
        advancement: 0xf1c40f, // amarelo
        death: 0x9b59b6,       // roxo
        start: 0x1abc9c,       // ciano
        stop: 0xe67e22,        // laranja
        default: 0x95a5a6      // cinza
      };

      const avatarUrl = player ? `https://crafatar.com/avatars/${player}?size=64&overlay` : null;

      canalChat.send({
        embeds: [{
          color: colorMap[tipo] || colorMap.default,
          description: msg,
          timestamp: new Date(),
          thumbnail: avatarUrl ? { url: avatarUrl } : undefined // se tiver player, mostra a cabeça
        }]
      }).catch(console.error);
    }
  });
}

module.exports = startChatLog;
