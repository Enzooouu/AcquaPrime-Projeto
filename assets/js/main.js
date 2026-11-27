/* Acqua Prime Piscinas — interações da prévia (sem dependências) */
(() => {
  'use strict';

  const WA_NUMBER = '5567991661449'; // (67) 99166-1449
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- Topo: entrada do título ---------- */
  const ready = () => requestAnimationFrame(() => document.body.classList.add('is-ready'));
  // se a tela de abertura está na frente, o título só entra quando ela começa a subir
  const splashGone = new Promise(r => {
    if (!document.documentElement.classList.contains('splash-on') || window.__acquaSplash === 'out') return r();
    document.addEventListener('acqua:splash-out', () => setTimeout(r, 180), { once: true });
    setTimeout(r, 3500);
  });
  const fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 700))]) : Promise.resolve();
  Promise.all([fontsReady, splashGone]).then(ready);

  // Ondulação das letras: pausa quando o topo sai da tela (economiza bateria no celular)
  const rippleSvg = $('#ripple') && $('#ripple').ownerSVGElement;
  const hero = $('.hero');
  if (rippleSvg && rippleSvg.pauseAnimations) {
    if (reduceMotion) rippleSvg.pauseAnimations();
    else if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(([e]) => {
        e.isIntersecting ? rippleSvg.unpauseAnimations() : rippleSvg.pauseAnimations();
      }).observe(hero);
    }
  }

  // ondulação das letras só depois que a página terminou de carregar (não atrasa a primeira pintura)
  const startRipple = () => setTimeout(() => document.documentElement.classList.add('ripple-on'), 400);
  if (!reduceMotion) { if (document.readyState === 'complete') startRipple(); else window.addEventListener('load', startRipple, { once: true }); }


  /* ---------- Entradas das seções ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    // escalona as partes de cada seção
    $$('section, footer').forEach(sec => $$('[data-reveal]', sec).forEach((el, i) => el.style.setProperty('--i', i)));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- Simulador de orçamento ---------- */
  const form = $('[data-quote]');
  const preview = $('[data-preview]');
  const sendBtn = $('[data-send]');

  // medidas digitadas: aceita "6", "6,5", "6.5", "6m"
  const num = (v) => { const n = parseFloat(String(v || '').replace(',', '.').replace(/[^\d.]/g, '')); return n > 0 && n < 100 ? n : null; };
  const fmt = (n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const dims = () => {
    if (!form) return {};
    const c = num(form.comp && form.comp.value), l = num(form.larg && form.larg.value), p = num(form.prof && form.prof.value);
    if (!c && !l && !p) return {};
    const parts = [c ? `${fmt(c)} m de comprimento` : null, l ? `${fmt(l)} m de largura` : null, p ? `${fmt(p)} m de profundidade` : null].filter(Boolean);
    const vol = c && l && p ? c * l * p : null;
    return { text: parts.join(', ') + (vol ? ` (≈ ${fmt(Math.round(vol * 10) / 10)} m³ de água)` : ''), vol };
  };

  const buildMessage = () => {
    if (!form) return '';
    const fd = new FormData(form);
    const get = (k) => (fd.get(k) || '').toString().trim();
    const lines = ['Olá, Acqua Prime! Vim pelo site e gostaria de um orçamento.'];
    const details = [];
    // só entra na mensagem o que a pessoa realmente escolheu
    if (get('servico')) details.push(`*Serviço:* ${get('servico')}`);
    const d = dims();
    if (d.text) details.push(`*Medidas:* ${d.text}`);
    else if (get('tamanho')) details.push(`*Tamanho aproximado:* ${get('tamanho')}`);
    if (get('nome')) details.push(`*Nome:* ${get('nome')}`);
    if (get('local')) details.push(`*Bairro/cidade:* ${get('local')}`);
    if (details.length) lines.push('', ...details);
    if (get('obs')) lines.push('', `*Mais detalhes:* ${get('obs')}`);
    return lines.join('\n');
  };

  const escapeHtml = (s) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const updateQuote = () => {
    const msg = buildMessage();
    if (preview) preview.innerHTML = escapeHtml(msg).replace(/\*(.+?)\*/g, '<b>$1</b>');
    if (sendBtn) sendBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    const fb = $('[data-fallback-text]'); if (fb) fb.value = msg;
    const volEl = $('[data-volume]');
    if (volEl) {
      const d = dims();
      volEl.hidden = !d.vol;
      if (d.vol) volEl.textContent = `≈ ${fmt(Math.round(d.vol * 10) / 10)} m³ de água, ou ${fmt(Math.round(d.vol * 1000))} litros`;
    }
  };
  if (form) {
    // tocar de novo numa opção já marcada desmarca (radio normal não deixa)
    const remember = (e) => { const lab = e.target.closest('.chip'); if (lab) { const i = $('input', lab); i.dataset.was = String(i.checked); } };
    form.addEventListener('pointerdown', remember);
    form.addEventListener('keydown', (e) => { if (e.key === ' ' && e.target.matches('.chip input')) e.target.dataset.was = String(e.target.checked); });
    form.addEventListener('click', (e) => {
      const i = e.target;
      if (!i.matches || !i.matches('.chip input[type=radio]')) return;
      if (i.dataset.was === 'true') { i.checked = false; updateQuote(); }
      i.dataset.was = 'false';
    });
    form.addEventListener('input', updateQuote);
    form.addEventListener('change', updateQuote);
    form.addEventListener('submit', (e) => { e.preventDefault(); sendBtn && sendBtn.click(); });
    updateQuote();
  }

  const selectRadio = (name, value) => {
    const input = form && $$(`input[name="${name}"]`, form).find(i => i.value === value);
    if (input) { input.checked = true; updateQuote(); }
  };

  // Atalhos dos cartões de serviço: já marcam o serviço no simulador
  $$('[data-service]').forEach(a => a.addEventListener('click', () => selectRadio('servico', a.dataset.service)));

  /* ---------- Fileira de obras: setas, laço infinito e avanço automático ---------- */
  $$('[data-carousel]').forEach(car => {
    const track = $('[data-carousel-track]', car);
    const prev = $('[data-carousel-prev]', car);
    const next = $('[data-carousel-next]', car);
    if (!track) return;
    const loop = car.hasAttribute('data-carousel-loop');
    const GAP = 12;
    let setWidth = 0;
    if (loop) {
      // cópias antes e depois da lista original: quando a pessoa chega numa cópia, pula sem ela perceber para o mesmo ponto da original
      const originals = Array.from(track.children);
      const clone = (el) => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.setAttribute('data-clone', ''); $$('a, button', c).forEach(a => a.tabIndex = -1); return c; };
      originals.slice().reverse().forEach(el => track.prepend(clone(el)));
      originals.forEach(el => track.append(clone(el)));
      const measure = () => { setWidth = originals[0].offsetLeft - track.children[0].offsetLeft; };
      measure();
      // começa com a primeira obra original no centro
      const centerOn = (el) => { track.scrollLeft = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2; };
      centerOn(originals[0]);
      const wrap = () => {
        if (track.scrollLeft < setWidth * 0.5) track.scrollLeft += setWidth;
        else if (track.scrollLeft > setWidth * 1.5) track.scrollLeft -= setWidth;
      };
      let t;
      track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(wrap, 140); }, { passive: true });
      window.addEventListener('resize', () => { const k = setWidth ? track.scrollLeft / setWidth : 1; measure(); track.scrollLeft = setWidth * k; });
    }
    // marca como destaque a obra que está no centro da fileira
    let raf = 0;
    const markActive = () => {
      raf = 0;
      const r = track.getBoundingClientRect(); const mid = r.left + r.width / 2;
      let best = null, bestD = Infinity;
      Array.from(track.children).forEach(el => { const b = el.getBoundingClientRect(); const d = Math.abs(b.left + b.width / 2 - mid); if (d < bestD) { bestD = d; best = el; } });
      Array.from(track.children).forEach(el => el.classList.toggle('is-active', el === best));
    };
    track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(markActive); }, { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(markActive));
    markActive();
    const step = () => { const item = track.children[0]; return item ? item.getBoundingClientRect().width + GAP : track.clientWidth * 0.8; };
    const go = (dir) => track.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    const update = () => {
      if (loop || !prev || !next) return;
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
    };
    if (prev) prev.addEventListener('click', () => { go(-1); restart(); });
    if (next) next.addEventListener('click', () => { go(1); restart(); });
    track.addEventListener('scroll', update, { passive: true });
    update();

    // avança sozinho; para enquanto a pessoa mexe, passa o mouse, está com o foco ou a fileira está fora da tela
    const every = parseInt(car.dataset.carouselAuto || '0', 10);
    let timer = null, visible = false, hold = false;
    function restart() {
      clearInterval(timer); timer = null;
      if (!every || reduceMotion || !visible || hold) return;
      timer = setInterval(() => go(1), every);
    }
    if (every) {
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; restart(); }, { threshold: 0.3 }).observe(track);
      const pause = () => { hold = true; restart(); };
      const resume = () => { hold = false; restart(); };
      car.addEventListener('mouseenter', pause); car.addEventListener('mouseleave', resume);
      car.addEventListener('focusin', pause); car.addEventListener('focusout', resume);
      track.addEventListener('touchstart', pause, { passive: true });
      track.addEventListener('touchend', () => setTimeout(resume, 4000), { passive: true });
      document.addEventListener('visibilitychange', () => { hold = document.hidden; restart(); });
    }
  });

  /* ---------- WhatsApp fixo: some quando já existe outro botão de contato na tela
     (topo, Enviar pelo WhatsApp, contato, telefone do rodapé) ou enquanto a pessoa digita no orçamento ---------- */
  const waFloat = $('.wa-float');
  if (waFloat && 'IntersectionObserver' in window) {
    const onScreen = new Set();
    let typing = false;
    const refresh = () => waFloat.classList.toggle('is-hidden', typing || onScreen.size > 0);
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target));
      refresh();
    }, { threshold: 0.1 });
    $$('.hero-actions, [data-send], .place-actions, .footer-phones').forEach(el => io.observe(el));
    if (form) {
      form.addEventListener('focusin', (e) => { if (e.target.matches('input[type=text], textarea')) { typing = true; refresh(); } });
      form.addEventListener('focusout', () => { typing = false; refresh(); });
    }
  }

  /* ---------- Cabeçalho fixo e menu do celular ---------- */
  const header = $('[data-header]');
  const menuBtn = $('[data-menu-btn]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  if (header && menuBtn) {
    const setMenu = (on) => {
      header.classList.toggle('is-open', on);
      menuBtn.setAttribute('aria-expanded', String(on));
      $('.sr-only', menuBtn).textContent = on ? 'Fechar menu' : 'Abrir menu';
    };
    menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
    $$('[data-menu] a, .nav-cta, .wordmark', header).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && header.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
    document.addEventListener('click', (e) => { if (!header.contains(e.target)) setMenu(false); });
  }

  /* ---------- Fotos: clique para ampliar, com opção de zoom ---------- */
  const lb = $('[data-lightbox]');
  if (lb && typeof lb.showModal === 'function') {
    const lbImg = $('[data-lb-img]', lb);
    const lbCap = $('[data-lb-caption]', lb);
    const zoomBtn = $('[data-lb-zoom]', lb);
    const zoomLabel = $('[data-lb-zoom-label]', lb);
    let opener = null;
    const setZoom = (on, e) => {
      lb.classList.toggle('is-zoomed', on);
      zoomBtn.setAttribute('aria-pressed', String(on));
      zoomLabel.textContent = on ? 'Tirar zoom' : 'Dar zoom';
      if (on && e) aim(e); else if (!on) { lbImg.style.setProperty('--ox', '50%'); lbImg.style.setProperty('--oy', '50%'); }
    };
    // o ponto de zoom acompanha o mouse ou o dedo
    const aim = (e) => {
      const r = lbImg.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
      lbImg.style.setProperty('--ox', x + '%'); lbImg.style.setProperty('--oy', y + '%');
    };
    const open = (img) => {
      opener = img;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      // nas obras, mostra a legenda da obra; nas outras fotos, a descrição
      const fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
      lbCap.textContent = fc ? fc.textContent : img.alt;
      setZoom(false);
      lb.showModal();
    };
    $$('.service-media img, .step-body img, .t-photo img, .gallery-item img').forEach(img => {
      img.setAttribute('data-zoomable', '');
      const isClone = !!img.closest('[data-clone]');
      img.tabIndex = isClone ? -1 : 0;
      if (!isClone) img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Ampliar foto: ${img.alt}`);
      img.addEventListener('click', () => open(img));
      img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
    });
    let downAt = null;
    lbImg.addEventListener('pointerdown', (e) => { downAt = { x: e.clientX, y: e.clientY }; if (lb.classList.contains('is-zoomed')) lb.classList.add('is-panning'); });
    lbImg.addEventListener('pointermove', (e) => { if (lb.classList.contains('is-zoomed') && (e.pointerType === 'mouse' || downAt)) aim(e); });
    lbImg.addEventListener('pointerup', (e) => {
      lb.classList.remove('is-panning');
      const moved = downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8;
      downAt = null;
      if (!moved) setZoom(!lb.classList.contains('is-zoomed'), e); // toque ou clique simples liga/desliga o zoom
    });
    zoomBtn.addEventListener('click', () => setZoom(!lb.classList.contains('is-zoomed')));
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    // clicar fora da foto fecha
    $('[data-lb-stage]', lb).addEventListener('click', (e) => { if (e.target === e.currentTarget) lb.close(); });
    lb.addEventListener('close', () => { setZoom(false); if (opener) opener.focus(); });
  }

  /* ---------- Aberto agora? (horário de Ponta Porã, MS) ---------- */
  // seg a sex 8h às 17h30; sábado 8h às 13h; domingo fechado
  const HOURS = { Mon: [480, 1050], Tue: [480, 1050], Wed: [480, 1050], Thu: [480, 1050], Fri: [480, 1050], Sat: [480, 780] };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DAY_PT = { Sun: 'domingo', Mon: 'segunda', Tue: 'terça', Wed: 'quarta', Thu: 'quinta', Fri: 'sexta', Sat: 'sábado' };
  const hhmm = (m) => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;
  const openState = () => {
    let day, mins;
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Campo_Grande', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const get = (t) => (parts.find(p => p.type === t) || {}).value;
      day = get('weekday'); mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    } catch (e) { const d = new Date(); day = DAYS[d.getDay()]; mins = d.getHours() * 60 + d.getMinutes(); }
    const today = HOURS[day];
    if (today && mins >= today[0] && mins < today[1]) return { open: true, text: `Aberto agora, até ${hhmm(today[1])}` };
    if (today && mins < today[0]) return { open: false, text: `Fechado agora, abre hoje às ${hhmm(today[0])}` };
    const i = DAYS.indexOf(day);
    for (let k = 1; k <= 7; k++) {
      const d = DAYS[(i + k) % 7];
      if (HOURS[d]) return { open: false, text: `Fechado agora, abre ${k === 1 ? 'amanhã' : DAY_PT[d]} às ${hhmm(HOURS[d][0])}` };
    }
    return { open: false, text: 'Fechado agora' };
  };
  const paintStatus = () => {
    const st = openState();
    $$('[data-open-status]').forEach(el => {
      $('[data-open-text]', el).textContent = st.text;
      el.classList.toggle('is-closed', !st.open);
      el.hidden = false;
    });
  };
  paintStatus();
  setInterval(paintStatus, 60000);

})();
