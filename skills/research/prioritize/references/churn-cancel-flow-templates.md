# Cancel Flow & Dunning Email Templates

Ready-to-adapt templates for each stage of the cancel flow and dunning sequence.

---

## Cancel Flow Emails

### Exit Survey Email (if cancel happens outside the app)

```
Subject: We're sorry to see you go — one quick question?

Hi [Name],

We noticed you cancelled your [Product] subscription.

We'd love to understand why so we can improve. Would you mind
telling us your main reason?

[ ] Too expensive
[ ] Not using it enough
[ ] Switched to another tool
[ ] Missing a feature I need
[ ] Had a bad experience
[ ] My needs changed
[ ] Other: ___

[One-click survey link]

Either way, your data is safe and your account stays accessible
until [end date].

— [Team name]
```

### Save Offer: Price Objection

```
Subject: Before you go — we have an option for you

Hi [Name],

We understand that price matters. Before your cancellation takes
effect on [date], we wanted to offer you two options:

Option 1: [X]% off for the next [N] months → [link]
Option 2: Switch to our [cheaper plan] at $[X]/mo → [link]

No pressure — if neither works, your cancellation will proceed
as planned on [date].

— [Team name]
```

### Save Offer: Value Not Realized

```
Subject: We think you might be missing out on [key feature]

Hi [Name],

We noticed you haven't tried [key feature] yet — it's the feature
our most successful users say makes the biggest difference.

Before your cancellation on [date], would you like a free 15-minute
walkthrough? Our team can show you exactly how [specific outcome].

[Book a walkthrough → link]

If it's not for you, no worries — your cancellation proceeds as
planned.

— [Team name]
```

### Save Offer: Needs Changed / Temporary

```
Subject: Need a break? You can pause instead of cancel.

Hi [Name],

We get it — sometimes timing isn't right.

Instead of cancelling, you can pause your subscription for up to
3 months. Your data stays safe, and you can reactivate anytime
with one click.

[Pause my subscription → link]

If you'd rather cancel completely, your cancellation will proceed
on [date].

— [Team name]
```

### Post-Cancel Goodbye

```
Subject: Your [Product] account has been cancelled

Hi [Name],

Your cancellation is confirmed. Here's what to know:

- Your access continues until [end date]
- Your data will be available for export for [N] days
- To export your data: [link]
- To reactivate anytime: [link]

We'd love to have you back if your needs change. If you told us
you'd return when [specific feedback they gave], we'll let you
know when that happens.

— [Team name]
```

### Win-Back (30 Days Post-Cancel)

```
Subject: [Name], here's what's new at [Product]

Hi [Name],

It's been a month since you left, and we've been busy:

- [New feature or improvement relevant to their exit reason]
- [Another update]

If any of this changes things, reactivating takes 30 seconds:

[Reactivate my account → link]

Your data is still here waiting.

— [Team name]
```

---

## Dunning Sequence Emails

### Day 1: Payment Failed (Friendly)

```
Subject: Heads up — your payment didn't go through

Hi [Name],

Your latest payment of $[amount] for [Product] didn't process.
This happens sometimes — usually an expired card or temporary
bank hold.

You can update your payment method here:
[Update payment → link]

We'll automatically retry in 2 days. No action needed if the
issue resolves on its own.

— [Team name]
```

### Day 3: Second Notice (Helpful)

```
Subject: Quick reminder — your [Product] payment needs attention

Hi [Name],

Your payment is still failing. To keep your account active,
please update your payment method:

[Update payment → link]

Common fixes:
- Check if your card has expired
- Ensure sufficient funds
- Try a different payment method

Your account is still fully active — we just need the payment
sorted within the next few days.

— [Team name]
```

### Day 7: Urgent Notice

```
Subject: Action needed — your [Product] account will be paused in 3 days

Hi [Name],

We've been unable to process your payment of $[amount] since
[date]. If we don't receive payment by [date + 3 days], your
account will be paused.

What "paused" means:
- You won't be able to access [key features]
- Your data is safe and won't be deleted
- You can reactivate instantly by updating payment

[Update payment now → link]

— [Team name]
```

### Day 10: Final Warning

```
Subject: Last chance — your [Product] account will be paused tomorrow

Hi [Name],

This is our final notice. Your payment of $[amount] has been
failing since [date].

Your account will be paused tomorrow, [date].

One click to fix it: [Update payment → link]

If you've already updated your payment, you can ignore this —
we'll retry automatically tonight.

— [Team name]
```

### Day 14: Account Paused

```
Subject: Your [Product] account has been paused

Hi [Name],

Your account has been paused due to an unresolved payment issue.

Your data is safe — nothing has been deleted.

To reactivate instantly: [Reactivate → link]

If you meant to cancel, no action needed. Your data will remain
available for export for [N] days.

— [Team name]
```

---

## Template Customization Notes

- Replace `[Product]` with your product name throughout
- Adjust $ amounts and dates dynamically from your billing system
- Match tone to your brand voice (adjust from these neutral defaults)
- Always include a one-click action link — don't make them log in first
- Test subject lines: the Day 7 "will be paused in 3 days" email typically has the highest action rate
