# Success Criteria Templates

Per-platform retention / completion / engagement targets the brief carries in its `Success Criteria` section. Producer or measurement loop grades the published piece against these.

---

## Per-Platform Targets

### TikTok

| Metric | Target | Source |
|---|---|---|
| Hook retention (past 3s) | ≥ 70% | TikTok Creator Portal — algorithm guidance |
| Completion rate | ≥ 70% (distribution threshold) | TikTok Creator Portal + third-party trend reporting |
| Saves | ≥ 1.5% of views (niche-dependent) | Sample observation |
| Quality threshold | If completion < 50%, hook didn't land — revisit | Operational rule |

### Instagram Reels

| Metric | Target | Source |
|---|---|---|
| 3s hold rate | ≥ 60% (outperforms <40% by 5-10× total reach) | Third-party data + platform leadership's |
| Watch time | longer than baseline (#1 ranking signal) | platform leadership's Jan 2025 |
| Reshares | meaningful uplift over baseline | platform leadership's Jan 2025 |
| Quality threshold | If 3s hold < 40%, drop-off failed — rebuild hook | Operational rule |

### YouTube Shorts

| Metric | Target | Source |
|---|---|---|
| Completion | ≥ 30% (sub-30% chokes distribution) | YouTube Creator Insider |
| Loop rate | meaningful loops per view | YouTube Creator Insider |
| Swipe-through rate | low (viewer continues to watch, not swipe past) | YouTube Creator Insider |
| Shares | core ranking input | YouTube Creator Insider |

### X video (opt-in)

| Metric | Target | Source |
|---|---|---|
| Replies | meaningful uplift over follower baseline | X creator guidance |
| Reposts | core distribution signal | X creator guidance |
| Native reach | outperforms linked YouTube clips | X observed pattern |

### LinkedIn video (opt-in)

| Metric | Target | Source |
|---|---|---|
| 3s retention | ≥ 65% | LinkedIn Marketing Solutions |
| Watch time | <90s pieces optimized | LinkedIn Marketing Solutions |
| Comments | comment-prompt CTA performance | LinkedIn convention |
| Reshares | secondary distribution | LinkedIn convention |

---

## Universal Quality Thresholds

Across all platforms, if the actual data shows:

- **Sub-50% retention past hook window** → hook didn't land. Revisit hook layer; brief had a problem.
- **High views, low engagement signal (saves/shares/comments)** → reach without resonance; angle may be off.
- **High completion, low shares** → entertaining but not actionable; CTA didn't land.
- **Low completion + low engagement** → brief failed wholesale. Pull and rebuild.

---

## Brief-Side vs. Production-Side Failures

If a piece underperforms, the diagnostic path:

1. **Retention drop in first 3s** → hook layer (brief) OR hook execution (production)
2. **Steady drop through middle** → pacing layer (brief) OR cut energy (production)
3. **High retention, no engagement** → CTA layer (brief) OR CTA execution (production)
4. **No reach despite quality signals** → algorithm-fit issue (brief — wrong audio rule, missing captions, wrong length)
5. **High reach, on-target metrics, no business impact** → angle layer (brief) — well-executed but wrong angle

The brief's success criteria block + a published-piece retention chart make this diagnostic possible.

---

## How the Brief Carries This

In the brief's `Success Criteria` section, list:

```markdown
## Success Criteria

The producer / measurement loop grades against:

- **Hook retention target:** ≥ 70% past 3s (TikTok)
- **Completion target:** ≥ 70% (TikTok distribution threshold)
- **Engagement signal target:** saves ≥ 1.5% (this niche benchmark from research sample)
- **Quality threshold:** if completion < 50%, the hook didn't land — revisit hook layer
```

For multi-platform briefs, list per-platform targets in the variant briefs (each variant carries its platform's targets).

---

## Anti-Patterns

- **No success criteria section.** Brief without targets has no measurement contract.
- **Generic targets** ("get lots of views"). Specific platform thresholds only.
- **Same targets across platforms.** TikTok 70% completion ≠ Reels 60% 3s hold ≠ Shorts loop rate. Per-platform.
- **Targets without source.** Each target uses the platform doc or research sample.
