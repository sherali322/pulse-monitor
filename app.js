(() => {
  'use strict';
  const config = window.PULSE_CONFIG || {};
  const name = config.name || 'Pulse Monitor';
  document.querySelectorAll('[data-name]').forEach(el => { el.textContent = name; });
  document.querySelectorAll('[data-short-name]').forEach(el => { el.textContent = config.shortName || name; });
  document.querySelectorAll('.brand').forEach(el => { el.setAttribute('aria-label', `${name} home`); });
  document.title = `${name} — Small window. Big picture.`;
  if (config.description) document.getElementById('product-description').textContent = config.description;
  if (config.headline) {
    const lines = config.headline.split('\n');
    const h1 = document.getElementById('hero-title');
    h1.replaceChildren(document.createTextNode(lines[0]));
    if (lines.length > 1) { const span = document.createElement('span'); span.textContent = lines.slice(1).join(' '); h1.append(document.createElement('br'), span); }
  }
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('demo-disclaimer').hidden = config.demo === false;
  document.getElementById('demo-caption').hidden = config.demo === false;
  if (config.demo === false) document.querySelector('.caption-divider').hidden = true;
  if (typeof config.supportEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.supportEmail)) {
    const link = document.getElementById('support-link');
    link.href = `mailto:${config.supportEmail}`;
    link.hidden = false;
  }

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); nav.classList.remove('open'); }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { const wasOpen = menuButton.getAttribute('aria-expanded') === 'true'; closeMenu(); if (wasOpen) menuButton.focus(); } });

  const metrics = {
    network: { title: 'Download speed', value: '24.8', unit: 'MB/s', detail: 'Ethernet', secondary: 'Upload: 3.2 MB/s', max: '40', mid: '20', points: [97,95,102,89,94,75,83,69,87,80,51,64,53,76,65,71,38,50,31,48,43,70,59,40,50,23,39,30,45,26,36,13,33,20,41,22] },
    cpu: { title: 'CPU usage', value: '18', unit: '%', detail: 'CPU', secondary: 'Example: 8 logical cores', max: '100%', mid: '50%', points: [123,120,126,121,124,117,119,96,111,116,121,118,125,117,112,120,116,125,121,105,111,115,119,122,115,121,124,119,121,114,116,121,119,123,120,123] },
    memory: { title: 'Memory usage', value: '42', unit: '%', detail: 'RAM', secondary: 'Example: 6.7 of 16 GB', max: '100%', mid: '50%', points: [90,90,89,90,90,89,88,88,87,88,88,87,87,88,87,87,86,87,87,86,86,85,85,86,86,85,85,84,85,86,86,85,86,86,87,87] }
  };
  const tabs = Array.from(document.querySelectorAll('[data-metric]'));
  function setMetric(id) {
    const data = metrics[id];
    if (!data) return;
    tabs.forEach(t => { const active = t.dataset.metric === id; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; });
    document.getElementById('demo-content').setAttribute('aria-labelledby', `tab-${id}`);
    document.getElementById('metric-name').textContent = data.title;
    const unit = document.createElement('small'); unit.textContent = data.unit;
    document.getElementById('metric-value').replaceChildren(document.createTextNode(`${data.value} `), unit);
    document.getElementById('metric-detail').textContent = data.detail;
    document.getElementById('metric-secondary').textContent = data.secondary;
    document.getElementById('chart-max').textContent = data.max;
    document.getElementById('chart-mid').textContent = data.mid;
    const path = data.points.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i * 500 / (data.points.length - 1)).toFixed(1)} ${y}`).join(' ');
    document.getElementById('demo-line').setAttribute('d', path);
    document.getElementById('demo-area').setAttribute('d', `${path} L500 150 L0 150 Z`);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setMetric(tab.dataset.metric));
    tab.addEventListener('keydown', e => {
      let target;
      if (e.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') target = tabs[(i + tabs.length - 1) % tabs.length];
      if (e.key === 'Home') target = tabs[0];
      if (e.key === 'End') target = tabs[tabs.length - 1];
      if (target) { e.preventDefault(); setMetric(target.dataset.metric); target.focus(); }
    });
  });
  setMetric('network');

  const builds = Array.isArray(config.downloads) && config.downloads.length ? config.downloads : [{ id: 'x64', label: 'Windows x64', url: '' }];
  const select = document.getElementById('architecture');
  builds.forEach((build, i) => { const option = document.createElement('option'); option.value = String(i); option.textContent = build.label; select.append(option); });
  function safeDownloadUrl(value) {
    if (!value || typeof value !== 'string') return null;
    try { const url = new URL(value, location.href); if (url.protocol === 'https:' || (url.protocol === location.protocol && url.origin === location.origin && value.startsWith('/') && !value.startsWith('//'))) return url.href; } catch (_) { /* Keep the unavailable state. */ }
    return null;
  }
  function updateDownload() {
    const build = builds[Number(select.value)];
    const url = safeDownloadUrl(build.url);
    const button = document.getElementById('download-button');
    button.setAttribute('aria-disabled', String(!url)); button.tabIndex = url ? 0 : -1;
    if (url) { button.href = url; if (build.filename) button.setAttribute('download', build.filename); else button.removeAttribute('download'); }
    else { button.removeAttribute('href'); button.removeAttribute('download'); }
    button.querySelector('span').textContent = url ? 'Download for Windows' : 'Download coming soon';
    document.getElementById('version-label').textContent = url ? (build.version ? `Version ${build.version}` : 'Available to download') : 'First release in progress';
    document.getElementById('release-badge').textContent = url ? 'RELEASE' : 'SOON';
    document.getElementById('download-message').textContent = url ? [build.version && `Version ${build.version}`, build.size].filter(Boolean).join(' · ') || 'Download the program installer.' : 'The installer hasn’t been published yet.';
    document.getElementById('requirements-text').textContent = build.requirements || 'System requirements will be available with the first release.';
  }
  const available = builds.some(b => safeDownloadUrl(b.url));
  document.getElementById('release-caption').textContent = available ? 'Available to download' : 'First release coming soon';
  if (available) document.getElementById('availability-answer').textContent = 'A release is available in the download section. Choose the right architecture and check the version and system requirements before downloading.';
  if (available) { const first = builds.findIndex(b => safeDownloadUrl(b.url)); select.value = String(first); }
  select.addEventListener('change', updateDownload);
  document.getElementById('download-button').addEventListener('click', e => { if (e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault(); });
  updateDownload();
})();
