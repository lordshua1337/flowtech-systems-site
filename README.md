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

## Campaign run (home page)

"Run a campaign launch" on `/` and `/proof` plays a scripted, clearly labeled **simulated** campaign on the live map. It loads on demand from `assets/sim/`:

- `scenario-texas-cooling-towers.js`: all scenario content (steps, copy, data). Swap or add a scenario here.
- `launch-engine.js`: the run clock, handoffs, gates, shelf and seal. No scenario text.
- `previews.js`: the styles and artifact renderers.

`?simspeed=N` plays it N times faster (used by the tests). Each page wires it up in `initOrg()`, keeping the older relay as a fallback if the module can't load.

## Private toolkit

`toolkit/` holds the 27-role marketing toolkit as delivered. It is excluded from every deployment by `.vercelignore`. See `toolkit/README.md`.

