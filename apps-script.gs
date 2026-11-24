// Cole este código no Apps Script da planilha (Extensões > Apps Script).
// Cada inscrição vira uma linha na aba "Inscritos".
function doPost(e) {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName("Inscritos");
  const colunas = ["Data", "Nome", "E-mail", "Telefone", "utm_source", "utm_medium", "utm_campaign", "utm_content", "Página"];
  if (!aba) {
    aba = planilha.insertSheet("Inscritos");
    aba.appendRow(colunas);
    aba.setFrozenRows(1);
  }
  const p = e.parameter;
  aba.appendRow([
    new Date(), p.nome || "", p.email || "", p.telefone || "",
    p.utm_source || "", p.utm_medium || "", p.utm_campaign || "", p.utm_content || "",
    p.pagina || ""
  ]);
  return ContentService.createTextOutput("ok");
}
