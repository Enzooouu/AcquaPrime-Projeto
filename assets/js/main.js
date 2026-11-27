/* Acqua Prime Piscinas — interações da prévia (sem dependências) */
(() => {
  'use strict';

  const WA = 'https://wa.me/5567991661449';
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- Entradas ao rolar ---------- */
  const alvos = $$('[data-reveal]');
  $$('section').forEach(sec => $$('[data-reveal]', sec).forEach((el, i) => el.style.setProperty('--i', Math.min(i, 5))));
  if ('IntersectionObserver' in window && !reduz) {
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    alvos.forEach(el => io.observe(el));
    // quem pulou direto para uma seção (âncora) também vê o conteúdo
    const confere = () => alvos.forEach(el => { if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); });
    addEventListener('scroll', confere, { passive: true });
  } else {
    alvos.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Cabeçalho e menu do celular ---------- */
  const topo = $('[data-header]');
  const menuBtn = $('[data-menu-btn]');
  if (topo) {
    const onScroll = () => topo.classList.toggle('is-solid', scrollY > 10);
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }
  if (topo && menuBtn) {
    const setMenu = (on) => {
      topo.classList.toggle('is-open', on);
      menuBtn.setAttribute('aria-expanded', String(on));
      $('.sr-only', menuBtn).textContent = on ? 'Fechar menu' : 'Abrir menu';
    };
    menuBtn.addEventListener('click', () => setMenu(!topo.classList.contains('is-open')));
    $$('a', topo).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && topo.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    document.addEventListener('click', (e) => { if (!topo.contains(e.target)) setMenu(false); });
  }

  /* ---------- Orçamento em forma de conversa ---------- */
  const log = $('[data-chat-log]');
  const resp = $('[data-chat-resp]');
  const respostas = {};
  let etapa = 0, rodando = false, sessao = 0, comecou = false;

  const ETAPAS = [
    { chave: 'servico', pergunta: 'Oi! Que bom ter você aqui. O que você procura?', opcoes: ['Comprar uma piscina', 'Instalação', 'Produtos e acessórios', 'Pós-venda', 'Ainda não sei'] },
    { chave: 'tamanho', pergunta: 'Legal! E qual o tamanho aproximado da piscina?', opcoes: ['Pequena', 'Média', 'Grande', 'Não sei'], pular: (r) => r.servico === 'Produtos e acessórios' || r.servico === 'Pós-venda' },
    { chave: 'nome', pergunta: 'Como você se chama?', campo: 'Seu nome', opcional: true },
    { chave: 'obs', pergunta: 'Quer contar mais alguma coisa? Pode ser o bairro, uma dúvida ou o que precisa.', campo: 'Escreva aqui', opcional: true },
  ];

  const mensagem = () => {
    const linhas = ['Olá, Acqua Prime! Vim pelo site e gostaria de um orçamento.'];
    const d = [];
    if (respostas.servico) d.push(`*Procuro:* ${respostas.servico}`);
    if (respostas.tamanho) d.push(`*Tamanho da piscina:* ${respostas.tamanho}`);
    if (respostas.nome) d.push(`*Nome:* ${respostas.nome}`);
    if (d.length) linhas.push('', ...d);
    if (respostas.obs) linhas.push('', respostas.obs);
    return linhas.join('\n');
  };
  const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const rola = () => { if (log) log.scrollTop = log.scrollHeight; };
  const fala = (texto, quem, html) => {
    const p = document.createElement('p');
    p.className = `msg msg-${quem}`;
    if (html) p.innerHTML = html; else p.textContent = texto;
    log.appendChild(p); rola();
    return p;
  };
  // a loja "digita" um instante antes de responder
  const lojaFala = (texto, html) => new Promise(ok => {
    if (reduz) { fala(texto, 'loja', html); return ok(); }
    const d = document.createElement('div');
    d.className = 'digitando'; d.innerHTML = '<i></i><i></i><i></i>';
    d.setAttribute('aria-hidden', 'true');
    log.appendChild(d); rola();
    setTimeout(() => { d.remove(); fala(texto, 'loja', html); ok(); }, 650);
  });

  const limpa = () => { resp.innerHTML = ''; };
  const botao = (texto, cls, acao) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.textContent = texto;
    b.addEventListener('click', acao);
    resp.appendChild(b);
    return b;
  };

  const responde = (valor, mostra) => {
    const e = ETAPAS[etapa];
    if (valor) respostas[e.chave] = valor; else delete respostas[e.chave];
    fala(mostra || valor, 'cliente');
    etapa++;
    proxima();
  };

  const proxima = async () => {
    comecou = true;
    const s = sessao;
    limpa();
    while (etapa < ETAPAS.length && ETAPAS[etapa].pular && ETAPAS[etapa].pular(respostas)) { delete respostas[ETAPAS[etapa].chave]; etapa++; }
    if (etapa >= ETAPAS.length) return final();
    const e = ETAPAS[etapa];
    await lojaFala(e.pergunta);
    if (s !== sessao) return;
    if (e.opcoes) {
      e.opcoes.forEach(o => botao(o, 'opcao', () => responde(o)));
    } else {
      const f = document.createElement('form');
      f.className = 'campo-chat';
      f.innerHTML = `<label class="sr-only" for="chat-${e.chave}">${esc(e.pergunta)}</label><input id="chat-${e.chave}" type="text" maxlength="${e.chave === 'obs' ? 300 : 40}" autocomplete="${e.chave === 'nome' ? 'given-name' : 'off'}" placeholder="${esc(e.campo)}"><button type="submit" aria-label="Enviar resposta"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l15-7-5 15-3-6z" fill="currentColor"/></svg></button>`;
      f.addEventListener('submit', (ev) => { ev.preventDefault(); const v = f.querySelector('input').value.trim(); if (v) responde(v); });
      resp.appendChild(f);
      if (e.opcional) botao('Pular', 'opcao opcao-fraca', () => responde('', 'Pular'));
      // no celular, só foca se a pessoa já está mexendo na conversa (não abre o teclado sozinho)
      if (rodando) f.querySelector('input').focus({ preventScroll: true });
    }
  };

  const final = async () => {
    const txt = mensagem();
    await lojaFala('Pronto! Sua mensagem ficou assim:');
    fala('', 'loja msg-final', esc(txt).replace(/\*(.+?)\*/g, '<b>$1</b>'));
    const a = document.createElement('a');
    a.className = 'pill pill-verde';
    a.href = `${WA}?text=${encodeURIComponent(txt)}`;
    a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('data-contato', '');
    a.innerHTML = '<span class="pill-chip" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-wa"/></svg></span>Enviar no WhatsApp';
    resp.appendChild(a);
    botao('Começar de novo', 'opcao opcao-fraca', recomeca);
    observaContato(a);
  };

  const recomeca = () => {
    sessao++;
    Object.keys(respostas).forEach(k => delete respostas[k]);
    etapa = 0; log.innerHTML = ''; proxima();
  };

  if (log && resp) {
    resp.addEventListener('pointerdown', () => { rodando = true; });
    resp.addEventListener('keydown', () => { rodando = true; });
    // a conversa começa quando a seção aparece na tela
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); if (!comecou) proxima(); } }, { threshold: .25 });
      io.observe(log);
    } else proxima();
  }

  // atalhos dos cartões de serviço: já respondem a primeira pergunta
  $$('[data-servico]').forEach(a => a.addEventListener('click', () => {
    if (!log) return;
    rodando = true; comecou = true;
    const s = ++sessao;
    Object.keys(respostas).forEach(k => delete respostas[k]);
    log.innerHTML = '';
    etapa = 0;
    (async () => {
      limpa();
      await lojaFala(ETAPAS[0].pergunta);
      if (s === sessao) responde(a.dataset.servico);
    })();
  }));

  /* ---------- WhatsApp flutuante: some quando outro botão de contato está na tela ---------- */
  const wa = $('.wa');
  let observaContato = () => {};
  if (wa && 'IntersectionObserver' in window) {
    const visiveis = new Set();
    let digitando = false;
    const atualiza = () => wa.classList.toggle('is-hidden', digitando || visiveis.size > 0);
    const io = new IntersectionObserver((es) => { es.forEach(e => e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)); atualiza(); }, { threshold: .1 });
    $$('[data-contato]').forEach(el => io.observe(el));
    observaContato = (el) => io.observe(el);
    if (resp) {
      resp.addEventListener('focusin', (e) => { if (e.target.matches('input')) { digitando = true; atualiza(); } });
      resp.addEventListener('focusout', () => { digitando = false; atualiza(); });
    }
  }

  /* ---------- Fotos: tocar para ampliar ---------- */
  const caixa = $('[data-lightbox]');
  if (caixa && typeof caixa.showModal === 'function') {
    const img = $('[data-lb-img]', caixa);
    let origem = null;
    $$('.grade img').forEach(f => {
      f.tabIndex = 0; f.setAttribute('role', 'button');
      f.setAttribute('aria-label', `Ampliar foto: ${f.alt}`);
      const abre = () => { origem = f; img.src = f.currentSrc || f.src; img.alt = f.alt; caixa.showModal(); };
      f.addEventListener('click', abre);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abre(); } });
    });
    $('[data-lb-close]', caixa).addEventListener('click', () => caixa.close());
    caixa.addEventListener('click', (e) => { if (e.target === caixa) caixa.close(); });
    caixa.addEventListener('close', () => { if (origem) origem.focus(); });
  }

  /* ---------- Aberto agora? (horário de Ponta Porã, MS) ---------- */
  const HORAS = { Mon: [480, 1050], Tue: [480, 1050], Wed: [480, 1050], Thu: [480, 1050], Fri: [480, 1050], Sat: [480, 780] };
  const DIAS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DIA_PT = { Sun: 'domingo', Mon: 'segunda', Tue: 'terça', Wed: 'quarta', Thu: 'quinta', Fri: 'sexta', Sat: 'sábado' };
  const hm = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;
  const agora = () => {
    try {
      const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Campo_Grande', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const g = (t) => (p.find(x => x.type === t) || {}).value;
      return { dia: g('weekday'), min: (parseInt(g('hour'), 10) % 24) * 60 + parseInt(g('minute'), 10) };
    } catch (e) { const d = new Date(); return { dia: DIAS[d.getDay()], min: d.getHours() * 60 + d.getMinutes() }; }
  };
  const estado = () => {
    const { dia, min } = agora(); const h = HORAS[dia];
    if (h && min >= h[0] && min < h[1]) return { aberto: true, texto: `Aberto agora, até ${hm(h[1])}`, dia };
    if (h && min < h[0]) return { aberto: false, texto: `Fechado agora, abre hoje às ${hm(h[0])}`, dia };
    const i = DIAS.indexOf(dia);
    for (let k = 1; k <= 7; k++) { const d = DIAS[(i + k) % 7]; if (HORAS[d]) return { aberto: false, texto: `Fechado agora, abre ${k === 1 ? 'amanhã' : DIA_PT[d]} às ${hm(HORAS[d][0])}`, dia }; }
    return { aberto: false, texto: 'Fechado agora', dia };
  };
  const pinta = () => {
    const st = estado();
    $$('[data-open-status]').forEach(el => { $('[data-open-text]', el).textContent = st.texto; el.classList.toggle('is-closed', !st.aberto); el.hidden = false; });
    const n = DIAS.indexOf(st.dia);
    $$('[data-dias]').forEach(el => el.classList.toggle('is-hoje', el.dataset.dias.split(',').map(Number).includes(n)));
  };
  pinta(); setInterval(pinta, 60000);
})();
