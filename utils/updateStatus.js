// utils/updateStatus.js
// ✳️ Mantém o "status" do bot dinâmico (ex: 👥 3/20 players online).
//    A cada N segundos, tenta "list" via RCON e ajusta a presença.

const { rconSend } = require("./rcon");

/**
 * Constrói o texto de status a partir da resposta do "list".
 * Exemplo de resposta: "There are 2 of a max 20 players online: Steve, Alex"
 */
function buildStatusText(listResponse) {
  // Regex captura dois números: online e máximo
  const match = listResponse && listResponse.match(/There are\s+(\d+)\s+of a max\s+(\d+)/i);
  if (!match) return "Servidor offline ❌";

  const online = Number(match[1]);
  const max = Number(match[2]);
  return `👥 ${online}/${max} players online`;
}

/**
 * Faz uma rodada de atualização de presença.
 * - Tenta chamar "list"
 * - Se OK: presence online com contagem
 * - Se falha: presence "idle" com offline
 */
async function updateOnce(client) {
  try {
    const res = await rconSend("list");
    const text = buildStatusText(res) || "Servidor offline ❌";

    await client.user.setPresence({
      activities: [{ name: text, type: 0 }], // 0 = Playing
      status: "online"
    });
  } catch (err) {
    // Não derruba o bot se RCON falhar
    console.error("⚠️ Erro ao atualizar status:", err.message);
    await client.user.setPresence({
      activities: [{ name: "Servidor offline ❌", type: 0 }],
      status: "idle"
    });
  }
}

/**
 * Inicia o loop (intervalo) que atualiza o status periodicamente.
 * Chama uma vez imediatamente, depois repete a cada 10s.
 */
function startStatusUpdater(client) {
  // roda já, para não ficar 10s sem status
  updateOnce(client);
  // repete a cada 10.000 ms
  setInterval(() => updateOnce(client), 10_000);
}

module.exports = startStatusUpdater;
