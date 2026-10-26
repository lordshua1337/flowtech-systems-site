# Flow-Tech Systems — Motion Website (v10)

Static site. No build step — Vercel serves the files as-is, with clean URLs (`/market` serves `market.html`).

| Path | File | Nav label |
| --- | --- | --- |
| `/` | `index.html` | 00 Overview |
| `/proof` | `proof.html` | 01 The Proof |
| `/market` | `market.html` | 02 The Market |
| `/channels` | `channels.html` | 03 The Channels |
| `/whats-next` | `whats-next.html` | 04 What's Next |
| `/privacy` | `privacy.html` | Privacy & Cookies |

`support.js` / `image-slot.js` are the page runtime; `assets/marbots/` holds the agent images.

`vercel.json` sends `X-Robots-Tag: noindex` so the review deployment stays out of search results — remove that header when the site goes public.

Local preview (needs clean-URL support): `npx serve .` and open http://localhost:3000
