// Mobile menu
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const dropdownParents = document.querySelectorAll(".dropdown > a");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("active");
      btn.setAttribute("aria-expanded", open);
    });
  }

  // Mobile dropdown expand/collapse (tap to open)
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  dropdownParents.forEach(link => {
    link.addEventListener("click", (e) => {
      if (!isMobile()) return;               // desktop: follow link
      e.preventDefault();                    // mobile: toggle submenu
      const parent = link.closest(".dropdown");
      parent.classList.toggle("open");
      const expanded = parent.classList.contains("open");
      link.setAttribute("aria-expanded", expanded);
    });
  });
});
