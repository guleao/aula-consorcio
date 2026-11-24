# Aula de consórcio — página de inscrição

Landing page da aula ao vivo "Como construir patrimônio através de cartas de crédito, sem juros e sem financiamento".
Site estático (HTML + CSS + JS puros), sem build. Publicado pelo GitHub Pages.

## Estrutura
- `index.html` — a página: letreiro + barra de progresso, dobra 1 (promessa + formulário), faixa, para quem é, como funciona, simulador financiamento x carta de crédito, perguntas, fechamento, botão fixo no celular.
- `style.css` — cores (preto, branco, vermelho `#e50914`), fontes, animações e layout responsivo.
- `script.js` — título palavra por palavra, revelar ao rolar, contagem regressiva, simulador, validação e envio do formulário (guarda as UTMs).
- `config.js` — **único arquivo a editar**: planilha, WhatsApp de destino (`whatsapp`), redirecionamento, data da aula (contagem) e números do simulador.
- `apps-script.gs` + `PLANILHA.md` — como receber as inscrições numa planilha do Google.

## Editar textos
Todos os textos estão em `index.html`. Para trocar o dia da aula, procure "Quarta-feira".

## Ver no computador
Abra `index.html` no navegador (duplo clique).
