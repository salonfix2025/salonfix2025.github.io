// SALONFIX: normalize phone + WhatsApp links site-wide + track intent/source
(function () {
  const RAW = "9629370666";              // local digits
  const E164 = "919629370666";           // country code + local
  const INTL = "+91 96293 70666";        // display format

  // Standard messages by intent
  const TEXTS = {
    trial: "DM FIX — Start my FREE 1-Month Trial.",
    plan: "DM FIX — Help me choose the right plan.",
    flow: "DM FIX — Show me how SALONFIX works.",
    contact: "DM FIX — I’d like to speak to SALONFIX.",
    default: "DM FIX — Start my FREE 1-Month Trial."
  };

  // Build the final WA text with optional source/context
  function composeText(anchor) {
    const intent = (anchor.getAttribute("data-sf-intent") || "default").toLowerCase();
    const ctx = anchor.getAttribute("data-sf-source") || deriveSource(anchor);
    const base = TEXTS[intent] || TEXTS.default;
    // Add lightweight source stamp so you can tell which CTA/page generated the lead
    return `${base} | Source: ${ctx}`;
  }

  function deriveSource(anchor) {
    // Prefer a readable label if present; else use document.title or path
    const label = anchor.textContent.trim().replace(/\s+/g, " ").slice(0, 60);
    const page = document.title || location.pathname;
    return `${page} → ${label || "CTA"}`;
  }

  function fixWhatsAppLinks() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(a => {
      try {
        const u = new URL(a.href, location.origin);
        u.hostname = "wa.me";
        u.pathname = "/" + E164;

        // Respect existing ?text, otherwise inject our composed message
        if (!u.searchParams.get("text")) {
          u.searchParams.set("text", composeText(a));
        }

        a.href = u.toString();
        a.target = "_blank";
        a.rel = "noopener";
      } catch (_) {}
    });
  }

  function fixTelLinks() {
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.href = "tel:+91" + RAW;
      if (/\d{5}\s?\d{5}/.test(a.textContent.trim())) a.textContent = INTL;
    });
  }

  function fillTextSpots() {
    document.querySelectorAll("[data-sf-phone]").forEach(el => { el.textContent = INTL; });
  }

  function init(){ fixWhatsAppLinks(); fixTelLinks(); fillTextSpots(); }
  (document.readyState === "loading")
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
