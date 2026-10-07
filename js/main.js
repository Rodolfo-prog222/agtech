(() => {
  const WHATSAPP = '5564993266464';
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Navegação ---------- */
  const nav = document.querySelector('.nav');
  const menu = document.getElementById('menu');
  const toggle = document.querySelector('.nav-toggle');

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    nav.classList.add('is-solid');
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }));

  const links = [...menu.querySelectorAll('a')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(l => { const s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });

  /* ---------- Hero: sequência por rolagem ---------- */
  const hero = document.querySelector('.hero');
  const stage = hero.querySelector('.hero-stage');
  const frames = [...hero.querySelectorAll('.frame')];
  const chapters = [...hero.querySelectorAll('.chapter')];
  const trackItems = [...hero.querySelectorAll('.track li')];
  const finalPanel = hero.querySelector('.hero-final');
  const reticle = hero.querySelector('.reticle');
  const hud = {
    env: hero.querySelector('[data-hud="env"]'),
    tel: hero.querySelector('[data-hud="tel"]'),
    link: hero.querySelector('[data-hud="link"]'),
    lat: hero.querySelector('[data-hud="lat"]'),
    lon: hero.querySelector('[data-hud="lon"]')
  };
  const LAST = frames.length - 1;
  const ENV = ['CIDADE', 'CIDADE', 'RODOVIA', 'RODOVIA', 'CAMPO', 'CAMPO', 'CONECTADO'];
  const SPEED = [38, 54, 72, 86, 9, 7, 0];
  const LINK = ['4G · RF', '4G · RF', '4G · RF', '4G · SAT', 'RÁDIO · SAT', 'STARLINK', 'TODOS ONLINE'];

  frames.forEach(f => {
    const pos = f.dataset.pos;
    if (pos) f.querySelector('img').style.objectPosition = pos;
  });

  let lastIdx = -1;
  function renderHero() {
    const range = hero.offsetHeight - innerHeight;
    const p = clamp(-hero.getBoundingClientRect().top / range);
    if (p >= 1 && lastIdx === LAST) return;

    const intro = clamp(1 - p / 0.05);
    stage.style.setProperty('--intro', intro);
    stage.style.setProperty('--introY', `${-(1 - intro) * 60}px`);

    // t percorre os quadros 0..LAST; o último quadro fica fixo no fim
    const t = Math.min(LAST, clamp((p - 0.05) / 0.95) * (LAST + 0.7));

    frames.forEach((f, i) => {
      const o = i === 0 ? 1 : clamp((t - i + 0.4) / 0.4);
      f.style.opacity = o;
      if (reduceMotion) return;
      if (t > i - 0.5 && t < i + 1.2) {
        const u = clamp((t - i + 0.4) / 1.4);
        const img = f.firstElementChild;
        img.style.setProperty('--z', (1.16 - 0.12 * u).toFixed(4));
        img.style.setProperty('--x', `${(1.5 - 3 * u).toFixed(3)}%`);
      }
    });

    const idx = clamp(Math.floor(t + 0.2), 0, LAST);
    const fin = clamp((t - 5.6) / 0.4);
    stage.style.setProperty('--fin', fin);
    stage.style.setProperty('--finY', `${(1 - fin) * 30}px`);
    stage.style.setProperty('--net', clamp((t - 5.5) / 0.5));
    stage.style.setProperty('--tint', (0.32 - 0.24 * fin).toFixed(3));
    stage.style.setProperty('--ret', idx === LAST ? 0 : 1);
    stage.style.setProperty('--p', (t / LAST).toFixed(4));
    finalPanel.classList.toggle('is-on', fin > 0.5);

    chapters.forEach((c, i) => c.classList.toggle('is-on', i === idx && intro < 0.3 && idx < LAST));
    trackItems.forEach((li, i) => {
      li.classList.toggle('is-on', i === idx);
      li.classList.toggle('is-done', i < idx);
    });

    hud.lat.textContent = (-17.8131 + Math.sin(t * 1.3) * 0.0042).toFixed(4);
    hud.lon.textContent = (-50.5965 + Math.cos(t * 0.9) * 0.0057).toFixed(4);

    if (idx !== lastIdx) {
      lastIdx = idx;
      hud.env.textContent = ENV[idx];
      hud.tel.textContent = `${String(SPEED[idx]).padStart(3, '0')} km/h`;
      hud.link.textContent = LINK[idx];
      const [rx, ry] = (frames[idx].dataset.pos || '60% 50%').split(' ');
      reticle.style.setProperty('--rx', rx);
      reticle.style.setProperty('--ry', ry);
    }
  }

  // Pré-carrega os quadros do hero
  frames.forEach(f => { const i = new Image(); i.src = f.querySelector('img').src; });

  /* ---------- Faixas de transição (parallax) ---------- */
  const bands = [...document.querySelectorAll('.band')];
  function renderBands() {
    if (reduceMotion) return;
    bands.forEach(b => {
      const r = b.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const d = r.top + r.height / 2 - innerHeight / 2;
      b.querySelector('.band-img').style.setProperty('--py', `${d * -0.18}px`);
      b.querySelector('.band-copy').style.setProperty('--bx', `${d * 0.12}px`);
    });
  }

  /* ---------- Loop de rolagem ---------- */
  const wa = document.querySelector('.wa-float');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      renderHero();
      renderBands();
      const pastHero = hero.getBoundingClientRect().bottom < innerHeight * 0.6;
      nav.classList.toggle('is-solid', scrollY > 30 && (pastHero || menu.classList.contains('is-open')));
      wa.classList.toggle('is-on', pastHero);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Revelação ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Faixa de serviços (loop contínuo) ---------- */
  const track = document.querySelector('.marquee-track');
  if (!reduceMotion) track.innerHTML += track.innerHTML.replace(/<span>/g, '<span aria-hidden="true">');

  /* ---------- Jornada do cliente (abas) ---------- */
  const tabs = [...document.querySelectorAll('.needs [role="tab"]')];
  function select(tab) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!k) return;
      e.preventDefault();
      const next = tabs[(i + k + tabs.length) % tabs.length];
      select(next); next.focus();
    });
  });

  /* ---------- Orçamento via WhatsApp ---------- */
  const form = document.getElementById('orcamento');
  const note = form.querySelector('.form-note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = (data.get('nome') || '').trim();
    const nomeInput = form.elements.nome;
    if (!nome) {
      nomeInput.classList.add('is-invalid');
      note.textContent = 'Informe seu nome para continuar.';
      nomeInput.focus();
      return;
    }
    nomeInput.classList.remove('is-invalid');
    note.textContent = '';

    const lines = [`Olá, AG Tech! Meu nome é ${nome}.`];
    const cidade = (data.get('cidade') || '').trim();
    if (cidade) lines.push(`Cidade: ${cidade}`);
    const veic = data.getAll('veiculo');
    if (veic.length) lines.push(`Veículo/máquina: ${veic.join(', ')}`);
    const int = data.getAll('interesse');
    if (int.length) lines.push(`Interesse: ${int.join(', ')}`);
    const msg = (data.get('msg') || '').trim();
    if (msg) lines.push('', msg);
    lines.push('', 'Gostaria de um orçamento.');

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });

  document.getElementById('ano').textContent = new Date().getFullYear();
})();
