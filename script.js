// Interações da página: animações, contagem, simulador e formulário de inscrição.
(function () {
  const cfg = window.CONFIG || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const brl = (v) => "R$ " + Math.round(v).toLocaleString("pt-BR");

  // Pixel da Meta: código oficial, ligado só se houver ID no config.js
  const pixelId = String(cfg.pixelMeta || "").replace(/\D/g, "");
  if (pixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", pixelId);
    fbq("track", "PageView");
  }
  const rastrear = (evento) => { if (pixelId && window.fbq) fbq("track", evento); };

  // sempre abrir no topo: o celular restaurava a posição antiga ou pulava para um #link
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  const irTopo = () => {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    scrollTo(0, 0);
    html.style.scrollBehavior = "";
  };
  irTopo();
  addEventListener("load", irTopo);
  addEventListener("pageshow", (e) => { if (e.persisted) irTopo(); });

  $("#ano").textContent = new Date().getFullYear();

  // ---------- título palavra por palavra ----------
  (function () {
    const h1 = $(".titulo-animado");
    let i = 0;
    const quebrar = (no) => {
      [...no.childNodes].forEach((filho) => {
        if (filho.nodeType === 3) {
          const frag = document.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach((parte) => {
            if (!parte) return;
            if (/^\s+$/.test(parte)) { frag.appendChild(document.createTextNode(" ")); return; }
            const p = document.createElement("span");
            p.className = "palavra";
            const dentro = document.createElement("span");
            dentro.style.setProperty("--i", i++);
            dentro.textContent = parte;
            p.appendChild(dentro);
            frag.appendChild(p);
          });
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1) {
          quebrar(filho);
        }
      });
    };
    quebrar(h1);
  })();

  // ---------- revelar ao rolar (em cascata dentro do mesmo grupo) ----------
  const grupos = new Map();
  $$(".revelar").forEach((el) => {
    const pai = el.parentElement;
    const n = grupos.get(pai) || 0;
    el.style.setProperty("--r", n);
    grupos.set(pai, n + 1);
  });
  if ("IntersectionObserver" in window && !semMovimento) {
    const obs = new IntersectionObserver((itens) => {
      itens.forEach((it) => {
        if (it.isIntersecting) {
          const el = it.target;
          el.classList.add("visivel");
          obs.unobserve(el);
          setTimeout(() => { el.style.transitionDelay = "0s"; }, 1600);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    $$(".revelar").forEach((el) => obs.observe(el));
  } else {
    $$(".revelar").forEach((el) => el.classList.add("visivel"));
  }

  // ---------- rolagem: barra de progresso, linha dos passos, botão fixo ----------
  const barra = $(".progresso span");
  const passos = $(".passos");
  const cartao = $("#inscricao");
  const ctaFixo = $(".cta-fixo");
  let pedido = false;
  function aoRolar() {
    pedido = false;
    const doc = document.documentElement;
    const total = doc.scrollHeight - innerHeight;
    barra.style.transform = "scaleX(" + (total > 0 ? scrollY / total : 0) + ")";

    const r = passos.getBoundingClientRect();
    const avanco = Math.min(1, Math.max(0, (innerHeight * 0.75 - r.top) / r.height));
    passos.style.setProperty("--avanco", avanco.toFixed(3));

    const c = cartao.getBoundingClientRect();
    const fechamento = $(".fechamento").getBoundingClientRect();
    const mostrar = c.bottom < 0 && fechamento.top > innerHeight * 0.6;
    ctaFixo.classList.toggle("mostrar", mostrar);
  }
  addEventListener("scroll", () => { if (!pedido) { pedido = true; requestAnimationFrame(aoRolar); } }, { passive: true });
  addEventListener("resize", aoRolar);
  aoRolar();

  // ao clicar num botão que leva ao formulário: destaca o cartão e foca o nome
  $$('a[href="#inscricao"]').forEach((a) => {
    a.addEventListener("click", () => {
      setTimeout(() => {
        cartao.classList.remove("destaque");
        void cartao.offsetWidth;
        cartao.classList.add("destaque");
        const nome = $('input[name="nome"]');
        if (nome && !$(".form-inscricao").hidden) nome.focus({ preventScroll: true });
      }, 650);
    });
  });

  // efeito de toque nos botões
  $$(".botao").forEach((b) => {
    b.addEventListener("pointerdown", (e) => {
      const r = b.getBoundingClientRect();
      const tam = Math.max(r.width, r.height);
      const o = document.createElement("span");
      o.className = "ripple";
      o.style.cssText = `width:${tam}px;height:${tam}px;left:${e.clientX - r.left - tam / 2}px;top:${e.clientY - r.top - tam / 2}px`;
      b.appendChild(o);
      setTimeout(() => o.remove(), 650);
    });
  });

  // ---------- contagem regressiva (só se a data estiver no config) ----------
  (function () {
    const alvo = cfg.dataAula ? new Date(cfg.dataAula).getTime() : NaN;
    if (!alvo || isNaN(alvo)) return;
    const caixa = $(".contagem");
    caixa.hidden = false;
    const campos = { d: $('[data-c="d"]'), h: $('[data-c="h"]'), m: $('[data-c="m"]'), s: $('[data-c="s"]') };
    function tique() {
      let falta = Math.max(0, alvo - Date.now());
      if (falta === 0) { caixa.querySelector("p").textContent = "A aula está acontecendo agora"; }
      const v = {
        d: Math.floor(falta / 864e5),
        h: Math.floor(falta / 36e5) % 24,
        m: Math.floor(falta / 6e4) % 60,
        s: Math.floor(falta / 1e3) % 60
      };
      Object.keys(v).forEach((k) => {
        const t = String(v[k]).padStart(2, "0");
        if (campos[k].textContent !== t) {
          campos[k].textContent = t;
          campos[k].classList.remove("mudou");
          void campos[k].offsetWidth;
          campos[k].classList.add("mudou");
        }
      });
    }
    tique();
    setInterval(tique, 1000);
  })();

  // ---------- simulador ----------
  (function () {
    const s = Object.assign({ jurosFinanciamentoAoAno: 11.5, entradaFinanciamento: 20, taxaAdministracao: 18, prazoMaximoCarta: 240 }, cfg.simulador || {});
    $("#txtJuros").textContent = String(s.jurosFinanciamentoAoAno).replace(".", ",");
    $("#txtTaxa").textContent = String(s.taxaAdministracao).replace(".", ",");
    const valor = $("#simValor"), prazo = $("#simPrazo");
    const mostrados = {};

    function animarNumero(el, para) {
      const de = mostrados[el.id] || 0;
      mostrados[el.id] = para;
      if (semMovimento) { el.textContent = brl(para); return; }
      const t0 = performance.now(), dur = 500;
      const passo = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = brl(de + (para - de) * e);
        if (k < 1 && mostrados[el.id] === para) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
    function preencher(r) {
      const p = ((r.value - r.min) / (r.max - r.min)) * 100;
      r.style.setProperty("--p", p + "%");
    }
    function calcular() {
      const V = +valor.value, n = +prazo.value;
      preencher(valor); preencher(prazo);
      $("#saidaValor").textContent = brl(V);
      $("#saidaPrazo").textContent = n + " meses";

      const entrada = V * s.entradaFinanciamento / 100;
      const financiado = V - entrada;
      const i = Math.pow(1 + s.jurosFinanciamentoAoAno / 100, 1 / 12) - 1;
      const parcelaFin = financiado * i / (1 - Math.pow(1 + i, -n));
      const totalFin = entrada + parcelaFin * n;

      const nCarta = Math.min(n, s.prazoMaximoCarta);
      const totalCon = V * (1 + s.taxaAdministracao / 100);
      const parcelaCon = totalCon / nCarta;

      animarNumero($("#totFin"), totalFin);
      animarNumero($("#totCon"), totalCon);
      animarNumero($("#economia"), totalFin - totalCon);
      $("#detFin").textContent = "Entrada de " + brl(entrada) + " + " + n + "x de " + brl(parcelaFin);
      $("#detCon").textContent = "Sem entrada · " + nCarta + "x de " + brl(parcelaCon);
      $("#vezes").textContent = "No financiamento você paga " + (totalFin / V).toFixed(1).replace(".", ",") + "x o valor do imóvel.";
      $("#barFin").style.width = "100%";
      $("#barCon").style.width = (totalCon / totalFin * 100).toFixed(1) + "%";
    }
    valor.addEventListener("input", calcular);
    prazo.addEventListener("input", calcular);
    calcular();
  })();

  // ---------- formulário ----------
  const form = $(".form-inscricao");
  const ok = $(".form-ok");
  const msg = $(".form-msg", form);
  const botao = $("button", form);
  const textoBotao = botao.innerHTML;
  const tel = form.elements.telefone;
  const barraForm = $(".form-barra span");

  tel.addEventListener("input", () => {
    const d = tel.value.replace(/\D/g, "").slice(0, 11);
    let v = d;
    if (d.length > 2) v = "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length > 7) v = "(" + d.slice(0, 2) + ") " + d.slice(2, d.length - 4) + "-" + d.slice(-4);
    tel.value = v;
  });

  const regras = {
    nome: (v) => v.trim().length >= 3,
    telefone: (v) => { const d = v.replace(/\D/g, ""); return d.length === 10 || d.length === 11; }
  };
  function conferir(campo, marcarErro) {
    const ok = regras[campo.name](campo.value);
    const caixa = campo.closest(".campo");
    caixa.classList.toggle("certo", ok);
    if (marcarErro) caixa.classList.toggle("erro", !ok);
    else if (ok) caixa.classList.remove("erro");
    return ok;
  }
  function atualizarBarra() {
    const n = Object.keys(regras).filter((k) => regras[k](form.elements[k].value)).length;
    barraForm.style.width = (n / Object.keys(regras).length * 100) + "%";
  }
  Object.keys(regras).forEach((k) => {
    const c = form.elements[k];
    c.addEventListener("input", () => { conferir(c, false); atualizarBarra(); });
    c.addEventListener("blur", () => { if (c.value) conferir(c, true); });
  });

  // guarda as UTMs da URL para saber de onde veio cada inscrito
  const params = new URLSearchParams(location.search);
  const utm = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
    if (params.get(k)) utm[k] = params.get(k);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    const ruins = Object.keys(regras).map((k) => form.elements[k]).filter((c) => {
      c.closest(".campo").classList.remove("erro");
      void c.offsetWidth;
      return !conferir(c, true);
    });
    if (ruins.length) {
      ruins[0].focus();
      msg.textContent = "Confira os campos destacados.";
      return;
    }
    const dados = new URLSearchParams({
      nome: form.elements.nome.value.trim(),
      telefone: tel.value.trim(),
      pagina: location.href.split("?")[0],
      ...utm
    });

    botao.disabled = true;
    botao.innerHTML = '<span class="girando"></span><span>Enviando…</span>';
    try {
      if (cfg.urlPlanilha) {
        // no-cors: o Apps Script recebe e grava; a resposta não é lida
        await fetch(cfg.urlPlanilha, { method: "POST", mode: "no-cors", body: dados });
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      // conta a inscrição no pixel e dá um instante pro envio sair antes de trocar de página
      if (pixelId) { rastrear("Lead"); await new Promise((r) => setTimeout(r, 400)); }
      // por enquanto a inscrição continua no WhatsApp
      const zap = String(cfg.whatsapp || "").replace(/\D/g, "");
      if (zap) {
        const texto = (cfg.mensagemWhatsapp || "").replace("{nome}", form.elements.nome.value.trim());
        location.href = "https://wa.me/" + zap + (texto ? "?text=" + encodeURIComponent(texto) : "");
        return;
      }
      if (cfg.redirecionarPara) { location.href = cfg.redirecionarPara; return; }
      form.hidden = true;
      $(".cartao-topo").hidden = true;
      ok.hidden = false;
      ctaFixo.remove();
    } catch (err) {
      msg.textContent = "Não foi possível enviar agora. Verifique sua internet e tente de novo.";
      botao.disabled = false;
      botao.innerHTML = textoBotao;
    }
  });
})();
