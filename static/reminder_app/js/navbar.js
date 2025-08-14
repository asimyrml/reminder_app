// static/reminder_app/js/navbar.js
document.addEventListener('DOMContentLoaded', function () {
  const btn  = document.getElementById('rmd-theme-toggle');
  const icon = document.getElementById('rmd-theme-icon');
  if (!btn || !icon) return;

  function setTheme(next){
    document.documentElement.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    try { localStorage.setItem('rmd-theme', next); } catch(e) {}
  }

  // İlk yüklemede mevcut theme'i oku (base.html head'de zaten attribute set edildi)
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current);

  btn.addEventListener('click', function () {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(cur === 'light' ? 'dark' : 'light');
  });
});
