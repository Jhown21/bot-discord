// utils/translate.js
// ✳️ Centraliza traduções dos eventos do Minecraft para português
//     Retorna um objeto { tipo, msg, player } para ser usado nos embeds do Discord
//     - tipo   → categoria do evento (join, quit, advancement, death, etc.)
//     - msg    → mensagem traduzida para exibir no Discord
//     - player → nome do jogador envolvido (se houver)

function translate(line) {
  let tipo = "default"; // categoria do evento (default = irrelevante)
  let msg = line;       // mensagem padrão = linha original
  let player = null;    // jogador envolvido (se houver)

  // ======================
  // 🎮 ENTRADA NO SERVIDOR
  // ======================
  if (line.includes("joined the game")) {
    player = line.match(/(\w+) joined the game/)?.[1] || "Jogador";
    msg = `🟢 **${player} entrou no servidor**`;
    tipo = "join";
  }

  // ======================
  // 🚪 SAÍDA DO SERVIDOR
  // ======================
  else if (line.includes("left the game")) {
    player = line.match(/(\w+) left the game/)?.[1] || "Jogador";
    msg = `🔴 **${player} saiu do servidor**`;
    tipo = "quit";
  }

  // ======================
  // 🏆 CONQUISTAS
  // ======================
  else if (
    line.includes("has made the advancement") &&
    line.includes("[net.minecraft.server.MinecraftServer/]")
  ) {
    const [, p, adv] = line.match(/(\w+) has made the advancement \[(.+)\]/) || [];
    if (p && adv) {
      player = p;
      msg = `🏆 **${player} conquistou:** ${adv}`;
      tipo = "advancement";
    }
  }

  // ======================
  // ☠️ MORTES
  // ======================
  else if (
    line.includes("was slain by") ||
    line.includes("was shot by") ||
    line.includes("was blown up by") ||
    line.includes("was killed by") ||
    line.includes("was pricked to death") ||
    line.includes("was squashed by") ||
    line.includes("was fireballed by") ||
    line.includes("burned to death") ||
    line.includes("went up in flames") ||
    line.includes("drowned") ||
    line.includes("fell from a high place") ||
    line.includes("hit the ground too hard") ||
    line.includes("fell out of the world") ||
    line.includes("was doomed to fall") ||
    line.includes("blew up") ||
    line.includes("was impaled by") ||
    line.includes("froze to death") ||
    line.includes("starved to death") ||
    line.includes("suffocated in a wall") ||
    line.includes("tried to swim in lava")
  ) {
    player = line.split(" ")[0]; // pega o nick antes da primeira palavra
    msg = line
      .replace("was slain by", "foi morto por")
      .replace("was shot by", "levou um tiro de")
      .replace("was blown up by", "foi explodido por")
      .replace("was killed by", "foi morto por")
      .replace("was pricked to death", "foi espetado até a morte")
      .replace("was squashed by", "foi esmagado por")
      .replace("was fireballed by", "foi atingido por bola de fogo de")
      .replace("burned to death", "queimou até a morte")
      .replace("went up in flames", "pegou fogo")
      .replace("drowned", "se afogou")
      .replace("fell from a high place", "caiu de um lugar alto")
      .replace("hit the ground too hard", "se espatifou no chão")
      .replace("fell out of the world", "caiu no vazio")
      .replace("was doomed to fall", "caiu para a morte")
      .replace("blew up", "explodiu")
      .replace("was impaled by", "foi empalado por")
      .replace("froze to death", "morreu congelado")
      .replace("starved to death", "morreu de fome")
      .replace("suffocated in a wall", "sufocou em uma parede")
      .replace("tried to swim in lava", "tentou nadar na lava");
    tipo = "death";
  }

  // ======================
  // ⚙️ INICIANDO SERVIDOR
  // ======================
  else if (line.includes("Starting Minecraft server version")) {
    msg = "🟢 **Servidor está iniciando...**";
    tipo = "server_start";
  } else if (line.includes("Done (")) {
    msg = "✅ **Servidor iniciado e pronto para uso!**";
    tipo = "server_start";
  }

  // ======================
  // ⛔ PARANDO SERVIDOR
  // ======================
  else if (line.includes("Stopping server")) {
    msg = "🛑 **Servidor está parando...**";
    tipo = "server_stop";
  }

  // 🔙 Retorna objeto padronizado
  return { tipo, msg, player };
}

module.exports = { translate };
