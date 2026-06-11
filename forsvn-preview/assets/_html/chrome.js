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
          navigator.clipboard.writeText(text).then(
            function () { flash(btn, "copied"); },
            function () { flash(btn, "copy failed"); }
          );
        } else {
          var ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          var ok = false;
          try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
          document.body.removeChild(ta);
          flash(btn, ok ? "copied" : "copy failed"); // fail loudly, not silently
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
    document.body.setAttribute("data-capture", "active");

    var status = form.querySelector(".decision-status");
    var doneBtn = form.querySelector(".decision-done");
    var outcome = form.querySelector(".decision-outcome");
    var alertBox = form.querySelector(".decision-alert");

    var STATE_GLYPH = { approved: "✓", denied: "✗", suggested: "~" };

    // Done is discoverable-but-inert until a radio is picked: aria-disabled
    // (not `disabled` — that drops it from some AT traversal) + the
    // describedby "pick a decision first" hint carries the why.
    form.querySelectorAll('input[name="decision"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (doneBtn) doneBtn.setAttribute("aria-disabled", "false");
      });
    });

    // Error states render in-bar with recovery copy, role="alert", focused
    // programmatically, and never auto-dismissed.
    function showAlert(reason, recovery) {
      if (!alertBox) return;
      alertBox.textContent = "";
      var r1 = document.createElement("strong");
      r1.textContent = reason;
      var r2 = document.createElement("span");
      r2.textContent = recovery;
      alertBox.appendChild(r1);
      alertBox.appendChild(r2);
      alertBox.hidden = false;
      alertBox.focus();
      if (status) status.textContent = "";
      if (doneBtn) doneBtn.disabled = false;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (doneBtn && doneBtn.getAttribute("aria-disabled") === "true") return; // no POST before a pick
      var picked = form.querySelector('input[name="decision"]:checked');
      if (!picked) return; // structural guard; the server still enum-validates
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

      if (doneBtn) doneBtn.disabled = true; // request-duration only — no spinner
      if (alertBox) alertBox.hidden = true;
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
          // Swap the bar content to the confirmation block (role="status"),
          // then move focus to it (spec §7).
          var pill = document.querySelector(".decision-pill");
          if (pill) {
            pill.setAttribute("data-state", payload.decision_state);
            pill.textContent = payload.decision_state;
          }
          [".decision-radio", ".decision-comments", ".decision-actions"].forEach(function (sel) {
            var el = form.querySelector(sel);
            if (el) el.hidden = true;
          });
          if (outcome) {
            outcome.textContent = "decision recorded · server exiting";
            var stateLine = document.createElement("span");
            stateLine.className = "state-line";
            stateLine.textContent = (STATE_GLYPH[payload.decision_state] || "") + " " + payload.decision_state + " · written to frontmatter";
            outcome.appendChild(stateLine);
            outcome.setAttribute("data-state", payload.decision_state);
            outcome.hidden = false;
            outcome.focus();
          }
        } else if (resp.status === 403) {
          showAlert(
            "bad token — this form isn't the one the CLI served",
            "return to the terminal and re-serve"
          );
        } else {
          resp.json().then(function (j) {
            var msg = (j && j.error) ? String(j.error) : ("server refused (" + resp.status + ")");
            if (/changed on disk/.test(msg)) {
              showAlert(
                "file changed on disk since this form was rendered",
                "nothing was written — re-serve to review the current file"
              );
            } else {
              showAlert("server refused: " + msg.slice(0, 120), "return to the terminal and re-serve");
            }
          }).catch(function () {
            showAlert("server refused (" + resp.status + ")", "return to the terminal and re-serve");
          });
        }
      }).catch(function () {
        showAlert(
          "network error — is the CLI still running?",
          "re-run forsvn-preview <path> to get a fresh form"
        );
      });
    });

    // Keyboard model: ⌥A approve · ⌥D deny · ⌥S suggest (matched on physical
    // e.code, since macOS ⌥ remaps e.key to a glyph); ⌘↵ / Ctrl+↵ submits.
    // ⌥-decisions are suppressed while the comment textarea has focus so typing
    // a note isn't hijacked. Recorded UX choices: comments stay optional for all
    // three decisions, and Deny has no confirm modal — an accidental deny in this
    // single-operator local context is recoverable via git.
    document.addEventListener("keydown", function (e) {
      if (form.getAttribute("data-active") !== "true") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        // Same in-flight guard as the pointer path: a disabled Done button
        // means a POST is underway — don't fire a duplicate submit.
        if (doneBtn && doneBtn.disabled) return;
        if (form.requestSubmit) form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true }));
        return;
      }
      var inTextarea = document.activeElement && document.activeElement.tagName === "TEXTAREA";
      if (inTextarea) return;
      if (e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        var decision = { KeyA: "approved", KeyD: "denied", KeyS: "suggested" }[e.code];
        if (decision) {
          e.preventDefault();
          var radio = form.querySelector('input[name="decision"][value="' + decision + '"]');
          if (radio) { radio.checked = true; radio.focus(); }
        }
      }
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
