// SALONFIX: normalize phone + WhatsApp links site-wide
(function () {
  const RAW = "9629370666";             // local digits
  const E164 = "919629370666";          // country code + local
  const INTL = "+91 96293 70666";       // display format
  const DEFAULT_TEXT = "DM FIX — Start my FREE 1-Month Trial.";

  function fixWhatsAppLinks() {
    document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(a => {
      try {
        const u = new URL(a.href, location.origin);
        u.hostname = "wa.me";
        u.pathname = "/" + E164;
        if (!u.searchParams.get("text")) u.searchParams.set("text", DEFAULT_TEXT);
        a.href = u.toString();
        a.target = "_blank";
        a.rel = "noopener";
      } catch (_) {}
    });
  }

  function fixTelLinks() {
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.href = "tel:+91" + RAW;
      // If link text looks like a phone number, replace it with our display format
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
