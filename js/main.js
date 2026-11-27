/* Acqua Prime Piscinas — comportamento da prévia */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var WA = "https://wa.me/5567991661449";
  var reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Aberto agora? (horário de Ponta Porã, MS) ---------- */
  // 0 = domingo ... 6 = sábado. Minutos desde a meia-noite.
  var HORARIO = {
    0: null,
    1: [480, 1050], 2: [480, 1050], 3: [480, 1050], 4: [480, 1050], 5: [480, 1050],
    6: [480, 780]
  };
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  function agoraMS() {
    try {
      var partes = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Campo_Grande", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23"
      }).formatToParts(new Date());
      var m = {};
      partes.forEach(function (p) { m[p.type] = p.value; });
      var dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(m.weekday);
      return { dia: dia, min: parseInt(m.hour, 10) * 60 + parseInt(m.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), min: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function hora(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return h + "h" + (m < 10 && m ? "0" + m : (m || ""));
  }
  function status() {
    var t = agoraMS(), hoje = HORARIO[t.dia];
    if (hoje && t.min >= hoje[0] && t.min < hoje[1]) {
      return { aberto: true, texto: "Aberto agora, fecha às " + hora(hoje[1]) };
    }
    if (hoje && t.min < hoje[0]) {
      return { aberto: false, texto: "Fechado agora, abre hoje às " + hora(hoje[0]) };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (t.dia + i) % 7;
      if (HORARIO[d]) {
        var quando = i === 1 ? "amanhã" : DIAS[d];
        return { aberto: false, texto: "Fechado agora, abre " + quando + " às " + hora(HORARIO[d][0]) };
      }
    }
    return { aberto: false, texto: "" };
  }
  function pintaStatus() {
    var s = status(), t = agoraMS();
    document.querySelectorAll(".js-status").forEach(function (el) {
      el.classList.toggle("is-open", s.aberto);
      el.classList.toggle("is-closed", !s.aberto);
      el.querySelector(".status__text").textContent = s.texto;
    });
    document.querySelectorAll(".horario tr").forEach(function (tr) {
      var dias = (tr.getAttribute("data-dias") || "").split(",").map(Number);
      tr.classList.toggle("is-hoje", dias.indexOf(t.dia) > -1);
    });
  }
  pintaStatus();
  setInterval(pintaStatus, 60000);

  /* ---------- Links de WhatsApp com mensagem pronta ---------- */
  document.querySelectorAll(".js-wa").forEach(function (a) {
    var msg = a.getAttribute("data-msg");
    if (msg) a.href = WA + "?text=" + encodeURIComponent(msg);
  });

  /* ---------- Montador de orçamento ---------- */
  var cupom = document.querySelector(".js-cupom");
  if (cupom) {
    var saida = cupom.querySelector(".js-msg");
    var oculto = cupom.querySelector(".js-text");
    var balao = cupom.querySelector(".balao");

    var lista = function (itens) {
      if (itens.length <= 1) return itens.join("");
      return itens.slice(0, -1).join(", ") + " e " + itens[itens.length - 1];
    };
    var monta = function () {
      var itens = Array.prototype.map.call(cupom.querySelectorAll('input[name="item"]:checked'), function (i) { return i.value; });
      var nome = cupom.querySelector('input[name="nome"]').value.trim();
      var txt = "Olá, Acqua Prime!" + (nome ? " Meu nome é " + nome + "." : "") + " Vim pelo site e ";
      txt += itens.length ? "quero um orçamento de " + lista(itens) + "." : "quero um orçamento.";
      return txt;
    };
    var atualiza = function () {
      var txt = monta();
      saida.textContent = txt;
      oculto.value = txt;
      if (!reduz) {
        balao.classList.remove("is-pulse");
        void balao.offsetWidth;
        balao.classList.add("is-pulse");
      }
    };
    cupom.addEventListener("change", atualiza);
    cupom.addEventListener("input", function (e) { if (e.target.name === "nome") atualiza(); });
    cupom.addEventListener("submit", function (e) {
      e.preventDefault();
      window.open(WA + "?text=" + encodeURIComponent(monta()), "_blank", "noopener");
    });
    atualiza();
  }

  /* ---------- 50 avaliações, 50 piscinas ---------- */
  var cinquenta = document.querySelector(".js-cinquenta");
  if (cinquenta) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 50; i++) {
      var mini = document.createElement("span");
      mini.className = "mini";
      var agua = document.createElement("i");
      agua.style.transitionDelay = (reduz ? 0 : (i % 10) * 0.03 + Math.floor(i / 10) * 0.08) + "s";
      mini.appendChild(agua);
      frag.appendChild(mini);
    }
    cinquenta.appendChild(frag);
  }

  /* ---------- Entradas ao rolar ---------- */
  var alvos = document.querySelectorAll(".reveal, .js-cinquenta");
  // escalonamento entre irmãos
  document.querySelectorAll(".reveal").forEach(function (el) {
    var irmaos = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.classList.contains("reveal"); });
    el.style.setProperty("--d", (Math.min(irmaos.indexOf(el), 6) * 0.075) + "s");
  });
  if ("IntersectionObserver" in window && !reduz) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
    alvos.forEach(function (el) { io.observe(el); });
    // quem pulou a seção (âncora, rolagem rápida) também vê o conteúdo
    var confere = function () {
      alvos.forEach(function (el) {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
      });
    };
    window.addEventListener("scroll", confere, { passive: true });
    window.addEventListener("load", confere);
  } else {
    alvos.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Mapa: carrega só quando chega perto ---------- */
  var mapa = document.querySelector(".js-mapa iframe");
  if (mapa) {
    var carrega = function () { if (!mapa.src) mapa.src = mapa.getAttribute("data-src"); };
    if ("IntersectionObserver" in window) {
      var iom = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { carrega(); iom.disconnect(); }
      }, { rootMargin: "400px 0px" });
      iom.observe(mapa);
    } else { carrega(); }
  }

  var ano = document.querySelector(".js-ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
