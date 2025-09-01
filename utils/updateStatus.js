// utils/updateStatus.js
// ✳️ Este módulo cuida de manter o "status" (presence) do bot do Discord sempre atualizado,
//    exibindo informações dinâmicas do servidor Minecraft:
//    - 👥 Quantidade de jogadores online
//    - 🧑‍🤝‍🧑 Quais jogadores (lista resumida)
//    - ⏱️ Uptime do serviço (por ora, placeholder; no futuro você vai plugar um coletor real)
//
// COMO USAR:
//  - No events/clientReady.js, chame:  startStatusUpdater(client)
//  - Opcionalmente, passe opções: startStatusUpdater(client, { intervalMs: 15000, getUptime: minhaFunc })
//    onde getUptime é uma função async que retorna uma string (ex: "3h12m").
//    Se você não passar getUptime, vamos mostrar "N/A" como uptime.
//
// DEPENDÊNCIAS EXTERNAS DO PROJETO:
//  - utils/rcon.js → expõe rconSend(comando) que conecta, envia e fecha o RCON com segurança
//  - discord.js → só usamos o enum ActivityType para definir tipo de presença "Playing", "Watching", etc.

const { ActivityType } = require("discord.js");
const { rconSend } = require("./rcon"); // nossa helper que faz: conectar → enviar → fechar

// 🔧 Configurações padrão do atualizador de status.
//    Você pode sobrescrever passando opções em startStatusUpdater(..., options)
const DEFAULT_OPTIONS = {
  // de quanto em quanto tempo atualizar o status (milissegundos):
  intervalMs: 15_000, // 15 segundos (use 10_000 se quiser mais "tempo real")

  // tipo de atividade a exibir no Discord (Playing/Listening/Watching/Competing)
  activityType: ActivityType.Playing,

  // função async opcional para obter uptime do serviço (ex.: "systemctl" → "3h12m")
  // por padrão retorna "N/A" enquanto você ainda não implementou o coletor real.
  getUptime: async () => "N/A"
};

// 🧩 Esta função tenta ler os jogadores online via RCON usando o comando "list".
//     Exemplo de resposta clássica do MC: 
//       "There are 2 of a max 20 players online: Steve, Alex"
//     Em alguns servers/modpacks, o texto pode variar levemente, então temos fallback.
async function fetchPlayersViaRcon() {
  // 1) Envia "list" para o servidor
  const raw = await rconSend("list");

  // 2) Tenta extrair "online" e "max" com uma regex comum
  //    - (\d+) captura números
  //    - usamos \s+ para permitir espaços variáveis e "i" para ignorar maiúsc/minúsc
  let online = 0;
  let max = null;

  // Padrão mais comum (vanilla):
  // "There are 2 of a max 20 players online: Steve, Alex"
  const classicMatch = raw && raw.match(/There are\s+(\d+)\s+of a max\s+(\d+)/i);

  if (classicMatch) {
    online = Number(classicMatch[1]);
    max = Number(classicMatch[2]);
  } else {
    // Fallback para outras variantes (alguns servidores formatam diferente)
    // Ex.: "There are 2 players online"
    const altMatch = raw && raw.match(/There are\s+(\d+)\s+players/i);
    if (altMatch) {
      online = Number(altMatch[1]);
    }
    // Se não achou "max", deixa como null (a presença mostrará apenas "2 online")
  }

  // 3) Extrair a lista de nomes (depois do ":")
  //    Ex.: "... players online: Steve, Alex" → split(":")[1] = " Steve, Alex"
  let players = [];
  if (raw && raw.includes(":")) {
    const afterColon = raw.split(":").slice(1).join(":"); // protege caso tenha mais ":" no texto
    // Quebra por vírgula e limpa espaços
    players = afterColon
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Em caso de "0 players", normalmente afterColon não existe (lista vazia) → players = []
  return { online, max, players };
}

// ✂️ Reduz a lista de nomes se ficar grande, para não ultrapassar limites de texto da presença.
//    Ex.: ["Steve","Alex","Maria","Bob"] → "Steve, Alex, Maria +1"
function summarizePlayers(players, cap = 3) {
  if (!players || players.length === 0) return "ninguém";
  if (players.length <= cap) return players.join(", ");
  const shown = players.slice(0, cap).join(", ");
  const rest = players.length - cap;
  return `${shown} +${rest}`;
}

// 🧱 Constrói a linha de status (texto curto) que vai para a presença do Discord.
//    Exemplos produzidos:
//     - "👥 0 online | ⏱️ Uptime: N/A"
//     - "👥 2/20 | Steve, Alex | ⏱️ Uptime: 3h12m"
//     - "👥 5/20 | Steve, Alex, Maria +2 | ⏱️ Uptime: 47m"
function buildPresenceLine({ online, max, players }, uptimeText) {
  const countPart = max ? `${online}/${max}` : `${online} online`;
  const namesPart = online > 0 ? summarizePlayers(players) : null;

  // Monta dinamicamente as partes, ignorando as que não se aplicam
  const parts = [
    `👥 ${countPart}`,
    namesPart ? namesPart : null,
    `⏱️ Uptime: ${uptimeText || "N/A"}`
  ].filter(Boolean); // remove null/undefined

  // Junta tudo com " | "
  let line = parts.join(" | ");

  // 🚦 Hard limit: o Discord costuma aceitar ~128 caracteres no "nome" da activity.
  //     Se estourar, vamos truncar de forma elegante.
  const MAX_LEN = 120;
  if (line.length > MAX_LEN) {
    line = line.slice(0, MAX_LEN - 1) + "…"; // reticências
  }

  return line;
}

// 🔁 Faz UMA rodada de atualização de status:
//     - tenta pegar jogadores via RCON
//     - pega uptime via getUptime (placeholder por ora)
//     - seta a presença
async function updateOnce(client, options) {
  try {
    // 1) Pega dados dinâmicos
    const [playersInfo, uptimeText] = await Promise.all([
      fetchPlayersViaRcon().catch(() => ({ online: 0, max: null, players: [] })), // se der erro no RCON, tratamos como offline
      options.getUptime().catch(() => "N/A") // se der erro no coletor de uptime, usa "N/A"
    ]);

    // 2) Constrói a mensagem de presença
    const presenceName = buildPresenceLine(playersInfo, uptimeText);

    // 3) Aplica presença no Discord
    await client.user.setPresence({
      activities: [{ name: presenceName, type: options.activityType }],
      status: "online" // "idle" ou "dnd" podem ser usados caso você queira sinalizar degradação
    });

    // Log opcional para depurar
    // console.log("✅ Presence:", presenceName);
  } catch (err) {
    // Em caso de erro inesperado, coloca um fallback seguro
    console.error("⚠️ Erro ao atualizar status:", err.message);
    await client.user.setPresence({
      activities: [{ name: "Servidor offline ❌ | ⏱️ Uptime: N/A", type: options.activityType }],
      status: "idle"
    });
  }
}

// 🚀 Ponto de entrada deste módulo.
//     - Mescla opções do usuário com defaults
//     - Roda uma vez imediatamente
//     - Agenda para rodar a cada "intervalMs"
function startStatusUpdater(client, userOptions = {}) {
  // Mescla o que veio do usuário com nossos defaults
  const options = { ...DEFAULT_OPTIONS, ...userOptions };

  // Roda já (para não esperar o primeiro intervalo)
  updateOnce(client, options);

  // Agenda execução periódica
  setInterval(() => {
    updateOnce(client, options);
  }, options.intervalMs);
}

module.exports = startStatusUpdater;
