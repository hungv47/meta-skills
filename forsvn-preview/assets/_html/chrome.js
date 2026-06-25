// chrome.js — client-side behaviors for the review-surface chrome.
// v4 (2026-06-12, U9 design pass · revision 2):
//   - adaptive theme controller (system default; explicit choice persisted)
//   - decision capture posting to the preview CLI on 127.0.0.1 (unchanged
//     security model: token + localhost-only endpoint guard)
//   - the collaboration workbench: Marker (M) / Comment (C) / Edit (E) +
//     the informational "read as" menu. Marks + comments ride back to the
//     agents inside the decision POST as the additive `annotations` array;
//     Edit saves the Markdown body through the CSRF-protected POST /edit.
//   - agent suggestion cards rendered from preview-config.suggestions
//     (the Proof-collab integration seam — empty today). Agents suggest;
//     accepting or dismissing is the human's alone.
// When no CLI is running (preview-config has {static:true}), everything but
// the theme control stays inert.

(function () {
  "use strict";

  function readJsonScript(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    try { return JSON.parse(el.textContent || "null"); }
    catch (_) { return null; }
  }

  var config = readJsonScript("preview-config") || {};
  var artifact = readJsonScript("artifact-data") || {};

  // ---------------------------------------------------------------------------
  // Theme — follows prefers-color-scheme by default (no attribute); an explicit
  // operator choice sets data-theme and persists in localStorage. The boot
  // script in <head> applied the stored choice before first paint; this wires
  // the strip segment. Works on static pages too.
  // ---------------------------------------------------------------------------
  var THEME_KEY = "forsvn-theme";

  function applyTheme(mode) {
    var root = document.documentElement;
    if (mode === "dark" || mode === "light") root.setAttribute("data-theme", mode);
    else root.removeAttribute("data-theme");
    var btns = document.querySelectorAll(".theme-seg button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-set") === mode));
    }
  }

  function storedTheme() {
    var v = null;
    try { v = localStorage.getItem(THEME_KEY); } catch (e) {}
    return (v === "dark" || v === "light") ? v : "system";
  }

  function attachTheme() {
    applyTheme(storedTheme());
    document.addEventListener("click", function (e) {
      var b = e.target && e.target.closest ? e.target.closest(".theme-seg button") : null;
      if (!b) return;
      var mode = b.getAttribute("data-set");
      try {
        if (mode === "system") localStorage.removeItem(THEME_KEY);
        else localStorage.setItem(THEME_KEY, mode);
      } catch (err) {}
      applyTheme(mode);
    });
  }

  // ---------------------------------------------------------------------------
  // Chrome strip extras: the pending count in the crumb (data seam:
  // preview-config.pending_count) — never a path, never a filename.
  // ---------------------------------------------------------------------------
  function attachCrumb() {
    var slot = document.querySelector("[data-pending-count]");
    if (!slot) return;
    if (typeof config.pending_count === "number" && config.pending_count > 0) {
      slot.textContent = " · " + config.pending_count + " pending";
    }
  }

  // ---------------------------------------------------------------------------
  // G1 gate-warning notice — amber, ambient, warn-and-proceed. Data seam:
  // preview-config.gate_warning (string | null). Renders above the masthead;
  // the ledger below still captures the decision.
  // ---------------------------------------------------------------------------
  function attachGateNotice() {
    if (!config.gate_warning) return;
    var article = document.querySelector(".sheet article");
    if (!article) return;
    var notice = document.createElement("div");
    notice.className = "notice";
    var glyph = document.createElement("span");
    glyph.className = "glyph";
    glyph.textContent = "⚠";
    var body = document.createElement("span");
    var main = document.createElement("span");
    main.textContent = "No Review Gate section found in this artifact — the preview renders without the gate echo.";
    var fix = document.createElement("span");
    fix.className = "fix";
    fix.textContent = "The decision ledger below still captures your decision. Add the gate section per the artifact contract to restore the in-body mirror.";
    body.appendChild(main);
    body.appendChild(fix);
    notice.appendChild(glyph);
    notice.appendChild(body);
    article.insertBefore(notice, article.firstChild);
  }

  // ---------------------------------------------------------------------------
  // Helpers shared by the live-capture features.
  // ---------------------------------------------------------------------------
  // Defense in depth: every postback target MUST be the documented localhost
  // contract. A tampered preview-config naming a remote target deactivates
  // capture so nothing the reviewer writes leaves the local machine.
  var LOCAL_DONE_RE = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/done$/;

  function flash(el, label) {
    var original = el.textContent;
    el.textContent = label;
    setTimeout(function () { el.textContent = original; }, 1100);
  }

  // ---------------------------------------------------------------------------
  // The live review instrument: workbench + suggestions + decision capture.
  // Activates only when the CLI injected a token AND the artifact is pending.
  // ---------------------------------------------------------------------------
  function attachLiveCapture() {
    var form = document.getElementById("decision-capture");
    if (!form) return;

    var state = artifact.decision_state;
    var hasCli = !config.static && typeof config.token === "string" && typeof config.endpoint === "string";
    if (!hasCli || state !== "pending") {
      // Stay inert — the surface is static, or the decision is already settled.
      return;
    }

    var doneEndpoint = LOCAL_DONE_RE.test(config.endpoint) ? config.endpoint : null;
    if (!doneEndpoint) {
      console.warn("[forsvn] preview-config.endpoint is not a localhost /done URL; decision-capture stays inert", config.endpoint);
      return;
    }
    // /edit and /dismiss share the origin with /done — derived, never configured
    // separately, so they can't be pointed elsewhere.
    var editEndpoint = doneEndpoint.replace(/\/done$/, "/edit");
    var dismissEndpoint = doneEndpoint.replace(/\/done$/, "/dismiss");

    form.setAttribute("data-active", "true");
    document.body.setAttribute("data-capture", "active");

    var status = form.querySelector(".decision-status");
    var doneBtn = form.querySelector(".decision-done");
    var outcome = form.querySelector(".decision-outcome");
    var alertBox = form.querySelector(".decision-alert");

    var STATE_GLYPH = { approved: "✓", denied: "✕", suggested: "~" };

    // ----- annotations (Marker + Comment) -----------------------------------
    // Each entry: { kind: "marker"|"comment", quote, body? }. They ride the
    // decision POST additively and persist into the artifact's review record —
    // that's the "ride back to the agents" promise.
    var annotations = [];
    var commentThreads = []; // { quote, textarea, chip, sent }

    var workbench = document.querySelector(".workbench");
    var sheet = document.getElementById("sheet");
    var article = document.querySelector(".sheet article");
    var rail = document.querySelector(".thread-rail");
    var tools = workbench ? workbench.querySelectorAll(".tool") : [];
    var activeTool = "read";

    function setTool(name) {
      activeTool = name;
      for (var i = 0; i < tools.length; i++) {
        tools[i].setAttribute("aria-pressed", String(tools[i].getAttribute("data-tool") === name));
      }
      if (name === "edit") enterEdit();
      else if (editState.active) exitEdit(false);
      updateWbNote();
    }

    function updateWbNote() {
      var note = workbench ? workbench.querySelector("[data-wb-note]") : null;
      if (!note) return;
      var markers = annotations.filter(function (a) { return a.kind === "marker"; }).length;
      var comments = annotations.filter(function (a) { return a.kind === "comment"; }).length;
      if (editState.active) note.textContent = "editing — changes write to the artifact file when you save";
      else if (markers + comments > 0) note.textContent = markers + " highlight" + (markers === 1 ? "" : "s") + " · " + comments + " comment" + (comments === 1 ? "" : "s") + " — they ride back with your decision";
      else note.textContent = "marks + comments ride back to the agents";
    }

    function wrapSelection(noted) {
      var sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
      var range = sel.getRangeAt(0);
      if (!article || !article.contains(range.commonAncestorContainer)) return null;
      var quote = sel.toString().replace(/\s+/g, " ").trim();
      if (!quote) return null;
      var mark = document.createElement("mark");
      mark.className = noted ? "hl noted" : "hl";
      try {
        range.surroundContents(mark);
      } catch (_) {
        // Cross-element selection — fall back to extract+wrap (may normalize
        // inline structure, never loses text).
        try {
          mark.appendChild(range.extractContents());
          range.insertNode(mark);
        } catch (_2) { return null; }
      }
      sel.removeAllRanges();
      return { mark: mark, quote: quote };
    }

    function onProseMouseUp() {
      if (activeTool === "marker") {
        var hl = wrapSelection(false);
        if (!hl) return;
        annotations.push({ kind: "marker", quote: hl.quote });
        updateWbNote();
      } else if (activeTool === "comment") {
        var noted = wrapSelection(true);
        if (!noted) return;
        openThread(noted);
      }
    }

    function openThread(noted) {
      if (!rail || !sheet) return;
      var chip = document.createElement("span");
      chip.className = "notechip";
      chip.textContent = String(commentThreads.length + 1);
      chip.setAttribute("aria-label", "comment on this passage");
      noted.mark.insertAdjacentElement("afterend", chip);

      var thread = document.createElement("div");
      thread.className = "thread";
      var who = document.createElement("div");
      who.className = "who";
      var youB = document.createElement("b");
      youB.textContent = "you";
      who.appendChild(youB);
      var quote = document.createElement("div");
      quote.className = "quote";
      quote.textContent = "“" + noted.quote.slice(0, 140) + (noted.quote.length > 140 ? "…" : "") + "”";
      var ta = document.createElement("textarea");
      ta.setAttribute("aria-label", "Comment on the highlighted passage");
      ta.placeholder = "Comment — the agents read this with your decision";
      var actions = document.createElement("div");
      actions.className = "actions";
      var send = document.createElement("button");
      send.type = "button";
      send.className = "btn-quiet btn-accept";
      send.textContent = "Queue comment";
      var drop = document.createElement("button");
      drop.type = "button";
      drop.className = "btn-quiet";
      drop.textContent = "Remove";
      actions.appendChild(send);
      actions.appendChild(drop);
      thread.appendChild(who);
      thread.appendChild(quote);
      thread.appendChild(ta);
      thread.appendChild(actions);
      rail.appendChild(thread);
      rail.hidden = false;
      sheet.classList.add("sheet-collab");

      var record = { quote: noted.quote, mark: noted.mark, chip: chip, annotation: null };
      commentThreads.push(record);

      send.addEventListener("click", function () {
        var body = ta.value.trim();
        if (!body) { flash(send, "write the comment first"); return; }
        if (record.annotation) {
          record.annotation.body = body;
        } else {
          record.annotation = { kind: "comment", quote: record.quote, body: body };
          annotations.push(record.annotation);
        }
        flash(send, "queued — rides with your decision");
        updateWbNote();
      });
      drop.addEventListener("click", function () {
        if (record.annotation) {
          var idx = annotations.indexOf(record.annotation);
          if (idx > -1) annotations.splice(idx, 1);
        }
        thread.remove();
        record.chip.remove();
        var m = record.mark;
        if (m && m.parentNode) {
          while (m.firstChild) m.parentNode.insertBefore(m.firstChild, m);
          m.remove();
        }
        var live = rail.querySelectorAll(".thread");
        if (live.length === 0) { rail.hidden = true; sheet.classList.remove("sheet-collab"); }
        updateWbNote();
      });
      ta.focus();
    }

    // ----- Edit mode (the column becomes the editor) -------------------------
    // Edits the MARKDOWN source body (never an HTML round-trip). Save posts to
    // the CSRF-protected /edit endpoint; the server re-checks the on-disk hash
    // (409 on conflict, nothing written) and re-renders the twin. Human-only by
    // construction: localhost + token, exactly like decisions.
    var editState = { active: false, field: null, hiddenNodes: [] };

    function enterEdit() {
      if (editState.active) return;
      var src = "/" + String(config.mdPath || "").replace(/^\/+/, "");
      fetch(src, { headers: { "Accept": "text/plain" } }).then(function (r) {
        if (!r.ok) throw new Error("source unavailable (" + r.status + ")");
        return r.text();
      }).then(function (text) {
        var m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
        var body = m ? text.slice(m[0].length) : text;
        editState.active = true;
        document.body.setAttribute("data-mode", "edit");
        editState.hiddenNodes = [];
        if (article) {
          for (var i = 0; i < article.children.length; i++) {
            var ch = article.children[i];
            if (!ch.hidden) { editState.hiddenNodes.push(ch); ch.hidden = true; }
          }
        }
        var field = document.createElement("textarea");
        field.className = "editfield";
        field.spellcheck = false;
        field.setAttribute("aria-label", "Artifact body — editable Markdown");
        field.value = body;
        article.appendChild(field);
        editState.field = field;
        var saveBtn = workbench.querySelector("[data-edit-save]");
        var discardBtn = workbench.querySelector("[data-edit-discard]");
        if (saveBtn) saveBtn.hidden = false;
        if (discardBtn) discardBtn.hidden = false;
        updateWbNote();
        field.focus();
      }).catch(function (e) {
        setTool("read");
        showAlert("could not load the Markdown source — " + String(e && e.message || e), "re-serve from the terminal and try again");
      });
    }

    function exitEdit(saved) {
      if (!editState.active) return;
      editState.active = false;
      document.body.removeAttribute("data-mode");
      if (editState.field) editState.field.remove();
      editState.field = null;
      for (var i = 0; i < editState.hiddenNodes.length; i++) editState.hiddenNodes[i].hidden = false;
      editState.hiddenNodes = [];
      var saveBtn = workbench.querySelector("[data-edit-save]");
      var discardBtn = workbench.querySelector("[data-edit-discard]");
      if (saveBtn) saveBtn.hidden = true;
      if (discardBtn) discardBtn.hidden = true;
      if (!saved) updateWbNote();
    }

    function saveEdit() {
      if (!editState.active || !editState.field) return;
      var saveBtn = workbench.querySelector("[data-edit-save]");
      if (saveBtn && saveBtn.disabled) return; // in-flight guard
      if (saveBtn) saveBtn.disabled = true;
      postEdit(editState.field.value).then(function () {
        // The server re-rendered the twin from the saved Markdown; reload so
        // the reading column IS the saved document (no client-side re-render).
        location.reload();
      }).catch(function (e) {
        if (saveBtn) saveBtn.disabled = false;
        if (e && e.conflict) {
          showAlert(
            "Nothing was written. The file changed on disk after this page rendered.",
            "re-serve to read the current version: /forsvn:review — your edit stays in this box until you leave"
          );
        } else {
          showAlert("save refused: " + String(e && e.message || e).slice(0, 120), "return to the terminal and re-serve");
        }
      });
    }

    function postEdit(bodyMd) {
      return fetch(editEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: config.token, body_md: bodyMd }),
      }).then(function (resp) {
        if (resp.ok) return resp.json();
        if (resp.status === 409) { var e409 = new Error("changed on disk"); e409.conflict = true; throw e409; }
        return resp.json().then(function (j) {
          throw new Error((j && j.error) ? String(j.error) : "server refused (" + resp.status + ")");
        }, function () {
          throw new Error("server refused (" + resp.status + ")");
        });
      });
    }

    // ----- Agent suggestion cards --------------------------------------------
    // Data seam: preview-config.suggestions — populated by the S4 deterministic
    // slop mapper. Each: { author?, at?, old, new, note?, staged?, ruleId? }.
    // Rendered text, never raw diff syntax. Two variants:
    //   STAGED (staged !== false): a mechanically meaning-preserving old→new fix —
    //     shown as a del/ins diff with an Accept button. Accept applies the
    //     replacement through the same /edit write path (so the 409 conflict guard
    //     covers it). No agent can apply it — only you.
    //   NOTE-ONLY (staged === false): an advisory "consider revising" — no Accept,
    //     no diff (new === old), just the note. You revise it yourself in the text.
    // Dismiss removes the card and records the override (POST /dismiss) so a rule
    // dismissed repeatedly gets flagged for revision (FOR-56).
    function attachSuggestions() {
      var list = Array.isArray(config.suggestions) ? config.suggestions : [];
      if (list.length === 0 || !article) return;
      var masthead = article.querySelector(".masthead");
      list.forEach(function (s) {
        if (!s || typeof s.old !== "string" || typeof s.new !== "string") return;
        var staged = s.staged !== false; // default staged; note-only is opt-in
        var card = document.createElement("div");
        card.className = "suggestion";
        if (!staged) card.setAttribute("data-note-only", "true");
        var head = document.createElement("header");
        head.appendChild(document.createTextNode("agent suggestion" + (s.author ? " · " + s.author : "") + (s.at ? " · " + s.at : "")));
        var note = document.createElement("span");
        note.className = "note";
        note.textContent = staged ? "agents suggest — accepting is yours" : "advisory — revise it yourself";
        head.appendChild(note);
        var change = document.createElement("div");
        change.className = "change";
        var p = document.createElement("p");
        if (s.note) { p.appendChild(document.createTextNode(s.note + (staged ? " " : ""))); }
        if (staged) {
          var del = document.createElement("del");
          del.textContent = s.old;
          var ins = document.createElement("ins");
          ins.textContent = s.new;
          p.appendChild(del);
          p.appendChild(document.createTextNode(" "));
          p.appendChild(ins);
        }
        change.appendChild(p);
        var foot = document.createElement("footer");
        var accept = null;
        if (staged) {
          accept = document.createElement("button");
          accept.type = "button";
          accept.className = "btn-quiet btn-accept";
          accept.textContent = "✓ Accept into text";
          foot.appendChild(accept);
        }
        var dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.className = "btn-quiet";
        dismiss.textContent = "Dismiss";
        dismiss.title = "not slop here — a legit one-off (recorded, not counted against the rule)";
        foot.appendChild(dismiss);
        // FOR-56 scope chip: "the rule itself mis-fires" is a different signal from "this one is
        // fine". rule-wrong dismissals are counted; ≥3 across distinct artifacts flags the rule
        // for a human to revise. Plain Dismiss stays the safe, non-counting default.
        var ruleWrong = document.createElement("button");
        ruleWrong.type = "button";
        ruleWrong.className = "btn-quiet";
        ruleWrong.textContent = "Rule's wrong";
        ruleWrong.title = "this rule mis-fires — count it toward revision";
        foot.appendChild(ruleWrong);
        if (staged) {
          var ownership = document.createElement("span");
          ownership.className = "ownership";
          ownership.textContent = "no agent can apply this — only you";
          foot.appendChild(ownership);
        }
        card.appendChild(head);
        card.appendChild(change);
        card.appendChild(foot);
        if (masthead && masthead.nextSibling) article.insertBefore(card, masthead.nextSibling);
        else article.appendChild(card);

        if (accept) {
          accept.addEventListener("click", function () {
            if (accept.disabled) return;
            accept.disabled = true;
            var src = "/" + String(config.mdPath || "").replace(/^\/+/, "");
            fetch(src).then(function (r) { return r.text(); }).then(function (text) {
              var m = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
              var fmRaw = m ? m[0] : "";
              var body = text.slice(fmRaw.length);
              var idx = body.indexOf(s.old);
              if (idx === -1) throw new Error("the suggested passage is no longer in the document");
              var nextBody = body.slice(0, idx) + s.new + body.slice(idx + s.old.length);
              return postEdit(nextBody);
            }).then(function () {
              location.reload();
            }).catch(function (e) {
              accept.disabled = false;
              showAlert("could not accept the suggestion: " + String(e && e.message || e).slice(0, 120), "re-serve to review the current file");
            });
          });
        }
        function sendDismiss(scope) {
          // Fire-and-forget the override signal, then remove optimistically — a
          // failed POST must never strand the card.
          if (s.ruleId) {
            fetch(dismissEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: config.token, ruleId: s.ruleId, scope: scope }),
            }).catch(function () {});
          }
          card.remove();
        }
        dismiss.addEventListener("click", function () { sendDismiss("exception"); });
        ruleWrong.addEventListener("click", function () { sendDismiss("rule-wrong"); });
      });
    }

    // ----- read-as menu (informational — the folded preview-mode chooser) ----
    function attachReadAs() {
      var btn = workbench ? workbench.querySelector(".readas") : null;
      var menu = workbench ? workbench.querySelector(".readas-menu") : null;
      if (!btn || !menu) return;
      btn.addEventListener("click", function () {
        var open = menu.hidden;
        menu.hidden = !open;
        btn.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", function (e) {
        if (menu.hidden) return;
        if (e.target && (btn.contains(e.target) || menu.contains(e.target))) return;
        menu.hidden = true;
        btn.setAttribute("aria-expanded", "false");
      });
    }

    // ----- workbench wiring ---------------------------------------------------
    if (workbench) {
      workbench.hidden = false;
      for (var ti = 0; ti < tools.length; ti++) {
        (function (tool) {
          tool.addEventListener("click", function () { setTool(tool.getAttribute("data-tool")); });
        })(tools[ti]);
      }
      var saveBtn = workbench.querySelector("[data-edit-save]");
      var discardBtn = workbench.querySelector("[data-edit-discard]");
      if (saveBtn) saveBtn.addEventListener("click", saveEdit);
      if (discardBtn) discardBtn.addEventListener("click", function () { setTool("read"); });
      if (article) article.addEventListener("mouseup", onProseMouseUp);
      attachReadAs();
      attachSuggestions();
    }

    // ----- decision capture ---------------------------------------------------
    // Done is discoverable-but-inert until the pick is complete: aria-disabled
    // (not `disabled` — that drops it from some AT traversal) + the
    // describedby "pick a decision first" hint carries the why.

    // C1 reason chips — built from preview-config.decision_reasons (single source:
    // lib/decision-reason.ts), single-select, revealed only on a non-approve
    // decision. The picked chip rides the POST as decision_reason; a non-approve
    // decision needs one before Done enables (the column stays countable). Approve
    // hides the row entirely — a reason carries ~10× less signal on an approve.
    var reasonsBox = form.querySelector(".decision-reasons");
    var reasonList = config && Array.isArray(config.decision_reasons) ? config.decision_reasons : [];
    var pickedReason = null;
    var reasonChips = [];

    function currentDecision() {
      var picked = form.querySelector('input[name="decision"]:checked');
      return picked ? picked.value : null;
    }
    function needsReason() {
      var d = currentDecision();
      return d === "denied" || d === "suggested";
    }
    function refreshDone() {
      if (!doneBtn) return;
      var d = currentDecision();
      var ready = d === "approved" || (needsReason() && pickedReason !== null);
      doneBtn.setAttribute("aria-disabled", ready ? "false" : "true");
    }

    if (reasonsBox && reasonList.length > 0) {
      reasonList.forEach(function (value) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "reason-chip";
        chip.setAttribute("role", "radio");
        chip.setAttribute("aria-checked", "false");
        chip.dataset.reason = value;
        chip.textContent = value;
        chip.addEventListener("click", function () {
          pickedReason = value;
          reasonChips.forEach(function (c) {
            var on = c === chip;
            c.classList.toggle("on", on);
            c.setAttribute("aria-checked", on ? "true" : "false");
          });
          refreshDone();
        });
        reasonsBox.appendChild(chip);
        reasonChips.push(chip);
      });
    }

    form.querySelectorAll('input[name="decision"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        if (reasonsBox) {
          if (needsReason()) {
            reasonsBox.hidden = false;
          } else {
            reasonsBox.hidden = true;
            pickedReason = null;
            reasonChips.forEach(function (c) {
              c.classList.remove("on");
              c.setAttribute("aria-checked", "false");
            });
          }
        }
        refreshDone();
      });
    });

    // Error states render in-ledger with recovery copy, role="alert", focused
    // programmatically, and never auto-dismissed.
    function showAlert(reason, recovery) {
      if (!alertBox) return;
      alertBox.textContent = "";
      var r1 = document.createElement("strong");
      r1.textContent = reason;
      var r2 = document.createElement("span");
      r2.className = "rec";
      r2.textContent = recovery;
      alertBox.appendChild(r1);
      alertBox.appendChild(r2);
      alertBox.hidden = false;
      alertBox.focus();
      if (status) status.textContent = "";
      if (doneBtn) doneBtn.disabled = false;
    }

    function renderConfirmation(payload, response) {
      var pill = document.querySelector(".decision-pill");
      if (pill) {
        pill.setAttribute("data-state", payload.decision_state);
        pill.textContent = payload.decision_state;
      }
      var head = form.querySelector(".ledger-head");
      var row = form.querySelector(".decision-radio");
      if (head) head.hidden = true;
      if (row) row.hidden = true;
      if (!outcome) return;
      outcome.textContent = "";
      outcome.setAttribute("data-state", payload.decision_state);

      var hairline = document.createElement("div");
      hairline.className = "hairline";
      var recorded = document.createElement("div");
      recorded.className = "recorded";
      var stateEl = document.createElement("span");
      stateEl.className = "state";
      stateEl.textContent = (STATE_GLYPH[payload.decision_state] || "") + " " + payload.decision_state;
      var line = document.createElement("span");
      line.textContent = "Decision recorded — written to the artifact, twin archived.";
      var meta = document.createElement("span");
      meta.className = "meta";
      meta.textContent = "server exiting · nothing more will change on disk";
      recorded.appendChild(stateEl);
      recorded.appendChild(line);
      recorded.appendChild(meta);
      outcome.appendChild(hairline);
      outcome.appendChild(recorded);

      if (payload.decision_reason) {
        var recho = document.createElement("div");
        recho.className = "note-echo";
        recho.textContent = "Reason — " + payload.decision_reason;
        outcome.appendChild(recho);
      }
      if (payload.comments) {
        var echo = document.createElement("div");
        echo.className = "note-echo";
        echo.textContent = "Reviewer notes — “" + payload.comments + "”";
        outcome.appendChild(echo);
      }
      if (payload.annotations && payload.annotations.length > 0) {
        var aecho = document.createElement("div");
        aecho.className = "note-echo";
        aecho.textContent = payload.annotations.length + " annotation" + (payload.annotations.length === 1 ? "" : "s") + " recorded with the decision — the agents read them back.";
        outcome.appendChild(aecho);
      }

      // G5 — next pending, named by title (never a path, never auto-opened).
      var np = response ? response.next_pending : undefined;
      if (np !== undefined) {
        var next = document.createElement("div");
        next.className = "next";
        if (np === null) {
          var clear = document.createElement("span");
          clear.textContent = "queue clear — nothing else awaiting review.";
          var hintC = document.createElement("span");
          hintC.className = "hint";
          hintC.textContent = "new pushes will queue here; run /forsvn:review anytime";
          next.appendChild(clear);
          next.appendChild(hintC);
        } else {
          next.appendChild(document.createTextNode("next pending  ●  "));
          var name = document.createElement("span");
          name.className = "name";
          name.textContent = np.title || np.skill || "untitled artifact";
          next.appendChild(name);
          var metaBits = [np.stack, np.skill, np.date].filter(Boolean).join(" · ");
          if (metaBits) next.appendChild(document.createTextNode("  " + metaBits));
          var hint = document.createElement("span");
          hint.className = "hint";
          hint.textContent = "this page won't open it — one artifact per serve. Re-serve from the terminal: /forsvn:review";
          next.appendChild(hint);
        }
        outcome.appendChild(next);
      }

      outcome.hidden = false;
      outcome.focus();
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
      // C1 — the reason chip rides the decision additively, only on a non-approve.
      if ((picked.value === "denied" || picked.value === "suggested") && pickedReason) {
        payload.decision_reason = pickedReason;
      }
      var ta = form.querySelector('textarea[name="comments"]');
      if (ta && ta.value.trim().length > 0) payload.comments = ta.value.trim();
      // Annotations ride the decision additively — markers always; comments
      // only once queued with a body (an empty thread is not a note).
      var ride = annotations.filter(function (a) { return a.kind === "marker" || (a.body && a.body.length > 0); });
      if (ride.length > 0) payload.annotations = ride;

      if (doneBtn) doneBtn.disabled = true; // request-duration only — no spinner
      if (alertBox) alertBox.hidden = true;
      if (status) {
        status.textContent = "submitting…";
        status.removeAttribute("data-tone");
      }

      // Local-only postback to the preview CLI's /done endpoint —
      // documented contract per references/review-surface-design.md § 3.
      fetch(doneEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(function (resp) {
        if (resp.ok) {
          resp.json().then(function (j) { renderConfirmation(payload, j); }, function () { renderConfirmation(payload, null); });
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
                "Nothing was written. The file changed on disk after this page rendered — your decision would have signed a version you didn't read.",
                "re-serve to read the current version: /forsvn:review — the decision stays pending until then"
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
    // e.code, since macOS ⌥ remaps e.key to a glyph); ⌘↵ / Ctrl+↵ submits;
    // M / C / E pick a workbench tool; esc returns to Read (discarding an
    // in-flight edit); ⌘S saves in edit mode. All single-letter shortcuts are
    // suppressed while typing in a textarea/input so notes aren't hijacked.
    // Recorded UX choices: comments stay optional for all three decisions, and
    // Deny has no confirm modal — an accidental deny in this single-operator
    // local context is recoverable via git.
    document.addEventListener("keydown", function (e) {
      if (form.getAttribute("data-active") !== "true") return;
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (editState.active) return; // finish or discard the edit first
        // Same in-flight guard as the pointer path: a disabled Done button
        // means a POST is underway — don't fire a duplicate submit.
        if (doneBtn && doneBtn.disabled) return;
        if (form.requestSubmit) form.requestSubmit();
        else form.dispatchEvent(new Event("submit", { cancelable: true }));
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.code === "KeyS") && editState.active) {
        e.preventDefault();
        saveEdit();
        return;
      }
      if (e.key === "Escape") {
        if (editState.active) { e.preventDefault(); setTool("read"); }
        return;
      }
      var el = document.activeElement;
      var typing = el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT");
      if (typing) return;
      if (e.altKey && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        var decision = { KeyA: "approved", KeyD: "denied", KeyS: "suggested" }[e.code];
        if (decision) {
          e.preventDefault();
          var radio = form.querySelector('input[name="decision"][value="' + decision + '"]');
          if (radio) { radio.checked = true; radio.focus(); radio.dispatchEvent(new Event("change", { bubbles: true })); }
        }
        return;
      }
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        var tool = { KeyM: "marker", KeyC: "comment", KeyE: "edit" }[e.code];
        if (tool && workbench && !workbench.hidden) {
          e.preventDefault();
          setTool(activeTool === tool ? "read" : tool);
        }
      }
    });
  }

  function init() {
    attachTheme();
    attachCrumb();
    attachGateNotice();
    attachLiveCapture();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
