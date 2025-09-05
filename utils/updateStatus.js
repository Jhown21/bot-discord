// utils/updateStatus.js
const { rconSend } = require("./rcon");  // importa certo

async function updateStatus(client) {
  async function refresh() {
    try {
      // consulta lista de jogadores via RCON
      const response = await rconSend("list");   // usa rconSend, não rcon.send
      // resposta típica: "There are 2 of a max of 20 players online: Steve, Alex"
      const match = response.match(/There are (\d+) of a max \d+ players online: ?(.*)?/);

      const online = match ? parseInt(match[1], 10) : 0;
      const players = match && match[2] ? match[2].split(", ").filter(Boolean) : [];

      let statusMsg = "🟢 Nenhum jogador online";
      if (online > 0) {
        statusMsg = `🟢 ${online} online: ${players.join(", ")}`;
      }

      client.user.setPresence({
        activities: [{ name: statusMsg, type: 0 }], // "Playing ..."
        status: "online",
      });
    } catch (err) {
      console.error("❌ Erro ao atualizar status:", err.message);
      client.user.setPresence({
        activities: [{ name: "Servidor offline", type: 0 }],
        status: "dnd",
      });
    }
  }

  // primeira execução imediata
  refresh();
  // agenda a cada 60 segundos
  setInterval(refresh, 60 * 1000);
}

module.exports = { updateStatus };
