// Navbar scroll state
function updateNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  if (window.scrollY > 8) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', updateNavbar);
updateNavbar();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle (expects #theme-switch and #theme-switch-text in the DOM)
(function () {
  const root = document.documentElement;
  const checkbox = document.getElementById('theme-switch');
  const labelText = document.getElementById('theme-switch-text');

  function currentTheme() {
    return root.getAttribute('data-theme') || 'light';
  }
  function setTheme(next, persist = true) {
    root.setAttribute('data-theme', next);
    if (checkbox) checkbox.checked = (next === 'dark');
    if (labelText) labelText.textContent = (next === 'dark' ? 'Dark' : 'Light');
    if (persist) localStorage.setItem('theme', next);
  }

  // Initialize from attribute set by theme-init.js
  setTheme(currentTheme(), false);

  if (checkbox) {
    checkbox.addEventListener('change', () =>
      setTheme(checkbox.checked ? 'dark' : 'light')
    );
  }

  // Follow system changes until user explicitly chooses
  try {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem('theme');
    if (!saved && mq) {
      const handler = e => setTheme(e.matches ? 'dark' : 'light', false);
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener) mq.addListener(handler);
    }
  } catch (_) {}
})();

// Mobile nav + dropdown behavior (absolute overlay; does not push content)
(function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const menuBtn  = nav.querySelector('.menu-toggle');
  const navLinks = nav.querySelector('.nav-links');
  const triggers = nav.querySelectorAll('.dropdown > a');
  const mq = window.matchMedia('(max-width: 768px)');
  const isMobile = () => mq.matches;

  function closeAllSubmenus(except) {
    nav.querySelectorAll('.dropdown.open').forEach(li => {
      if (li !== except) {
        li.classList.remove('open');
        li.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function openMenu() {
    if (!navLinks) return;
    navLinks.classList.add('active');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    closeAllSubmenus();
  }

  function toggleMenu() {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.contains('active') ? closeMenu() : openMenu();
  }

  // Hamburger toggle
  if (menuBtn) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Outside click closes on mobile
  document.addEventListener('click', (e) => {
    if (!isMobile()) return;
    if (!navLinks?.classList.contains('active')) return;
    if (!nav.contains(e.target)) closeMenu();
  });

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu when a top-level non-dropdown link is clicked (mobile)
  navLinks?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (isMobile() && !a.closest('.dropdown')) closeMenu();
  });

  // Dropdown triggers (tap to open on mobile; desktop handled by CSS hover)
  triggers.forEach(a => {
    a.setAttribute('aria-haspopup', 'true');
    a.setAttribute('aria-expanded', 'false');

    a.addEventListener('click', (e) => {
      if (!isMobile()) return; // desktop: let it navigate
      e.preventDefault();
      const li = a.parentElement;
      const open = li.classList.contains('open');
      closeAllSubmenus(open ? null : li);
      li.classList.toggle('open');
      a.setAttribute('aria-expanded', String(!open));
    });

    a.addEventListener('keydown', (e) => {
      if (!isMobile()) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        a.click();
      }
    });
  });

  // Reset state when resizing up from mobile
  const onResize = () => {
    closeAllSubmenus();
    document.body.style.overflow = '';
    if (!isMobile()) navLinks?.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
  };
  if (mq.addEventListener) mq.addEventListener('change', onResize);
  else if (mq.addListener) mq.addListener(onResize);
})();







