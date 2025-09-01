// logs/chatLog.js
// ✳️ Captura mensagens do chat e eventos traduzidos, envia pro Discord
//     Usa o translate.js para formatar mortes, conquistas, entrada/saída
//     Mostra o avatar do jogador (via mc-heads.net)

const { CHAT_CHANNEL_ID } = require("../config/config"); // ID do canal do Discord definido em config.js
const { logEmitter } = require("./logHandler");          // Emissor de eventos que captura as linhas do log do servidor
const { translate } = require("../utils/translate");     // Função que interpreta e categoriza eventos do Minecraft
const { getUUID } = require("../utils/playerCache");     // Busca o UUID de jogadores (quando premium)
const { EmbedBuilder } = require("discord.js");          // Classe para montar embeds bonitos no Discord

// 🔎 Função que resolve a URL do avatar de um jogador
// 1) Tenta pegar o UUID via Mojang/playerCache
// 2) Se conseguir → usa o UUID no mc-heads.net
// 3) Se não conseguir (offline-mode, cracked) → usa o nickname direto no mc-heads.net
async function resolveAvatarIcon(playerName) {
  try {
    const uuid = await getUUID(playerName); // tenta obter UUID pelo nick
    if (uuid) {
      return `https://mc-heads.net/avatar/${uuid}/64`; // avatar oficial pelo UUID
    }
  } catch (e) {
    console.error("❌ Erro ao buscar UUID:", e.message);
  }
  return `https://mc-heads.net/avatar/${encodeURIComponent(playerName)}/64`; // fallback por nome
}

// 🚀 Função principal que inicia o listener de logs
function startChatLog(client) {
  console.log("💬 ChatLog iniciado → mensagens + eventos vão para o canal do Discord");

  // 🔔 Escuta evento de nova linha no log do servidor
  logEmitter.on("logLine", async (line) => {
    // tenta buscar o canal configurado no Discord
    const canalChat = client.channels.cache.get(CHAT_CHANNEL_ID);
    if (!canalChat) return; // se não encontrou o canal, sai

    // ========================
    // 🎮 MENSAGENS NORMAIS DO CHAT
    // ========================
    if (line.includes("MinecraftServer/]: <")) {
      // extrai somente o trecho de chat do log
      const rawMsg = line.split("MinecraftServer/]: ").pop();
      const match = rawMsg.match(/^<([^>]+)>\s(.+)$/); // regex captura <Jogador> mensagem

      if (match) {
        const usuario = match[1];   // nome do jogador
        const mensagem = match[2];  // texto digitado

        // resolve URL do avatar (UUID ou nick)
        const icon = await resolveAvatarIcon(usuario);

        // monta embed bonitinho
        const embed = new EmbedBuilder()
          .setColor(0x3498db) // azul
          .setAuthor({ name: usuario, iconURL: icon }) // mostra nome + avatar
          .setDescription(`💬 ${mensagem}`) // mensagem do chat
          .setTimestamp(); // adiciona timestamp automático

        // envia embed no canal configurado
        canalChat.send({ embeds: [embed] }).catch(console.error);
      }
    }

    // ========================
    // 🏆 EVENTOS TRADUZIDOS (entrada, saída, morte, conquistas, etc.)
    // ========================
    const { tipo, msg, player } = translate(line); // extrai tipo do evento, mensagem formatada e jogador envolvido

    if (tipo !== "default") { // ignora linhas que não são eventos
      // mapa de cores de cada tipo de evento
      const colorMap = {
        join: 0x2ecc71,        // verde → entrou no servidor
        quit: 0xe74c3c,        // vermelho → saiu
        advancement: 0xf1c40f, // amarelo → conquista
        death: 0x9b59b6,       // roxo → morte
        start: 0x1abc9c,       // ciano → servidor iniciou
        stop: 0xe67e22,        // laranja → servidor parou
        default: 0x95a5a6      // cinza → fallback
      };

      let author = undefined;  // dados do autor (nick + icon)
      let thumbUrl = undefined; // URL da thumbnail (imagem maior no embed)

      if (player) {
        // resolve avatar do player envolvido
        const icon = await resolveAvatarIcon(player);
        author = { name: player, iconURL: icon };
        thumbUrl = icon; // usamos a mesma URL como thumbnail
      }

      // monta embed do evento
      const embed = new EmbedBuilder()
        .setColor(colorMap[tipo] || colorMap.default) // cor baseada no tipo do evento
        .setDescription(msg) // mensagem formatada pelo translate.js
        .setTimestamp();     // timestamp automático

      if (author) embed.setAuthor(author);       // adiciona autor se houver
      if (thumbUrl) embed.setThumbnail(thumbUrl); // adiciona thumbnail se houver

      // envia embed no canal do Discord
      canalChat.send({ embeds: [embed] }).catch(console.error);
    }
  });
}

module.exports = startChatLog;
