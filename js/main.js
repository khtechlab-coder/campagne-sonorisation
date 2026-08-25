/* =========================================================
   CONFIGURATION — à ajuster facilement
   ========================================================= */
const CONFIG = {
  churchName: "Église Évangélique des Assemblées du Bénin, Temple Antioche d'Agla Centre",
  eventDateISO: "2026-08-30T09:00:00+01:00", // dimanche 30 août 2026, 9h00 (heure du Bénin, UTC+1)
  goalAmount: "3 500 000 FCFA",
  shareMessage:
    "Notre église (Temple Antioche d'Agla Centre) organise une grande collecte pour renouveler sa sonorisation. Objectif : 3 500 000 FCFA. Rendez-vous le dimanche 30 août 2026 à 9h00. Découvrez la campagne et comment contribuer.",
  notifyMessage:
    "Bonjour, je viens de contribuer à la grande collecte du Temple Antioche d'Agla Centre pour le renouvellement de la sonorisation. Je vous informe volontairement de ma participation.",
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Barre de progression : laisser à `null` tant qu'aucune donnée réelle
   n'est disponible. Pour l'activer plus tard, renseigner un objet
   { raised: <montant en FCFA>, goal: 3500000 } — la barre se met à
   jour automatiquement, sans autre modification de code. */
const CAMPAIGN_RAISED = null; // ex: { raised: 1250000, goal: 3500000 }

function currentPageUrl() {
  return window.location.href.split("#")[0];
}

/* =========================================================
   ANALYTICS — petite couche d'abstraction
   Aucune donnée personnelle n'est collectée ici (pas d'email,
   pas de numéro de téléphone, pas de profil individuel).
   Voir README.md pour brancher un fournisseur réel
   (Cloudflare Web Analytics, Plausible, etc.)
   ========================================================= */
window.campaignEvents = window.campaignEvents || [];

function trackEvent(name, params = {}) {
  const payload = { event: name, ts: new Date().toISOString(), ...params };
  window.campaignEvents.push(payload);

  // Point d'intégration unique : brancher ici un fournisseur d'analytics
  // personnalisé si besoin (ex: window.plausible, gtag, etc.). Aucune clé
  // secrète ne doit jamais être placée dans ce fichier.
  if (typeof window.plausible === "function") {
    window.plausible(name, { props: params });
  }
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  if (window.location.search.includes("debug_analytics")) {
    console.log("[analytics]", payload);
  }
}

function initAutoTracking() {
  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      trackEvent(el.getAttribute("data-track"), {
        location: el.getAttribute("data-track-loc") || null,
      });
    });
  });
}

function trackPageview() {
  const params = new URLSearchParams(window.location.search);
  trackEvent("page_view", {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    path: window.location.pathname,
  });
}

/* =========================================================
   LOGO — masquer proprement le bloc si le fichier est absent
   ========================================================= */
function initLogoFallback() {
  const logo = document.getElementById("church-logo");
  if (!logo) return;
  logo.addEventListener("error", () => {
    const wrap = logo.closest(".hero__identity");
    if (wrap) wrap.classList.add("logo-missing");
  });
}

/* =========================================================
   COMPTE À REBOURS
   ========================================================= */
function initCountdown() {
  const target = new Date(CONFIG.eventDateISO).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    min: document.getElementById("cd-min"),
    sec: document.getElementById("cd-sec"),
  };
  const wrapper = document.getElementById("countdown");
  if (!els.days || isNaN(target)) return;

  function render(d, h, m, s) {
    els.days.textContent = String(d);
    els.hours.textContent = String(h).padStart(2, "0");
    els.min.textContent = String(m).padStart(2, "0");
    els.sec.textContent = String(s).padStart(2, "0");
  }

  function tick() {
    const diff = target - Date.now();

    if (diff <= 0) {
      wrapper.innerHTML = "";
      const p = document.createElement("p");
      p.className = "countdown__ended";
      p.textContent = "Le jour est arrivé, merci d'être présent(e) !";
      wrapper.appendChild(p);
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    render(d, h, m, s);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* =========================================================
   COPIER LES NUMÉROS MOBILE MONEY
   ========================================================= */
function initCopyButtons() {
  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const number = btn.getAttribute("data-number");
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(number);
        } else {
          const tmp = document.createElement("textarea");
          tmp.value = number;
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
        }
        announceCopy(btn);
      } catch (err) {
        announceToast("Impossible de copier automatiquement le numéro " + number + ".");
      }
    });
  });
}

function announceCopy(btn) {
  btn.classList.add("is-copied");
  announceToast("Numéro copié.");
  setTimeout(() => btn.classList.remove("is-copied"), 2200);
}

function announceToast(message) {
  const toast = document.getElementById("toast");
  if (toast) toast.textContent = message; // textContent uniquement, jamais innerHTML
}

/* =========================================================
   PARTAGE
   ========================================================= */
function buildShareText() {
  return `${CONFIG.shareMessage} ${currentPageUrl()}`;
}

function shareOnWhatsApp() {
  const text = encodeURIComponent(buildShareText());
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const url = isMobile
    ? `whatsapp://send?text=${text}`
    : `https://web.whatsapp.com/send?text=${text}`;
  window.open(url, "_blank", "noopener");
}

function shareOnFacebook() {
  const url = encodeURIComponent(currentPageUrl());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,width=600,height=520");
}

function shareOnX() {
  const text = encodeURIComponent(CONFIG.shareMessage);
  const url = encodeURIComponent(currentPageUrl());
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank", "noopener,width=600,height=520");
}

async function copyLink() {
  const url = currentPageUrl();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
    } else {
      const tmp = document.createElement("textarea");
      tmp.value = url;
      tmp.style.position = "fixed";
      tmp.style.opacity = "0";
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      document.body.removeChild(tmp);
    }
    announceToast("Lien copié.");
  } catch (err) {
    announceToast("Impossible de copier le lien automatiquement.");
  }
}

function initShareButtons() {
  const whatsappBtn = document.getElementById("btn-share-whatsapp");
  const facebookBtn = document.getElementById("btn-share-facebook");
  const xBtn = document.getElementById("btn-share-x");
  const copyLinkBtn = document.getElementById("btn-copy-link");

  if (whatsappBtn) whatsappBtn.addEventListener("click", shareOnWhatsApp);
  if (facebookBtn) facebookBtn.addEventListener("click", shareOnFacebook);
  if (xBtn) xBtn.addEventListener("click", shareOnX);
  if (copyLinkBtn) copyLinkBtn.addEventListener("click", copyLink);
}

/* =========================================================
   "J'AI CONTRIBUÉ" — notification volontaire via WhatsApp
   ========================================================= */
function initNotifyButton() {
  const btn = document.getElementById("btn-jai-contribue");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const text = encodeURIComponent(CONFIG.notifyMessage);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = isMobile ? `whatsapp://send?text=${text}` : `https://web.whatsapp.com/send?text=${text}`;
    window.open(url, "_blank", "noopener");
  });
}

/* =========================================================
   AJOUTER AU CALENDRIER (fichier .ics)
   ========================================================= */
function downloadICS() {
  const start = new Date(CONFIG.eventDateISO);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3h par défaut

  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Temple Antioche d'Agla Centre//Grande Collecte//FR",
    "BEGIN:VEVENT",
    `UID:grande-collecte-${start.getTime()}@antioche-agla`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    "SUMMARY:Grande collecte pour la sonorisation",
    "DESCRIPTION:Grande collecte de fonds pour le renouvellement des équipements de sonorisation du Temple Antioche d'Agla Centre. Objectif : 3 500 000 FCFA.",
    "LOCATION:Temple Antioche d'Agla Centre",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "grande-collecte-30-aout-2026.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function initCalendarButton() {
  const btn = document.getElementById("btn-add-calendar");
  if (btn) btn.addEventListener("click", downloadICS);
}

/* =========================================================
   MODAL ÉQUIPEMENTS — ouverture par catégorie
   ========================================================= */
function initEquipmentModal() {
  const modal = document.getElementById("equipment-modal");
  const closeBtn = document.getElementById("btn-close-equipment");
  const cards = document.querySelectorAll(".category-card[data-category]");
  if (!modal || cards.length === 0) return;

  let lastFocused = null;

  function openFor(category) {
    lastFocused = document.activeElement;

    modal.querySelectorAll(".equip-group").forEach((group) => {
      group.open = group.getAttribute("data-group") === category;
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);

    const targetGroup = modal.querySelector(`.equip-group[data-group="${category}"]`);
    if (targetGroup) targetGroup.scrollIntoView({ block: "nearest" });
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openFor(card.getAttribute("data-category")));
  });
  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

/* =========================================================
   BARRE DE PROGRESSION (désactivée tant que CAMPAIGN_RAISED est null)
   ========================================================= */
function initProgress() {
  if (!CAMPAIGN_RAISED) return;
  const block = document.getElementById("progress-block");
  const fill = document.getElementById("progress-fill");
  const label = document.getElementById("progress-label");
  if (!block) return;

  const pct = Math.min(100, Math.round((CAMPAIGN_RAISED.raised / CAMPAIGN_RAISED.goal) * 100));
  fill.style.width = pct + "%";
  label.textContent = `${CAMPAIGN_RAISED.raised.toLocaleString("fr-FR")} FCFA collectés sur ${CAMPAIGN_RAISED.goal.toLocaleString("fr-FR")} FCFA (${pct} %)`;
  block.hidden = false;
}

/* =========================================================
   STICKY CTA — masqué quand la section "Contribuer" est visible
   ========================================================= */
function initStickyCta() {
  const sticky = document.getElementById("sticky-cta");
  const target = document.getElementById("contribuer");
  if (!sticky || !target || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sticky.classList.toggle("is-hidden", entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );
  observer.observe(target);
}

/* =========================================================
   RÉVÉLATION AU SCROLL
   ========================================================= */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* =========================================================
   SON D'AMBIANCE — désactivé par défaut, affiché uniquement
   si le fichier audio se charge correctement. Aucune lecture
   automatique n'est jamais déclenchée.
   ========================================================= */
function initAmbianceSound() {
  const audio = document.getElementById("ambiance-audio");
  const toggle = document.getElementById("sound-toggle");
  if (!audio || !toggle) return;

  let confirmed = false;

  audio.addEventListener(
    "canplaythrough",
    () => {
      if (confirmed) return;
      confirmed = true;
      toggle.hidden = false;
    },
    { once: true }
  );

  audio.addEventListener("error", () => {
    toggle.hidden = true;
  });

  // Tente le chargement des métadonnées sans jouer le son
  audio.load();

  toggle.addEventListener("click", () => {
    const isPlaying = toggle.getAttribute("aria-pressed") === "true";
    if (isPlaying) {
      audio.pause();
      toggle.setAttribute("aria-pressed", "false");
    } else {
      audio.play().catch(() => {});
      toggle.setAttribute("aria-pressed", "true");
    }
  });
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  trackPageview();
  initAutoTracking();
  initLogoFallback();
  initCountdown();
  initCopyButtons();
  initShareButtons();
  initNotifyButton();
  initCalendarButton();
  initEquipmentModal();
  initProgress();
  initStickyCta();
  initScrollReveal();
  initAmbianceSound();
});
