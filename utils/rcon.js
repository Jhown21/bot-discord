// utils/rcon.js
// ✳️ Funções utilitárias para falar com o RCON do Minecraft de forma segura.
//    Padrão: conectar → enviar → encerrar, sempre com try/finally.

const { Rcon } = require("rcon-client");
const config = require("../config/config");

/**
 * Envia um comando via RCON e retorna a resposta como string.
 * Garante que a conexão será encerrada, mesmo se der erro.
 * @param {string} command - Comando do console do Minecraft (ex: "list", "time set day")
 * @returns {Promise<string>}
 */
async function rconSend(command) {
  let rcon;
  try {
    rcon = await Rcon.connect({
      host: config.RCON_HOST,
      port: config.RCON_PORT,
      password: config.RCON_PASS
    });
    const res = await rcon.send(command);
    return res;
  } finally {
    // Fecha a conexão se chegou a abrir.
    if (rcon) {
      try { await rcon.end(); } catch (_) {}
    }
  }
}

module.exports = { rconSend };
