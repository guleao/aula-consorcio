// Configuração do site — é o único arquivo que precisa ser editado.
window.CONFIG = {
  // Endereço do Google Apps Script que grava as inscrições numa planilha.
  // Como gerar: veja PLANILHA.md. Enquanto estiver vazio, o formulário só
  // mostra a confirmação (modo de demonstração) e não salva nada.
  urlPlanilha: "",

  // WhatsApp para onde a pessoa vai depois de se inscrever.
  // Número com DDI e DDD, só dígitos (ex.: "5511999998888").
  // {nome} na mensagem vira o nome que a pessoa digitou.
  whatsapp: "",
  mensagemWhatsapp: "Olá! Me chamo {nome} e quero participar da aula de cartas de crédito.",

  // Opcional (usado só se "whatsapp" estiver vazio): outro link para levar a
  // pessoa depois da inscrição, ex.: grupo de WhatsApp. Vazio = só mostra a
  // confirmação na página.
  redirecionarPara: "https://chat.whatsapp.com/DiQmH22ANQv2baCRX3XhgK",

  // Pixel da Meta (Facebook/Instagram Ads): só o número do ID, ex.: "123456789012345".
  // Registra a visita (PageView) e cada inscrição enviada (Lead). Vazio = sem pixel.
  pixelMeta: "",

  // Opcional: data e hora da aula, para mostrar a contagem regressiva.
  // Formato: "2026-12-02T20:00:00-03:00" (ano-mês-diaThora:min:seg-03:00).
  // Vazio = a contagem fica escondida.
  dataAula: "",

  // Números do simulador "Financiamento x carta de crédito".
  simulador: {
    jurosFinanciamentoAoAno: 11.5, // % ao ano
    entradaFinanciamento: 20,      // % do valor do imóvel
    taxaAdministracao: 18,         // % total da carta de crédito
    prazoMaximoCarta: 240          // meses
  }
};
