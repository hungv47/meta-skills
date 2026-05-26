// chrome.js — minimal client-side behaviors for the review-surface chrome.
// v2 (2026-05-26): adds decision-capture controller that posts the operator's
// decision to the `forsvn preview` CLI on 127.0.0.1 / localhost. When no CLI
// is running (preview-config has {static:true}), the form stays inert.

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
          var detail = item.getAttribute("data-picker-value");
          group.dispatchEvent(new CustomEvent("picker:change", { detail: detail, bubbles: true }));
        });
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Open-in-Roughdraft deeplink. Escape hatch — works whether or not the
  // `forsvn preview` CLI is running.
  // ---------------------------------------------------------------------------
  function attachRoughdraftLink() {
    document.querySelectorAll("[data-roughdraft-link]").forEach(function (a) {
      a.addEventListener("click", function () { flash(a, "opening…"); });
    });
  }

  // ---------------------------------------------------------------------------
  // Decision capture. Reads #preview-config + #artifact-data. When the CLI is
  // running (config has token + endpoint) AND the artifact is pending, the
  // form is activated and POSTs JSON to /done on submit. Any other case keeps
  // the form display:none — chrome stays read-only.
  // ---------------------------------------------------------------------------
  function attachDecisionCapture() {
    var form = document.getElementById("decision-capture");
    if (!form) return;

    var config = readJsonScript("preview-config") || {};
    var artifact = readJsonScript("artifact-data") || {};
    var state = artifact.decision_state;
    var hasCli = !config.static && typeof config.token === "string" && typeof config.endpoint === "string";

    if (!hasCli || state !== "pending") {
      // Stay inert — the surface is static, or the decision is already settled.
      return;
    }

    // Defense in depth: the endpoint MUST be the localhost contract documented
    // in references/review-surface-design.md § 3. If a malicious skill (or
    // tampered preview-config) names a remote target, refuse to activate so
    // the reviewer's comments never leave the local machine.
    if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/done$/.test(config.endpoint)) {
      console.warn("[forsvn] preview-config.endpoint is not a localhost /done URL; decision-capture stays inert", config.endpoint);
      return;
    }

    form.setAttribute("data-active", "true");

    var status = form.querySelector(".decision-status");
    var doneBtn = form.querySelector(".decision-done");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var picked = form.querySelector('input[name="decision"]:checked');
      if (!picked) {
        if (status) {
          status.textContent = "pick a decision";
          status.setAttribute("data-tone", "error");
        }
        return;
      }
      var payload = {
        token: config.token,
        decision_state: picked.value,
      };
      var ta = form.querySelector('textarea[name="comments"]');
      if (ta && ta.value.trim().length > 0) payload.comments = ta.value.trim();
      var variantPicker = document.querySelector('[data-picker-group] .picker-item[aria-selected="true"]');
      if (variantPicker) {
        var v = variantPicker.getAttribute("data-picker-value");
        if (v) payload.variant = v;
      }

      if (doneBtn) doneBtn.disabled = true;
      if (status) {
        status.textContent = "submitting…";
        status.removeAttribute("data-tone");
      }

      // Local-only postback to the `forsvn preview` CLI's /done endpoint —
      // documented contract per references/review-surface-design.md § 3.
      fetch(config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(function (resp) {
        if (resp.ok) {
          if (status) {
            status.textContent = "decision recorded · server exiting…";
            status.setAttribute("data-tone", "ok");
          }
          var pill = document.querySelector(".decision-pill");
          if (pill) {
            pill.setAttribute("data-state", payload.decision_state);
            pill.textContent = payload.decision_state;
          }
          form.setAttribute("data-active", "false");
        } else {
          resp.text().then(function (t) {
            if (status) {
              status.textContent = "server rejected: " + t.slice(0, 80);
              status.setAttribute("data-tone", "error");
            }
            if (doneBtn) doneBtn.disabled = false;
          });
        }
      }).catch(function () {
        if (status) {
          status.textContent = "network error — is the CLI still running?";
          status.setAttribute("data-tone", "error");
        }
        if (doneBtn) doneBtn.disabled = false;
      });
    });
  }

  function readJsonScript(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent || "null"); }
    catch (_) { return null; }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      attachCopy(); attachPickers(); attachRoughdraftLink(); attachDecisionCapture();
    });
  } else {
    attachCopy(); attachPickers(); attachRoughdraftLink(); attachDecisionCapture();
  }
})();
