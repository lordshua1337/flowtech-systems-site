# Marketing toolkit (private reference — not deployed)

This folder holds the 27-role marketing toolkit exactly as delivered. It is **not part of the website**: `.vercelignore` keeps it out of every Vercel deployment, and the repo is private. Do not move it out of `toolkit/` without updating `.vercelignore`.

| File | What it is |
| --- | --- |
| `OPEN-FIRST.txt` | Original hand-off note |
| `marketing-company-pack-compact.tar.gz` | The pack: 27 role profiles, 108 job procedures, tools, fixtures, validation evidence (3,953 files, ~58 MB expanded) |
| SHA-256 of the archive | `b917894be30c2ca0a45f00563f52acb5d85f4ac1cd1aaac862c3b1f197b04de9` |

## Use it

```sh
mkdir -p /tmp/pack && tar -xzf toolkit/marketing-company-pack-compact.tar.gz -C /tmp/pack
open /tmp/pack/marketing-company-pack/START-HERE.md
```

Extract outside the repo and treat the pack as immutable: copy files before editing. Needs Python 3.10+; full media runs also need ReportLab, PyMuPDF, Inkscape, Poppler, FFmpeg and Node (see the pack's README).

## What it is and isn't

A validated **offline toolkit**: role instructions, authored example campaigns for three fictional businesses, and local tools. It is not 27 deployed autonomous agents, and native 3D, real-browser/assistive-tech testing and live integrations are unverified (see `docs/VALIDATION-SCOPE.md` in the pack).

## How it maps to the site

The pack's 27 roles are the site's 27 Drops, same names and order (role id N = map node N-1). The home-page campaign simulation and the role "jobs" lists are built from the pack's role and job names only. None of its procedures, skill pins, fixtures or example content are published on the site.
