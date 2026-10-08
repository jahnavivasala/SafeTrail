SafeTrail — Safety intelligence + silent SOS (prototype)
Before danger: understand risk. During danger: silently get help. After danger: resolve, record, learn.
Run: open index.html (or npx serve . for offline/PWA caching). Test: node tests/test.js. Demo script: Safety tab (drag hour to 23:00, tap Old Bridge Underpass, read "Why this score") -> Route tab -> SOS tab (tap SOS, cancel once, send) -> open a second window at index.html#/responder (PIN 2468) to accept in real time -> resolve. In Me, switch "Demo responder behaviour" to "No responder available" to show escalation.
Everything simulated is labelled
Fictional city, simulated reports, simulated responder (Unit R-12), compressed ETA (30x), demo PIN, no real SMS/dispatch. Real GPS is used if the browser grants it.
Viva answers
No internet? SOS is queued on the device (status "queued"), sent on reconnect; call/text fallback shown. App shell cached by a service worker.
No GPS? Manual nearest-area picker; responder sees area only.
Responder unavailable? Escalation every 12 s (demo): nearby -> all verified + contacts -> control room + "call 112".
Fake report? Max 3/day per device, unverified reports count at half weight until 2 confirmations. (Real build: account-less attestation tokens + server-side abuse detection.)
Accidental SOS? 5 s cancel countdown; "I am safe" ends it and tells the responder.
Who sees location? Only the accepting responder and control room. Before acceptance, area only. Sharing stops and coordinates are erased at resolution; history keeps area only.
Where does data come from? data.js, seeded simulated reports. Replace with a reports API.
How is risk calculated? Per report: category weight x time-of-day match x recency (halves every 21 days) x credibility. Risk = 100(1-e^(-sum/3)). Shown in-app.
Is AI doing anything? No. It is a transparent weighted formula, and the app says so.
What is different? Safety score is explainable and honest about confidence ("no data" is not "safe"), SOS covers the full lifecycle including escalation and automatic sharing stop, and it works as a responder-side product too.
Production gaps (honest limits)
Client-only: no server, so cross-device sync only works between tabs on one browser. A real deployment needs: backend with TLS, responder identity verification and MFA, server-side validation and rate limiting, short-lived signed location tokens, audit logs, integration with a control room/112, push notifications, and a privacy impact assessment.
Files
index.html, style.css, app.js (UI + SOS state machine), data.js (demo data + scoring engine), sw.js, manifest.json, icon.svg, tests/test.js
