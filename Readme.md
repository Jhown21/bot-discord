                  ┌──────────────────────────┐
                  │        index.js          │
                  │ (ponto de entrada do bot)│
                  └────────────┬─────────────┘
                               │
        ┌──────────────────────┴─────────────────────────┐
        │                                                │
 ┌──────▼───────┐                                 ┌──────▼──────┐
 │   events/    │                                 │   log/      │
 │ (Discord.js) │                                 │ (Minecraft) │
 └──────┬───────┘                                 └──────┬──────┘
        │                                                │
┌───────▼─────────┐                              ┌───────▼─────────┐
│ clientReady.js  │                              │ logHandler.js   │
│ inicia watchers │                              │ lê latest.log   │
│ updateStatus    │                              │ emite "logLine" │
├─────────────────┤                              └───────┬─────────┘
│ messageCreate.js│                                      │
│ novas msgs DC   │                                      │
│ → router.js     │                                      │
├─────────────────┤                                      │
│ discordChat.js  │                                      │
│ integra MC ↔ DC │                                      │
├─────────────────┤                                      │
│ ignore.js       │                                      │
│ filtra msgs     │                                      │
└─────────────────┘                                      │
                                                         │
      ┌─────────────────────────┬────────────────────────┼───────────────────────────┐
      │                         │                        │                           │
┌─────▼──────┐          ┌───────▼────────┐       ┌───────▼────────────┐      ┌───────▼──────────┐
│ chatLog.js │          │ eventLog.js    │       │ performanceLog.js  │      │ fullLog.js       │
│ <nick> msg │          │ join/quit/etc. │       │ lag, watchdog, etc │      │ despeja tudo     │
│ → CHAT     │          │ → LOGS (e CHAT │       │ → LOGS perf        │      │ → canal debug    │
└─────┬──────┘          │ se flag = true)│       └─────────┬──────────┘      └──────────────────┘
      │                 └─────────┬──────┘                 │
      │                           │                        │
┌─────▼───────────┐      ┌────────▼──────────┐    ┌────────▼───────────┐
│ utils/avatar.js │      │ utils/translate.js│    │ utils/translatePerf│
│ resolve avatar  │      │ traduz eventos    │    │ traduz perf +      │
│ (mc-heads.net)  │      │ retorna tipo/msg  │    │ debounce anti-flood│
└─────┬───────────┘      └───────────────────┘    └────────────────────┘
      │
┌─────▼───────────┐
│ utils/playerCache│
│ resolve UUID/nick│
│ cache Mojang API │
└──────────────────┘


📂 Pastas

events/ → Eventos do Discord.js

1)clientReady.js → quando o bot conecta, inicia watchers e atualiza status

2)messageCreate.js → detecta novas mensagens e envia para o router.js

3)discordChat.js → integra chat do Discord ↔ Minecraft (via RCON)

4)ignore.js → filtra mensagens/usuários


log/ → Eventos do Minecraft

1)logHandler.js → lê o latest.log e emite logLine

2)chatLog.js → captura mensagens normais (<nick> mensagem) → canal CHAT

3)eventLog.js → captura eventos traduzidos (join, quit, death, advancement) → canal LOGS (ou CHAT também se SEND_EVENTS_TO_CHAT=true)

4)performanceLog.js → detecta problemas de performance (lag, watchdog, leaks) → canal LOGS

5)fullLog.js → despeja todas as linhas do log num canal (debug)


handlers/ → Comandos do Discord

1)router.js → decide qual handler usar

2)normalHandler.js → comandos comuns

3)adminHandler.js → comandos de admin/owner

4)consoleHandler.js → comandos direto no console MC via RCON

5)slashHandler.js → slash commands do Discord


utils/ → Funções de suporte

1)avatar.js → resolve avatar do jogador (sempre mc-heads.net)

2)playerCache.js → resolve UUID ↔ nick, com cache local

3)translate.js → traduz eventos do MC para português

4)translatePerformance.js → traduz logs de performance (+ debounce anti-flood)

5)rcon.js → cliente RCON para comandos no servidor MC

6)updateStatus.js → atualiza presença/status do bot no Discord


config/

config.js → junta e valida variáveis do .env


Pasta do projeto/
.env → define tokens, IDs de canais, configs
index.js → inicialização de tudo


⚙️ Onde mudar cada coisa

Trocar canal do Discord → .env (CHAT_CHANNEL_ID, LOGS_CHANNEL_ID, etc.)

Mandar eventos também pro chat → .env (SEND_EVENTS_TO_CHAT=true)

Adicionar/remover eventos traduzidos → utils/translate.js

Mudar mensagens de performance → utils/translatePerformance.js

Ajustar provider de avatar → utils/avatar.js

Corrigir cache/UUID → utils/playerCache.js

Alterar cores dos embeds → chatLog.js ou eventLog.js (mapa de cores)

Evitar flood de eventos → já tem debounce em translatePerformance.js, pode ajustar cooldown lá

Criar novos comandos → handlers/normalHandler.js ou handlers/slashHandler.js

Comandos de admin/console → handlers/adminHandler.js ou handlers/consoleHandler.js

Atualizar status do bot → utils/updateStatus.js

Conectar/desconectar RCON → utils/rcon.js

Depurar logs completos → ativar/desativar fullLog.js