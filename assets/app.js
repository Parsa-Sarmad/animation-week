{
const S = window.SITE || {}, W = window.WORKS || [];
const A = S.artist || {}, E = S.event || {};
const app = document.getElementById('app');
const BRAND = 'Animation Week';

const fa = v => String(v ?? '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const kind = w => (w.video || w.embed) ? 'video' : ((w.images || []).length > 1 ? 'gallery' : 'image');
const coverOf = w => w.cover || (w.images || [])[0] || '';
const hashOf = w => 'work-' + w.id;

const ICON = {
  video: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm6 4.2v7.6L16.4 12 10 8.2Z"/></svg>',
  gallery: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h13a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M3 7v13a1 1 0 0 0 1 1h13" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m9 6 6 6-6 6"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="m15 6-6 6 6 6"/></svg>'
};
const GHOST = (id = 'g') => `<svg viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf8fd"/><stop offset=".65" stop-color="#ece4f3"/><stop offset="1" stop-color="#c7b4dc"/></linearGradient></defs><path fill="url(#${id})" d="M34 62C32 30 54 9 76 10c25 1 37 24 34 55l-2 64c-1 11-10 12-12 0l-4-16c-2-8-8-8-10 2l-4 21c-2 10-12 10-12-2l-2-15c-2-10-10-10-12 0l-4 9c-4 10-14 8-12-4l2-26c-9-2-21-5-29-11-7-5-4-13 4-11 7 2 15 4 21 4Z"/><ellipse cx="69" cy="58" rx="4.6" ry="7.4" fill="#1d1428"/><ellipse cx="87" cy="60" rx="4.2" ry="7" fill="#1d1428"/></svg>`;
const spk = (x, y, s, c, d = 0) => `<i class="spk" style="inset-inline-start:${x};top:${y};--s:${s}px;--c:${c};--d:${d}s"></i>`;

const counts = () => {
  const v = W.filter(w => kind(w) === 'video').length;
  return { all: W.length, video: v, image: W.length - v };
};
let filter = 'all', returnTo = null;

function header() {
  return `<header class="hero">
    <div class="sill"></div>
    ${spk('49%', 'clamp(46px,9.6vw,112px)', 22, '#fff', .4).replace('spk"', 'spk m-hide"')}
    ${spk('88%', '62%', 26, 'var(--pink)', 1.1)}
    ${spk('7%', '76%', 18, 'var(--violet)', 2)}
    <h1 class="title" aria-label="Animation Week — انیمیشن و معماری"><span>ANIMATION</span><span class="row2"><span>WEEK</span><span class="fa">انیمیشن و معماری</span></span><span class="ghost" aria-hidden="true">${GHOST('gh')}</span></h1>
    ${spk('49%', 'calc(100% - 22px)', 20, '#fff', 1.6).replace('spk"', 'spk m-hide"')}
  </header>`;
}

function footer() {
  const s = (E.sessions || []).map(x => `<li><b>${esc(x.date)}</b>${esc(x.place)}</li>`).join('');
  return `<footer class="foot"><div class="inner">
    <h3>${esc(E.title || 'هفته‌ی انیمیشن')}</h3>
    <ul class="sessions">${s}</ul>
    <div class="small"><span>${esc(A.name || '')}${A.nameEn ? ' · ' + esc(A.nameEn) : ''}</span><a href="#qr">کیوآرکد آثار برای چاپ</a></div>
  </div></footer>`;
}

function tile(w) {
  const k = kind(w);
  const badge = k === 'image' ? '' : `<span class="badge">${ICON[k]}</span>`;
  return `<a class="tile" id="t-${esc(w.id)}" href="#${hashOf(w)}" aria-label="${esc(w.title)}">
    <img src="${esc(coverOf(w))}" alt="" loading="lazy" decoding="async">${badge}
    <span class="cap">${esc(w.title)}<small>${esc(w.medium || '')}</small></span></a>`;
}

function gridHTML() {
  const list = W.filter(w => filter === 'all' || (filter === 'video') === (kind(w) === 'video'));
  return list.length ? list.map(tile).join('') : `<p class="empty">هنوز اثری در این بخش نیست.</p>`;
}

function renderHome() {
  document.title = `${BRAND} · ${A.name || 'انیمیشن و معماری'}`;
  const c = counts();
  const av = A.avatar ? `<img src="${esc(A.avatar)}" alt="${esc(A.name)}">` : `<span style="display:grid;place-items:center;padding:14%">${GHOST('ga')}</span>`;
  const links = (A.links || []).filter(l => l.url).map(l => `<a class="chip" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
  const tabs = [['all', 'همه', ICON.grid, c.all], ['video', 'فیلم‌ها', ICON.video, c.video], ['image', 'تصاویر', ICON.image, c.image]]
    .map(([k, l, i, n]) => `<button class="tab" role="tab" data-f="${k}" aria-selected="${filter === k}">${i}<span class="lbl">${l}</span><span class="n">${fa(n)}</span></button>`).join('');
  app.innerHTML = `${header()}
  <div class="inner">
    <section class="profile">
      <div class="avatar">${av}</div>
      <div class="who">
        <h2>${esc(A.name || '')}</h2>
        ${A.nameEn ? `<p class="en">${esc(A.nameEn)}</p>` : ''}
        <ul class="stats"><li><b>${fa(c.all)}</b>اثر</li><li><b>${fa(c.video)}</b>فیلم</li><li><b>${fa(c.image)}</b>تصویر</li></ul>
      </div>
      <p class="bio">${A.role ? `<span class="role">${esc(A.role)}</span>` : ''}${esc(A.bio || '')}</p>
      ${links ? `<div class="links">${links}</div>` : ''}
      ${S.sample ? `<p class="note">آثار و متن‌های این صفحه نمونه‌اند و با آثار واقعی جایگزین می‌شوند.</p>` : ''}
    </section>
    <nav class="tabs" role="tablist" aria-label="دسته‌بندی آثار">${tabs}</nav>
    <section class="grid" id="grid">${gridHTML()}</section>
  </div>${footer()}`;
  app.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => {
    filter = b.dataset.f;
    app.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', x === b));
    document.getElementById('grid').innerHTML = gridHTML();
  }));
  if (returnTo) {
    const t = document.getElementById('t-' + returnTo);
    if (t) { t.scrollIntoView({ block: 'center' }); t.classList.add('flash'); }
    returnTo = null;
  } else window.scrollTo(0, 0);
}

function bar(extra = '') {
  return `<div class="bar"><div class="inner"><a class="back" href="#">${ICON.back}همه‌ی آثار</a>${extra}<a class="mini" href="#">ANIMATION WEEK</a></div></div>`;
}

function media(w) {
  if (w.embed) return `<div class="view embed"><iframe src="${esc(w.embed)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(w.title)}"></iframe></div>`;
  if (w.video) return `<div class="view"><video src="${esc(w.video)}#t=0.1"${w.poster ? ` poster="${esc(w.poster)}"` : ''} controls playsinline preload="metadata"></video></div>`;
  const imgs = (w.images && w.images.length ? w.images : [coverOf(w)]).filter(Boolean);
  if (imgs.length < 2) return `<div class="view"><img src="${esc(imgs[0] || '')}" alt="${esc(w.title)}"></div>`;
  return `<div class="view gal"><div class="slides" tabindex="0" aria-label="گالری ${esc(w.title)}">${imgs.map((s, i) => `<img src="${esc(s)}" alt="${esc(w.title)} — ${fa(i + 1)}" ${i ? 'loading="lazy"' : ''}>`).join('')}</div>
    <button class="nav-btn prev" aria-label="تصویر قبلی" disabled>${ICON.right}</button><button class="nav-btn next" aria-label="تصویر بعدی">${ICON.left}</button></div>`;
}

function renderWork(w) {
  const i = W.indexOf(w), prev = W[(i - 1 + W.length) % W.length], next = W[(i + 1) % W.length];
  const n = (w.images || []).length;
  const meta = [['سال', w.year], ['تکنیک', w.medium], ['مدت', w.duration]].filter(m => m[1])
    .map(([k, v]) => `<li><span>${k}</span>${esc(fa(v))}</li>`).join('');
  const text = (Array.isArray(w.text) ? w.text : [w.text]).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');
  document.title = `${w.title} · ${BRAND}`;
  app.innerHTML = `${bar()}
  <div class="inner">
    <article class="work">
      <div class="stage"><div class="frame">${media(w)}</div>
        ${kind(w) === 'gallery' ? `<div class="dots">${Array.from({ length: n }, (_, j) => `<button aria-label="تصویر ${fa(j + 1)}" aria-current="${!j}"></button>`).join('')}</div>` : ''}
      </div>
      <div class="info">
        <p class="by">${esc(w.artist || A.name || '')}</p>
        <h1>${esc(w.title)}</h1>
        ${w.titleEn ? `<p class="en">${esc(w.titleEn)}</p>` : ''}
        ${meta ? `<ul class="meta">${meta}</ul>` : ''}
        <div class="text">${text}</div>
        ${w.credits ? `<p class="credits">${esc(w.credits)}</p>` : ''}
      </div>
    </article>
    ${W.length > 1 ? `<nav class="pn" aria-label="آثار دیگر">
      <a href="#${hashOf(prev)}"><img src="${esc(coverOf(prev))}" alt=""><span><small>اثر قبلی</small><b>${esc(prev.title)}</b></span></a>
      <a class="nx" href="#${hashOf(next)}"><img src="${esc(coverOf(next))}" alt=""><span><small>اثر بعدی</small><b>${esc(next.title)}</b></span></a>
    </nav>` : ''}
    <div class="all"><a class="btn ghosty" href="#">${ICON.grid.replace('<svg', '<svg width="18" height="18"')}دیدن همه‌ی آثار</a></div>
  </div>${footer()}`;
  returnTo = w.id;
  window.scrollTo(0, 0);
  const sl = app.querySelector('.slides');
  if (sl) {
    const dots = [...app.querySelectorAll('.dots button')], pv = app.querySelector('.nav-btn.prev'), nx = app.querySelector('.nav-btn.next');
    const cur = () => Math.round(Math.abs(sl.scrollLeft) / sl.clientWidth);
    const go = k => sl.children[Math.max(0, Math.min(n - 1, k))].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    const sync = () => { const c = cur(); dots.forEach((d, j) => d.setAttribute('aria-current', j === c)); pv.disabled = c === 0; nx.disabled = c === n - 1; };
    sl.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    dots.forEach((d, j) => d.addEventListener('click', () => go(j)));
    pv.addEventListener('click', () => go(cur() - 1));
    nx.addEventListener('click', () => go(cur() + 1));
    sl.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') go(cur() + 1); if (e.key === 'ArrowRight') go(cur() - 1); });
  }
}

const KEY = 'aw-qr-base';
const store = { get() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }, set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} } };
const pageBase = () => location.href.split('#')[0];
const linkFor = (base, w) => base.trim().split('#')[0] + '#' + hashOf(w);

function renderQR() {
  document.title = `کیوآرکد آثار · ${BRAND}`;
  const base = (S.url || '').trim() || store.get() || pageBase();
  app.innerHTML = `${bar()}
  <div class="inner">
    <section class="qr-head">
      <h1>کیوآرکد آثار برای چاپ</h1>
      <p>هر کارت به صفحه‌ی همان اثر می‌رود. کارت‌ها را چاپ کنید و کنار هر اثر بگذارید؛ در چاپ، هر برگه‌ی A4 چهار کارت دارد.</p>
      <form class="qr-form" id="qf">
        <label for="base">نشانی سایت (کدها از روی همین ساخته می‌شوند)<input id="base" type="url" value="${esc(base)}" spellcheck="false" autocomplete="off"></label>
        <button class="btn" type="button" id="pr">چاپ کارت‌ها</button>
      </form>
      ${S.url ? '' : `<p class="warn">نشانی نهایی سایت هنوز در فایل data/works.js ثبت نشده. پیش از چاپ، نشانی‌ای را که سایت روی آن منتشر می‌شود در کادر بالا بنویسید و یک کد را با گوشی امتحان کنید.</p>`}
      <p class="warn" id="pmsg" hidden>این پیش‌نمایش اجازه‌ی باز کردن پنجره‌ی چاپ را ندارد؛ روی سایت منتشرشده دکمه کار می‌کند (یا Ctrl+P).</p>
    </section>
    <section class="sheet" id="sheet"></section>
  </div>`;
  const input = document.getElementById('base'), sheet = document.getElementById('sheet');
  const draw = () => {
    const b = input.value.trim() || pageBase();
    sheet.innerHTML = W.map(w => {
      const url = linkFor(b, w);
      let svg = '';
      try { svg = window.qrSVG ? window.qrSVG(url, { level: 'M', quiet: 4 }) : ''; } catch (e) { svg = ''; }
      return `<div class="qcard"><div class="qfilm"></div><div class="qbody">
        <span class="qbrand">ANIMATION WEEK</span>
        <div class="qbox">${svg || '<p>کد ساخته نشد</p>'}</div>
        <span class="qnum">اثر ${fa(w.id)}</span>
        <h3>${esc(w.title)}</h3>${w.titleEn ? `<p class="qen">${esc(w.titleEn)}</p>` : ''}
        <p class="qcta">برای دیدن اثر، کد را با دوربین گوشی اسکن کنید</p>
        <p class="qurl">${esc(url)}</p></div><div class="qfilm"></div></div>`;
    }).join('');
  };
  input.addEventListener('input', () => { store.set(input.value.trim()); draw(); });
  document.getElementById('qf').addEventListener('submit', e => e.preventDefault());
  document.getElementById('pr').addEventListener('click', () => {
    const before = Date.now();
    try { window.print(); } catch (e) {}
    if (Date.now() - before < 60) document.getElementById('pmsg').hidden = false;
  });
  draw();
  window.scrollTo(0, 0);
}

function route() {
  const h = decodeURIComponent(location.hash.slice(1));
  if (h === 'qr') return renderQR();
  if (h.startsWith('work-')) {
    const w = W.find(x => hashOf(x) === h);
    if (w) return renderWork(w);
    document.title = BRAND;
    app.innerHTML = `${bar()}<div class="inner missing"><h1>این اثر پیدا نشد</h1><p>شاید نشانی کامل نیست. همه‌ی آثار را از صفحه‌ی اصلی ببینید.</p><a class="btn" href="#">صفحه‌ی اصلی</a></div>${footer()}`;
    return;
  }
  renderHome();
}

window.addEventListener('hashchange', route);
route();
}
