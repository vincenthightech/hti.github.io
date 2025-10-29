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
      if (mq.addEventListener) {
        mq.addEventListener('change', e => setTheme(e.matches ? 'dark' : 'light', false));
      } else if (mq.addListener) {
        mq.addListener(e => setTheme(e.matches ? 'dark' : 'light', false));
      }
    }

   // Mobile nav + dropdown behavior (scoped)
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
    navLinks.classList.add('active');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // lock scroll under overlay
  }

  function closeMenu() {
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
    menuBtn.addEventListener('click', toggleMenu);
  }

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!isMobile()) return;
    if (!navLinks?.classList.contains('active')) return;
    if (!nav.contains(e.target)) closeMenu();
  });

  // Close menu on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close menu when a top-level link (not a dropdown trigger) is clicked
  navLinks?.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    // If it's not the trigger of a dropdown, close on mobile
    if (isMobile() && !a.closest('.dropdown')) closeMenu();
  });

  // Dropdown toggles (tap to open on mobile, normal hover on desktop)
  triggers.forEach(a => {
    a.setAttribute('aria-haspopup', 'true');
    a.setAttribute('aria-expanded', 'false');

    // Click/tap behavior for mobile
    a.addEventListener('click', (e) => {
      if (!isMobile()) return; // desktop: let it navigate
      e.preventDefault();
      const li = a.parentElement;
      const open = li.classList.contains('open');
      closeAllSubmenus(open ? null : li);
      li.classList.toggle('open');
      a.setAttribute('aria-expanded', String(!open));
    });

    // Keyboard support on mobile
    a.addEventListener('keydown', (e) => {
      if (!isMobile()) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        a.click();
      }
    });
  });

  // Reset state when resizing up from mobile
  mq.addEventListener('change', () => {
    closeAllSubmenus();
    document.body.style.overflow = '';
    // Ensure menu is closed when leaving mobile
    if (!isMobile()) navLinks?.classList.remove('active');
  });
})();


    
  } catch (_) {}

  
})();
