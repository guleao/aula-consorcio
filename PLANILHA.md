# Como receber as inscrições numa planilha do Google (5 minutos)

1. Crie uma planilha nova no Google Planilhas (ex.: "Inscritos — Aula consórcio").
2. Menu **Extensões > Apps Script**. Apague o que estiver lá e cole o conteúdo do arquivo `apps-script.gs`. Salve.
3. Clique em **Implantar > Nova implantação** → tipo **App da Web**.
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
4. Clique em **Implantar**, autorize com a sua conta e copie o **URL do app da Web** (termina em `/exec`).
5. Abra `config.js` e cole o endereço em `urlPlanilha: "..."`. Salve e suba no GitHub (o site atualiza sozinho em ~1 minuto).

Pronto: cada inscrição aparece na aba **Inscritos** com data, nome, e-mail, telefone e a origem (UTM).

Opcional: em `config.js`, `redirecionarPara` leva a pessoa para outro link depois de se inscrever (ex.: grupo de WhatsApp da aula).
