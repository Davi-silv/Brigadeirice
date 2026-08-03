const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toggle && nav && header) {
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}
