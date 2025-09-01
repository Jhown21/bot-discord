// utils/avatar.js
// ✳️ Resolve avatar do jogador para exibir no Discord
//     Usa mc-heads.net (funciona com UUID ou nickname)

const { getUUID } = require("./playerCache");

async function getAvatar(playerName, size = 64) {
  try {
    const uuid = await getUUID(playerName);
    if (uuid) {
      return `https://mc-heads.net/avatar/${uuid}/${size}`;
    }
  } catch (e) {
    console.error("❌ Erro ao buscar UUID:", e.message);
  }
  return `https://mc-heads.net/avatar/${encodeURIComponent(playerName)}/${size}`;
}

module.exports = { getAvatar };
