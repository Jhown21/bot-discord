// utils/rcon.js
// ✳️ Este módulo é responsável por fazer a conexão RCON com o servidor Minecraft,
//     enviar um comando e devolver a resposta.
//     Sempre com segurança: abre conexão → envia → fecha.
//     Assim a gente não deixa conexões "presas" (leak).

const { Rcon } = require("rcon-client"); // 📦 biblioteca que sabe falar o protocolo RCON
const { RCON_HOST, RCON_PORT, RCON_PASS } = require("../config/config"); 
// 🔑 Pegamos host, porta e senha do arquivo config (mais seguro do que hardcode)


// 🧩 Função principal para enviar comandos.
//     Você chama: await rconSend("comando")
//     E recebe de volta a resposta do servidor.
async function rconSend(command) {
  let rcon;

  try {
    // 1) Conectar ao RCON do servidor
    rcon = await Rcon.connect({
      host: RCON_HOST,
      port: RCON_PORT,
      password: RCON_PASS
    });

    // 2) Enviar comando
    const response = await rcon.send(command);

    // 3) Retornar resposta para quem chamou
    return response;

  } catch (err) {
    // Em caso de erro, logamos para debug e repassamos
    console.error(`❌ Erro ao enviar comando RCON: ${err.message}`);
    throw err;

  } finally {
    // 4) Fechar conexão SEMPRE (mesmo se deu erro)
    if (rcon) {
      try {
        await rcon.end();
      } catch (_) {
        // ignora erros ao fechar
      }
    }
  }
}

module.exports = { rconSend };
