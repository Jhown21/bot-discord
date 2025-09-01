// utils/translate.js
// ✳️ Centraliza traduções dos eventos do Minecraft para português
//     Agora também retorna o "player" (nick) para podermos mostrar o avatar no Discord.

function translate(line) {
  let tipo = "default";
  let msg = line;
  let player = null;

  // ======================
  // 🎮 ENTRADA
  // ======================
  if (line.includes("logged in with entity id") || line.includes("joined the game")) {
    player = line.match(/(\w+)(?=\[| joined the game)/)?.[0] || "Jogador";
    msg = `🟢 **${player} entrou no servidor**`;
    tipo = "join";
  }

  // ======================
  // 🚪 SAÍDA
  // ======================
  else if (line.includes("lost connection") || line.includes("left the game")) {
    player = line.match(/^\w+/)?.[0] || "Jogador";
    msg = `🔴 **${player} saiu do servidor**`;
    tipo = "quit";
  }

  // ======================
  // 🏆 CONQUISTA
  // ======================
  else if (line.includes("has made the advancement")) {
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
    player = line.split(" ")[0]; // pega o nome antes da primeira palavra
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

  return { tipo, msg, player };
}

module.exports = { translate };
