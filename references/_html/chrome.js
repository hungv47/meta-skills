// chrome.js — minimal client-side behaviors for the review-surface chrome.
// No frameworks, no state mutation that isn't UI-only. The HTML preview is
// read-only; the only outbound action is the Roughdraft deeplink.

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Copy-to-clipboard for the "Copy frontmatter" / "Copy as JSON" actions.
  // ---------------------------------------------------------------------------
  function attachCopy() {
    document.querySelectorAll("[data-copy-source]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var sel = btn.getAttribute("data-copy-source");
        var src = document.getElementById(sel);
        if (!src) return;
        var text = src.textContent || "";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { flash(btn, "copied"); });
        } else {
          // Fallback for environments without clipboard API.
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (_) {}
          document.body.removeChild(ta);
          flash(btn, "copied");
        }
      });
    });
  }

  function flash(el, label) {
    var original = el.textContent;
    el.textContent = label;
    setTimeout(function () { el.textContent = original; }, 1100);
  }

  // ---------------------------------------------------------------------------
  // Variant picker — exclusive selection within a group. UI-only; no postback.
  // ---------------------------------------------------------------------------
  function attachPickers() {
    document.querySelectorAll("[data-picker-group]").forEach(function (group) {
      var items = group.querySelectorAll(".picker-item");
      items.forEach(function (item) {
        item.addEventListener("click", function () {
          items.forEach(function (i) { i.setAttribute("aria-selected", "false"); });
          item.setAttribute("aria-selected", "true");
          // Dispatch a CustomEvent so per-skill stage code can react.
          var detail = item.getAttribute("data-picker-value");
          group.dispatchEvent(new CustomEvent("picker:change", { detail: detail, bubbles: true }));
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Open-in-Roughdraft deeplink. The link is already in the markup; this just
  // gives a small confirmation flash so the operator knows the click landed.
  // ---------------------------------------------------------------------------
  function attachRoughdraftLink() {
    document.querySelectorAll("[data-roughdraft-link]").forEach(function (a) {
      a.addEventListener("click", function () {
        flash(a, "opening…");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { attachCopy(); attachPickers(); attachRoughdraftLink(); });
  } else {
    attachCopy(); attachPickers(); attachRoughdraftLink();
  }
})();
