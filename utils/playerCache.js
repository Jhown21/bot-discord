// utils/playerCache.js
// ✳️ Cache local de UUIDs de jogadores (persistente em JSON)
//    - Evita consultas repetidas à Mojang
//    - Salva e carrega de um arquivo local

const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// Caminho do arquivo JSON
const CACHE_FILE = path.join(__dirname, "playerCache.json");

// Carrega cache existente (se houver)
let cache = {};
if (fs.existsSync(CACHE_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch (err) {
    console.error("❌ Erro ao carregar playerCache.json:", err.message);
  }
}

// Função auxiliar para salvar o cache em disco
function saveCache() {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Erro ao salvar playerCache.json:", err.message);
  }
}

// Função principal: retorna UUID de um jogador
async function getUUID(nick) {
  const lower = nick.toLowerCase();

  // 1️⃣ Se já está no cache → retorna
  if (cache[lower]) return cache[lower];

  // 2️⃣ Se não estiver → consulta Mojang
  try {
    const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${nick}`);
    if (!res.ok) throw new Error("Jogador não encontrado na Mojang");
    const data = await res.json();

    const uuid = data.id; // ex: "f84c6a790a4e45d6a0290d8c10a2c3a0"
    cache[lower] = uuid;
    saveCache(); // salva em disco
    return uuid;
  } catch (err) {
    console.error(`❌ Erro ao buscar UUID para ${nick}:`, err.message);
    return null;
  }
}

module.exports = { getUUID };
