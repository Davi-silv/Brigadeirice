const WHATSAPP_NUMBER = "5522999315667";

const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const desktopQuery = window.matchMedia("(min-width: 821px)");

const setMenuOpen = (open) => {
  if (!toggle || !nav || !header) return;
  nav.classList.toggle("is-open", open);
  header.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  document.body.style.overflow = open ? "hidden" : "";
};

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toggle && nav && header) {
  toggle.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  const syncDesktop = () => {
    if (desktopQuery.matches) setMenuOpen(false);
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", syncDesktop);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(syncDesktop);
  }

  window.addEventListener("resize", syncDesktop, { passive: true });
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
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

const orderForm = document.querySelector("#pedido-form");
const orderCount = document.querySelector("#pedido-count");
const orderHint = document.querySelector("#pedido-hint");
const orderBar = document.querySelector("#pedido-bar");
const orderClear = document.querySelector("#pedido-limpar");
const orderSubmit = document.querySelector("#pedido-enviar");
const flavorInputs = document.querySelectorAll('input[name="sabor"]');
const whatsappLinks = document.querySelectorAll(".js-whatsapp-order");

const getSelectedFlavors = () => {
  const tradicionais = [];
  const gourmet = [];

  flavorInputs.forEach((input) => {
    if (!input.checked) return;
    if (input.dataset.linha === "tradicional") {
      tradicionais.push(input.value);
    } else {
      gourmet.push(input.value);
    }
  });

  return { tradicionais, gourmet, total: tradicionais.length + gourmet.length };
};

const buildWhatsAppMessage = ({ tradicionais, gourmet, total }) => {
  if (!total) {
    return "Olá! Gostaria de fazer um pedido na Brigadeirice.";
  }

  const lines = ["Olá! Gostaria de fazer um pedido na Brigadeirice:", ""];

  if (tradicionais.length) {
    lines.push("*Sabores tradicionais:*");
    tradicionais.forEach((sabor) => lines.push(`- ${sabor}`));
    lines.push("");
  }

  if (gourmet.length) {
    lines.push("*Sabores gourmet:*");
    gourmet.forEach((sabor) => lines.push(`- ${sabor}`));
    lines.push("");
  }

  lines.push("Aguardo o retorno para finalizar o pedido. 🙂");
  return lines.join("\n");
};

const buildWhatsAppUrl = (selection) => {
  const text = encodeURIComponent(buildWhatsAppMessage(selection));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
};

const updateOrderUI = () => {
  const selection = getSelectedFlavors();
  const { total } = selection;
  const ready = total > 0;

  flavorInputs.forEach((input) => {
    input.closest(".flavor")?.classList.toggle("is-selected", input.checked);
  });

  if (orderCount) {
    orderCount.textContent =
      total === 0
        ? "Nenhum sabor selecionado"
        : total === 1
          ? "1 sabor selecionado"
          : `${total} sabores selecionados`;
  }

  if (orderHint) {
    orderHint.textContent = ready
      ? "Pronto! Envie o pedido pelo WhatsApp."
      : "Selecione ao menos um sabor para continuar.";
  }

  if (orderBar) orderBar.classList.toggle("is-ready", ready);
  if (orderClear) orderClear.disabled = !ready;
  if (orderSubmit) orderSubmit.disabled = !ready;

  whatsappLinks.forEach((link) => {
    link.href = buildWhatsAppUrl(selection);
  });

  return selection;
};

const openWhatsAppOrder = (event) => {
  const selection = updateOrderUI();
  if (!selection.total) {
    event.preventDefault();
    orderForm?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const url = buildWhatsAppUrl(selection);

  if (event.currentTarget instanceof HTMLAnchorElement) {
    event.currentTarget.href = url;
    return;
  }

  event.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
};

if (orderForm) {
  flavorInputs.forEach((input) => {
    input.addEventListener("change", updateOrderUI);
  });

  orderClear?.addEventListener("click", () => {
    flavorInputs.forEach((input) => {
      input.checked = false;
    });
    updateOrderUI();
  });

  orderForm.addEventListener("submit", openWhatsAppOrder);
}

whatsappLinks.forEach((link) => {
  link.addEventListener("click", openWhatsAppOrder);
});

updateOrderUI();
