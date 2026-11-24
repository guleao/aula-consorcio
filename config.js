// Configuração do site — é o único arquivo que precisa ser editado.
window.CONFIG = {
  // Endereço do Google Apps Script que grava as inscrições numa planilha.
  // Como gerar: veja PLANILHA.md. Enquanto estiver vazio, o formulário só
  // mostra a confirmação (modo de demonstração) e não salva nada.
  urlPlanilha: "",

  // Opcional: para onde levar a pessoa depois da inscrição
  // (ex.: link do grupo de WhatsApp). Vazio = só mostra a confirmação na página.
  redirecionarPara: "",

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
