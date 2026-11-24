// Formulário de inscrição: validação, máscara de telefone e envio para a planilha.
(function () {
  const cfg = window.CONFIG || {};
  const form = document.querySelector(".form-inscricao");
  const ok = document.querySelector(".form-ok");
  const msg = form.querySelector(".form-msg");
  const botao = form.querySelector("button");
  const tel = form.elements.telefone;

  document.getElementById("ano").textContent = new Date().getFullYear();

  // máscara (00) 00000-0000
  tel.addEventListener("input", () => {
    const d = tel.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 2) v = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) v = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    tel.value = v;
  });

  function validar() {
    const erros = [];
    const nome = form.elements.nome;
    const email = form.elements.email;
    [nome, email, tel].forEach((c) => c.classList.remove("erro"));
    if (nome.value.trim().length < 3) erros.push(nome);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) erros.push(email);
    const dig = tel.value.replace(/\D/g, "");
    if (dig.length < 10 || dig.length > 11) erros.push(tel);
    erros.forEach((c) => c.classList.add("erro"));
    if (erros.length) erros[0].focus();
    return erros.length === 0;
  }

  // guarda as UTMs da URL para saber de onde veio cada inscrito
  const params = new URLSearchParams(location.search);
  const utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
    if (params.get(k)) utm[k] = params.get(k);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    if (!validar()) {
      msg.textContent = "Confira os campos destacados.";
      return;
    }
    const dados = new URLSearchParams({
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: tel.value.trim(),
      pagina: location.href.split("?")[0],
      ...utm
    });

    botao.disabled = true;
    botao.textContent = "Enviando…";
    try {
      if (cfg.urlPlanilha) {
        // no-cors: o Apps Script recebe e grava; a resposta não é lida
        await fetch(cfg.urlPlanilha, { method: "POST", mode: "no-cors", body: dados });
      }
      if (cfg.redirecionarPara) {
        location.href = cfg.redirecionarPara;
        return;
      }
      form.hidden = true;
      ok.hidden = false;
    } catch (err) {
      msg.textContent = "Não foi possível enviar agora. Verifique sua internet e tente de novo.";
      botao.disabled = false;
      botao.textContent = "Quero participar da aula";
    }
  });
})();
