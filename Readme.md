📦 bot-discord
│── index.js              # ponto de entrada do bot
│── .env                  # variáveis de ambiente (token, canais, flags)
│── .env.example          # exemplo de configuração
│── package.json          # dependências
│── deploy-commands.js    # script para registrar slash commands
│── Readme.md             # documentação
│
├── config/
│   └── config.js         # junta e valida variáveis do .env
│
├── events/               # eventos do Discord.js
│   ├── clientReady.js    # quando conecta, inicia watchers e atualiza status
│   ├── messageCreate.js  # detecta novas mensagens → router.js
│   ├── discordChat.js    # integra chat Discord ↔ Minecraft (via RCON)
│   └── ignore.js         # filtra mensagens/usuários
│
├── log/                  # eventos do Minecraft (watch latest.log)
│   ├── logHandler.js     # lê o latest.log e emite "logLine"
│   ├── chatLog.js        # captura mensagens (<nick> msg) → canal CHAT
│   ├── eventLog.js       # join, quit, death, advancements → LOGS/CHAT
│   ├── performanceLog.js # detecta lag, watchdog, leaks → canal LOGS
│   └── fullLog.js        # despeja tudo no canal de debug
│
├── handlers/             # comandos do Discord
│   ├── router.js         # decide qual handler usar
│   ├── normalHandler.js  # comandos comuns
│   ├── adminHandler.js   # comandos admin/owner
│   ├── consoleHandler.js # envia comandos direto no console MC (RCON)
│   └── slashHandler.js   # comandos slash do Discord
│
└── utils/                # funções auxiliares
    ├── avatar.js         # resolve avatar do jogador (mc-heads.net)
    ├── playerCache.js    # cache Mojang API UUID ↔ nick
    ├── translate.js      # traduz eventos MC → mensagens
    ├── translatePerformance.js # traduz logs de performance (com debounce)
    ├── rcon.js           # cliente RCON para executar comandos no MC
    └── updateStatus.js   # atualiza status do bot no Discord


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