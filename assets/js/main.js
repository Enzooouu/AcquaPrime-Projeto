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

  /* ---------- Orçamento: tudo numa mensagem só ---------- */
  const pedido = $('[data-pedido]');
  const previa = $('[data-previa]');
  const enviar = $('[data-enviar]');
  const esc = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const monta = () => {
    const f = new FormData(pedido);
    const v = (k) => (f.get(k) || '').toString().trim();
    const l = ['Olá, Acqua Prime! Vim pelo site e gostaria de um orçamento.'];
    const d = [];
    const servicos = f.getAll('servico');
    if (servicos.length) d.push(`*Procuro:* ${servicos.length > 1 ? servicos.slice(0, -1).join(', ') + ' e ' + servicos[servicos.length - 1] : servicos[0]}`);
    if (v('m2nao')) d.push('*Tamanho:* ainda não sei');
    else if (v('m2')) d.push(`*Tamanho:* ${v('m2').replace(/\s*m²?\s*$/i, '')} m²`);
    if (v('ladrilho')) d.push(`*Ladrilho:* ${v('ladrilho')}`);
    if (v('nome')) d.push(`*Nome:* ${v('nome')}`);
    if (v('bairro')) d.push(`*Bairro:* ${v('bairro')}`);
    if (d.length) l.push('', ...d);
    if (v('obs')) l.push('', `*Mais informações:* ${v('obs')}`);
    return l.join('\n');
  };
  const atualizaPedido = () => {
    const m2 = pedido.querySelector('[name=m2]');
    m2.disabled = pedido.querySelector('[name=m2nao]').checked;
    const txt = monta();
    previa.innerHTML = esc(txt).replace(/\*(.+?)\*/g, '<b>$1</b>');
    enviar.href = `${WA}?text=${encodeURIComponent(txt)}`;
    $('[data-texto]', pedido).value = txt;
  };
  if (pedido && previa && enviar) {
    // tocar de novo numa opção marcada desmarca
    pedido.addEventListener('pointerdown', (e) => { const l = e.target.closest('label'); const i = l && l.querySelector('input[type=radio]'); if (i) i.dataset.era = String(i.checked); });
    pedido.addEventListener('click', (e) => { const i = e.target; if (i.matches && i.matches('input[type=radio]') && i.dataset.era === 'true') { i.checked = false; i.dataset.era = 'false'; atualizaPedido(); } });
    // tamanho: só números (aceita vírgula ou ponto)
    const campoM2 = pedido.querySelector('[name=m2]');
    campoM2.addEventListener('input', () => {
      const limpo = campoM2.value.replace(/[^0-9.,]/g, '').replace(/([.,].*)[.,]/g, '$1').slice(0, 6);
      if (limpo !== campoM2.value) campoM2.value = limpo;
    });
    const obs = pedido.querySelector('[name=obs]'), conta = $('[data-conta]', pedido);
    if (obs && conta) obs.addEventListener('input', () => { conta.textContent = `${obs.value.length}/200`; });
    pedido.addEventListener('input', atualizaPedido);
    pedido.addEventListener('change', atualizaPedido);
    pedido.addEventListener('submit', (e) => { e.preventDefault(); enviar.click(); });
    atualizaPedido();
  }
  // atalhos dos cartões de serviço: já marcam a opção
  $$('[data-servico]').forEach(a => a.addEventListener('click', () => {
    const i = pedido && $$('input[name=servico]', pedido).find(x => x.value === a.dataset.servico);
    if (i && !i.checked) { i.checked = true; atualizaPedido(); }
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
    if (pedido) {
      pedido.addEventListener('focusin', (e) => { if (e.target.matches('input[type=text], textarea')) { digitando = true; atualiza(); } });
      pedido.addEventListener('focusout', () => { digitando = false; atualiza(); });
    }
  }

  /* ---------- Antes e depois: arrastar ---------- */
  $$('[data-comparar]').forEach(box => {
    const r = $('[data-comparar-range]', box);
    const set = (v) => { box.style.setProperty('--pos', v + '%'); box.style.setProperty('--p', v / 100); };
    r.addEventListener('input', () => set(r.value));
    set(r.value);
  });

  /* ---------- Fotos: tocar para ampliar ---------- */
  const caixa = $('[data-lightbox]');
  if (caixa && typeof caixa.showModal === 'function') {
    const img = $('[data-lb-img]', caixa);
    let origem = null;
    $$('.grade img, .prod img').forEach(f => {
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
