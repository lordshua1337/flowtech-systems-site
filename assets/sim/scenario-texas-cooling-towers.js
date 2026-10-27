// Scenario data for the home-page campaign run. The engine has no scenario text in it:
// swap this file (or add a sibling) to run a different campaign.
//
// Node index = Drop index on the map (0 Chief of Staff ... 26 Inspector). -1 = the Operator.
// fx entries are [msIntoStep, op, ...args]:
//   work [nodes]   done [nodes]   held [nodes]   reject [nodes]
//   feed node text [artId] [kind]          art id...        st to id...
//   hand from to   view {kind,...}         clock text       pulse
// "Simulated run": every count, name and result below is illustrative, never Flow-Tech data.

export const SCENARIO = {
  id: 'tx-cooling-towers',
  title: 'Cooling towers · Texas',
  kicker: 'Commercial HVAC launch',
  cap: 18000,
  pace: 0.88,
  gateSeconds: 4.5,
  phases: ['Kickoff', 'Research', 'Create', 'Govern', 'Build', 'Launch'],

  art: {
    brief: { file: 'brief_v1.md', type: 'Brief', owner: 0 },
    position: { file: 'positioning_v1.md', type: 'Positioning', owner: 1 },
    atlas: { file: 'opportunity-atlas_v1.csv', type: 'Atlas', owner: 2 },
    accounts: { file: 'account-shortlist_v1.csv', type: 'Accounts', owner: 3 },
    comp: { file: 'competitor-ledger_v1.csv', type: 'Competitors', owner: 4 },
    evid: { file: 'evidence-register_v1.json', type: 'Evidence', owner: 5 },
    terr: { file: 'territories_v1.md', type: 'Concept', owner: 6 },
    copy1: { file: 'landing-copy_v1.md', type: 'Copy', owner: 7 },
    ads1t: { file: 'ad-variants_v1.csv', type: 'Ad copy', owner: 7 },
    adset1: { file: 'ad-set_v1.svg', type: 'Graphics', owner: 8 },
    sheet1: { file: 'one-pager_v1.pdf', type: 'Sales sheet', owner: 8 },
    cut1: { file: 'cutdown-15s_v1.mp4', type: 'Video', owner: 9 },
    diag: { file: 'loop-diagram_v1.svg', type: 'Diagram', owner: 10 },
    search: { file: 'query-page-map_v1.csv', type: 'Search', owner: 11 },
    edit: { file: 'editorial-pass_v1.md', type: 'Editing', owner: 12 },
    cal: { file: 'linkedin-calendar_v1.csv', type: 'Social', owner: 13 },
    press: { file: 'press-kit_v1.md', type: 'Press', owner: 14 },
    rev1: { file: 'claim-review_v1.json', type: 'Review', owner: 25 },
    log: { file: 'change-log_v2.json', type: 'Change log', owner: 7 },
    copy2: { file: 'landing-copy_v2.md', type: 'Copy', owner: 7 },
    ads2t: { file: 'ad-variants_v2.csv', type: 'Ad copy', owner: 7 },
    adset2: { file: 'ad-set_v2.svg', type: 'Graphics', owner: 8 },
    sheet2: { file: 'one-pager_v2.pdf', type: 'Sales sheet', owner: 8 },
    cut2: { file: 'cutdown-15s_v2.mp4', type: 'Video', owner: 9 },
    rev2: { file: 'claim-review_v2.json', type: 'Review', owner: 25 },
    page: { file: 'landing-page_v1.html', type: 'Web page', owner: 15 },
    flow: { file: 'wireflow_v1.svg', type: 'Wireflow', owner: 16 },
    a11y: { file: 'a11y-findings_v1.md', type: 'Accessibility', owner: 16 },
    events: { file: 'event-lineage_v1.json', type: 'Tracking', owner: 20 },
    sp: { file: 'search-plan_v1.csv', type: 'Media plan', owner: 17 },
    soc: { file: 'social-plan_v1.csv', type: 'Media plan', owner: 18 },
    mail: { file: 'lifecycle-emails_v1.html', type: 'Email', owner: 19 },
    partner: { file: 'partner-ask_v1.md', type: 'Partner', owner: 21 },
    sell: { file: 'seller-one-pager_v1.pdf', type: 'Sales', owner: 22 },
    audit: { file: 'integrity-audit_v1.json', type: 'Audit', owner: 26 },
    launch: { file: 'launch-receipt_v1.json', type: 'Launch', owner: 17 },
    outlook: { file: 'planning-outlook_v1.html', type: 'Report', owner: 23 },
    exp: { file: 'experiment-protocol_v1.md', type: 'Protocol', owner: 24 },
    next: { file: 'next-week-brief_v2.md', type: 'Brief', owner: 0 },
    seal: { file: 'pack-manifest_v1.json', type: 'Manifest', owner: 26 }
  },

  steps: [
    // ---------------------------------------------------------------- 1 Kickoff
    { id: 'brief', phase: 0, clock: 'WK1 MON 08:00', dur: 4700, lead: 0, status: 'Running',
      title: 'Turning the request into one brief',
      text: 'Objective, audience, region, offer and budget cap, written once so every Drop works from the same page.',
      view: { kind: 'brief', ver: 'v1 · Draft', title: 'Texas cooling-tower launch', fields: [['Objective', 'Qualified requests for a cooling-tower system review'], ['Audience', 'Facilities and plant managers; owner or CFO as second buyer'], ['Region', 'Texas, counties to be confirmed by research'], ['Offer', 'A system review of the customer’s cooling loop'], ['Budget cap', '$18,000 · spend authority stays with the Operator'], ['CTA', 'Request a system review']], rule: 'Rules: every claim needs evidence on file. Sending, spending and publishing wait for a person.' },
      fx: [[0, 'work', [0]], [300, 'feed', 0, 'Reads the Operator’s request: launch in Texas cooling towers'], [3300, 'art', 'brief'], [3350, 'feed', 0, 'Brief written', 'brief'], [4000, 'hand', 0, 1]] },

    { id: 'position', phase: 0, clock: 'WK1 MON 08:40', dur: 4000, lead: 1, status: 'Running',
      title: 'One message per buyer, each tied to proof',
      text: 'Maps what each buyer is choosing between today, then sets the message hierarchy.',
      view: { kind: 'position', buyers: [{ who: 'Facilities & plant manager', pillar: 'Fewer surprises in the loop', note: 'Keep equipment protected without adding handling work.', proof: 'Application-specific field record' }, { who: 'Owner · CFO', pillar: 'Operating cost, with the math shown', note: 'Compare total cost on stated assumptions.', proof: 'Cost model with assumptions listed' }] },
      fx: [[0, 'work', [1]], [200, 'done', [0]], [400, 'feed', 1, 'Maps what each buyer chooses instead of buying'], [2700, 'art', 'position'], [2750, 'feed', 1, 'Positioning and message hierarchy', 'position'], [3400, 'hand', 1, -1]] },

    { id: 'gate1', phase: 0, clock: 'WK1 MON 09:15', gate: { n: 1, who: 'Operator', title: 'Approve the brief', bullets: ['Objective, audience and region match the request', '$18,000 cap is set. Nothing is spent yet', 'Every message needs a record behind it'], approve: ['brief', 'position'], stamp: 'Approved' } },

    // ---------------------------------------------------------------- 2 Research
    { id: 'atlas', phase: 1, clock: 'WK1 MON 10:00', dur: 5600, lead: 2, status: 'Running',
      title: 'Scoring Texas, county by county',
      text: 'Each county-sector cell is scored for system fit. The shortlist is modeled, and labeled that way.',
      view: { kind: 'map', cells: 3142, counties: [{ name: 'Harris', lon: -95.37, lat: 29.76, fit: 94 }, { name: 'Dallas', lon: -96.8, lat: 32.78, fit: 91 }, { name: 'Tarrant', lon: -97.33, lat: 32.75, fit: 88 }, { name: 'Bexar', lon: -98.49, lat: 29.42, fit: 87 }, { name: 'Travis', lon: -97.74, lat: 30.27, fit: 85 }, { name: 'Collin', lon: -96.62, lat: 33.2, fit: 82 }, { name: 'Denton', lon: -97.13, lat: 33.21, fit: 79 }, { name: 'Fort Bend', lon: -95.76, lat: 29.58, fit: 78 }, { name: 'Montgomery', lon: -95.46, lat: 30.31, fit: 76 }, { name: 'El Paso', lon: -106.49, lat: 31.76, fit: 74 }, { name: 'Williamson', lon: -97.68, lat: 30.63, fit: 73 }, { name: 'Hidalgo', lon: -98.16, lat: 26.3, fit: 71 }] },
      fx: [[0, 'hand', 0, 2], [300, 'work', [2]], [200, 'done', [1]], [500, 'feed', 2, 'Scores 3,142 county-sector cells for system fit'], [3900, 'art', 'atlas'], [3950, 'feed', 2, '12 counties shortlisted, modeled', 'atlas'], [4800, 'hand', 2, 3]] },

    { id: 'accounts', phase: 1, clock: 'WK1 MON 13:30', dur: 4200, lead: 3, status: 'Running',
      title: 'Matching facilities to the ICP',
      text: 'Applies the ICP and the exclusions. Any outbound list waits for the Operator.',
      view: { kind: 'accounts', rows: [['Hospital & health campuses', 42, 6], ['Data centers', 19, 3], ['Commercial office towers', 88, 11], ['Universities & campuses', 14, 2], ['Hotels & convention centers', 31, 9]] },
      fx: [[0, 'work', [3]], [200, 'done', [2]], [400, 'feed', 3, 'Resolves facilities and their parent companies'], [1500, 'feed', 3, 'Applies exclusions: existing customers, competitors'], [2600, 'art', 'accounts'], [2650, 'st', 'held', 'accounts'], [2700, 'held', [3]], [2750, 'feed', 3, 'Outbound list held for the Operator', 'accounts', 'warn']] },

    { id: 'research', phase: 1, clock: 'WK1 TUE 09:00', dur: 4600, lead: 4, extra: [5], status: 'Running',
      title: 'Dating every competitor claim, filing every source',
      text: 'Two Drops in parallel: what rivals say and when, and what evidence is allowed to back what.',
      view: { kind: 'research', vendors: [{ name: 'Vendor A', claim: '“Chemical-free” on its homepage', seen: '12 Oct', flag: 'Do not mirror', k: 'a' }, { name: 'Vendor B', claim: 'Price per ton-hour in a PDF', seen: '14 Oct', flag: 'Re-check 14 Nov', k: 'b' }, { name: 'Vendor C', claim: '“Guaranteed” scale control', seen: '9 Oct', flag: 'Do not mirror', k: 'a' }], evidence: [{ id: 'EV-01', type: 'Application-specific field record', scope: 'Cooling-tower loop · conditions stated', valid: 'Current', k: 'g' }, { id: 'EV-02', type: 'Industry water-quality guidance', scope: 'General reference', valid: 'Current', k: 'g' }, { id: 'EV-03', type: 'Case data from a service contract', scope: 'One site · not generalizable', valid: 'Expires in 30 d', k: 'a' }] },
      fx: [[0, 'work', [4, 5]], [400, 'feed', 4, 'Dates each competitor claim and what not to mirror'], [900, 'feed', 5, 'Files evidence with its scope and expiry'], [2700, 'art', 'comp', 'evid'], [2750, 'feed', 4, 'Competitor ledger', 'comp'], [3050, 'feed', 5, 'Evidence register: 3 records, 1 expiring', 'evid'], [3300, 'hand', 4, 1], [3700, 'hand', 5, 25]] },

    // ---------------------------------------------------------------- 3 Create
    { id: 'concept', phase: 2, clock: 'WK1 TUE 11:00', dur: 4200, lead: 6, status: 'Running',
      title: 'Three creative territories, one chosen',
      text: 'Concepts come from the approved positioning, and are checked against the brand before anything moves on.',
      view: { kind: 'territories', items: [{ name: 'Proof before promise', line: 'Lead with the evidence record and the conditions it holds under.', pick: true }, { name: 'The quiet loop', line: 'Fewer call-outs, a calmer plant room.' }, { name: 'Know your loop', line: 'Start with the water chemistry; the review is step one.' }] },
      fx: [[0, 'hand', 1, 6], [300, 'work', [6]], [200, 'done', [4, 5]], [500, 'feed', 6, 'Drafts three territories from the approved positioning'], [2900, 'art', 'terr'], [2950, 'feed', 6, 'Picks “Proof before promise”', 'terr'], [3600, 'hand', 6, 7]] },

    { id: 'copy', phase: 2, clock: 'WK1 TUE 14:00', dur: 6000, lead: 7, status: 'Drafting',
      title: 'Writing the landing page and ad variants',
      text: 'Full copy in the Flow-Tech voice. It goes to review before any designer touches it.',
      view: { kind: 'copy', label: 'Landing copy', ver: 'v1 · Draft', parts: [[{ t: 'Eliminate scale in every cooling tower.', f: 1 }], [{ t: 'Proven across Texas facilities.', f: 2 }, ' Request a system review of your loop.'], ['A system review of your loop, water chemistry and operating profile.'], ['Evidence records for your application, with conditions stated.'], ['Clear next steps and a named technical owner.'], ['Request a system review']] },
      fx: [[0, 'work', [7]], [200, 'done', [6]], [500, 'feed', 7, 'Drafts landing copy and ad variants from the brief'], [4300, 'art', 'copy1', 'ads1t'], [4350, 'feed', 7, 'Landing copy and 3 ad variants', 'copy1'], [5100, 'hand', 7, 8]] },

    { id: 'ads', phase: 2, clock: 'WK1 WED 09:00', dur: 4400, lead: 8, status: 'Running',
      title: 'Building the ad set and a one-pager',
      text: 'Layouts for each placement, taken from the copy exactly as written.',
      view: { kind: 'ads', ver: 'v1', badge: 'Draft', badgeK: 'n', ads: [{ h: 'Eliminate scale. Every tower.', b: 'Proven across Texas facilities. Request a system review.', cta: 'Request review', fmt: '1:1 · feed' }, { h: 'Zero scale. Zero guesswork.', b: 'See the evidence for your loop.', cta: 'Learn more', fmt: '1.91:1 · feed' }, { h: 'Scale-free towers', b: 'Request a review.', cta: 'Request', fmt: '9:16' }] },
      fx: [[0, 'work', [8]], [200, 'done', [7]], [500, 'feed', 8, 'Builds three placements from copy v1'], [2100, 'art', 'adset1'], [2600, 'art', 'sheet1'], [2650, 'feed', 8, 'Ad set and one-pager', 'adset1']] },

    { id: 'media', phase: 2, clock: 'WK1 WED 10:30', dur: 5400, lead: 10, extra: [9], status: 'Running',
      title: 'A labeled diagram and a 15-second cut',
      text: 'The diagram says “illustrative, not to scale”. The video carries captions from the approved script.',
      view: { kind: 'diagram' },
      fx: [[0, 'work', [10, 9]], [200, 'done', [8]], [500, 'feed', 10, 'Draws the cooling loop and labels it illustrative'], [900, 'feed', 9, 'Cuts a 15-second version with captions on'], [2700, 'view', { kind: 'video', ver: 'v1', frames: [['0:00', 'Cooling loop at work'], ['0:03', 'Where scale forms'], ['0:07', 'How a system review works'], ['0:11', 'What the evidence says'], ['0:14', 'Request a review']] }], [2900, 'art', 'diag'], [3700, 'art', 'cut1'], [3750, 'feed', 9, 'Cut-down with captions', 'cut1'], [3300, 'hand', 10, 9], [4100, 'hand', 10, 12]] },

    { id: 'content', phase: 2, clock: 'WK1 WED 11:30', dur: 5000, lead: 11, extra: [12, 13, 14], status: 'Running',
      title: 'Search, editing, social and press in parallel',
      text: 'Four Drops work at once. Each hands its draft to review, not straight to a channel.',
      view: { kind: 'content', search: [['cooling tower scale control', '/cooling-towers'], ['legionella risk cooling tower', '/legionella · owner review'], ['cooling tower chemical cost', '/cost-model'], ['texas commercial hvac water', '/texas']], cal: [1, 0, 1, 0, 1, 0, 1, 1, 0, 1], press: 'Angle: evidence-first water systems. A holding statement is ready if a claim is questioned.' },
      fx: [[0, 'work', [11, 12, 13, 14]], [200, 'done', [10, 9]], [400, 'feed', 11, 'Maps four search intents to real pages'], [900, 'feed', 12, 'Edits for meaning and channel fit'], [1400, 'feed', 13, 'Plans two weeks of LinkedIn'], [1900, 'feed', 14, 'Finds the news angle, drafts a holding statement'], [3000, 'art', 'search', 'edit', 'cal', 'press'], [3300, 'hand', 11, 12], [3700, 'hand', 14, 25], [4100, 'hand', 12, 25]] },

    // ---------------------------------------------------------------- 4 Govern
    { id: 'audit', phase: 3, clock: 'WK1 WED 14:00', dur: 4600, lead: 25, status: 'Reviewing',
      title: 'Checking every claim against the evidence',
      text: 'The reviewer reads the actual copy next to the evidence register, claim by claim.',
      view: { kind: 'copy', label: 'Landing copy', ver: 'v1 · In review', verK: 'a', noType: true, scan: true, flags: [1, 2], flagAt: 1500, parts: [[{ t: 'Eliminate scale in every cooling tower.', f: 1 }], [{ t: 'Proven across Texas facilities.', f: 2 }, ' Request a system review of your loop.'], ['A system review of your loop, water chemistry and operating profile.'], ['Evidence records for your application, with conditions stated.'], ['Clear next steps and a named technical owner.'], ['Request a system review']] },
      fx: [[0, 'hand', 7, 25], [300, 'work', [25]], [200, 'done', [11, 12, 13, 14]], [600, 'feed', 25, 'Reads landing copy v1 against the evidence register'], [3300, 'feed', 25, 'Two claims do not hold up', null, 'bad']] },

    { id: 'reject', phase: 3, clock: 'WK1 WED 14:20', dur: 6400, lead: 25, status: 'Rejected',
      title: 'Rejected, with the exact findings',
      text: 'The copy goes back to its owner. Anything built from it is marked stale. Unrelated work is left alone.',
      view: { kind: 'audit', claims: [{ text: 'Eliminate scale in every cooling tower', why: 'Absolute, and it covers every tower. Evidence supports control under stated conditions.', verdict: 'Contradicted', ok: false }, { text: 'Proven across Texas facilities', why: 'Evidence on file is application-specific, not a population of facilities.', verdict: 'Unsupported', ok: false }, { text: 'Evidence records for your application, with conditions stated', why: 'Matches the register.', verdict: 'Supported', ok: true }, { text: 'Request a system review', why: 'A call to action, not a factual claim.', verdict: 'Non-factual', ok: true }] },
      fx: [[300, 'art', 'rev1'], [350, 'st', 'rejected', 'rev1', 'copy1'], [3300, 'view', { kind: 'ret', findings: [{ k: 'Claim 1 · contradicted', where: 'landing-copy_v1 · H1', line: '“Eliminate scale in every cooling tower.” Qualify it to the stated conditions.' }, { k: 'Claim 2 · unsupported', where: 'landing-copy_v1 · sub', line: '“Proven across Texas facilities.” State the evidence’s real scope.' }], stale: ['ad-variants_v1', 'ad-set_v1', 'one-pager_v1', 'cutdown-15s_v1'], kept: 'Research, media plan and budget are untouched. Nothing had shipped.' }], [3400, 'hand', 25, 7], [3500, 'reject', [7]], [3700, 'st', 'stale', 'ads1t', 'adset1', 'sheet1', 'cut1'], [3800, 'feed', 25, 'Returns copy v1 to the Copywriter with exact findings', 'rev1', 'bad'], [4600, 'feed', 25, '4 downstream artifacts marked stale; research untouched', null, 'warn']] },

    { id: 'repair', phase: 3, clock: 'WK1 WED 15:10', dur: 5400, lead: 7, status: 'Reworking',
      title: 'The smallest fix that makes it true',
      text: 'Only the flagged lines change. The offer, the CTA and everything supported stay exactly as written.',
      view: { kind: 'copy', label: 'Landing copy', ver: 'v2 · Repaired', verK: 'g', ins: true, parts: [[{ t: 'Help control scale in your cooling-tower loop.', f: 1 }], [{ t: 'Backed by an application-specific evidence record.', f: 2 }, ' Results vary by water chemistry and system.'], ['A system review of your loop, water chemistry and operating profile.'], ['Evidence records for your application, with conditions stated.'], ['Clear next steps and a named technical owner.'], ['Request a system review']] },
      fx: [[0, 'work', [7]], [200, 'feed', 7, 'Reads the exact findings, not a summary'], [2500, 'art', 'log', 'copy2', 'ads2t'], [2550, 'feed', 7, 'Rewrites 2 lines; offer and CTA unchanged', 'copy2'], [3400, 'hand', 7, 8], [3900, 'feed', 7, 'Change log ties each edit to a finding', 'log']] },

    { id: 'rebuild', phase: 3, clock: 'WK1 WED 16:00', dur: 4600, lead: 8, extra: [9], status: 'Rebuilding',
      title: 'Rebuilding only what depended on the copy',
      text: 'Ads, one-pager and captions are rebuilt from v2. The old versions stay on file for audit.',
      view: { kind: 'ads', ver: 'v2', badge: 'Rebuilt from copy v2', badgeK: 'g', ads: [{ h: 'Help control scale in your tower loop', b: 'Backed by an application-specific evidence record.', cta: 'Request review', fmt: '1:1 · feed' }, { h: 'See the evidence for your loop', b: 'Results vary by water chemistry and system.', cta: 'Request review', fmt: '1.91:1 · feed' }, { h: 'Start with a system review', b: 'Conditions stated.', cta: 'Request', fmt: '9:16' }] },
      fx: [[0, 'work', [8, 9]], [200, 'done', [7]], [400, 'feed', 8, 'Rebuilds ads and one-pager from copy v2'], [900, 'feed', 9, 'Re-cuts the captions'], [1900, 'art', 'adset2'], [2500, 'art', 'sheet2'], [3000, 'art', 'cut2'], [3300, 'st', 'superseded', 'copy1', 'ads1t', 'adset1', 'sheet1', 'cut1', 'rev1'], [3400, 'feed', 8, '3 rebuilt files; old versions kept for audit', 'adset2'], [3900, 'hand', 7, 25]] },

    { id: 'reclear', phase: 3, clock: 'WK1 THU 09:00', dur: 4000, lead: 25, status: 'Reviewing',
      title: 'Rechecking the fix and everything rebuilt',
      text: 'Cleared is not approved. A person still signs off, and the reviewer says so.',
      view: { kind: 'audit', claims: [{ text: 'Help control scale in your cooling-tower loop', why: 'Qualified to the stated conditions.', verdict: 'Qualified', ok: true }, { text: 'Backed by an application-specific evidence record', why: 'Matches EV-01.', verdict: 'Supported', ok: true }, { text: 'Results vary by water chemistry and system', why: 'A limit stated, not a promise.', verdict: 'Supported', ok: true }, { text: 'Request a system review', why: 'A call to action, not a factual claim.', verdict: 'Non-factual', ok: true }] },
      fx: [[0, 'work', [25]], [200, 'done', [8, 9, 7]], [500, 'feed', 25, 'Rechecks copy v2 and every rebuilt format'], [2200, 'art', 'rev2'], [2300, 'st', 'cleared', 'rev2', 'copy2', 'ads2t', 'adset2', 'sheet2', 'cut2', 'log'], [2400, 'feed', 25, 'Cleared. Not approved: a person still signs off', 'rev2', 'ok']] },

    { id: 'gate2', phase: 3, clock: 'WK1 THU 09:40', gate: { n: 2, who: 'Technical owner', title: 'Approve the claims', bullets: ['Two claims rewritten, none added', 'Each claim points to an evidence record', 'Wording stays inside the stated conditions'], approve: ['rev2', 'copy2', 'ads2t', 'adset2', 'sheet2', 'cut2', 'log'], stamp: 'Approved' } },

    // ---------------------------------------------------------------- 5 Build
    { id: 'web', phase: 4, clock: 'WK1 THU 10:30', dur: 5600, lead: 15, extra: [16], status: 'Building',
      title: 'Building the page from cleared copy only',
      text: 'The form is a local demo until the Operator approves publishing. Accessibility is checked as it is built.',
      view: { kind: 'landing', url: 'campaign.flow-tech.example/cooling-towers', h1: 'Help control scale in your cooling-tower loop.', sub: 'Backed by an application-specific evidence record. Results vary by water chemistry and system.', chips: ['Evidence record', 'System review'] },
      fx: [[0, 'hand', 25, 15], [300, 'work', [15, 16]], [200, 'done', [25]], [600, 'feed', 15, 'Builds the page from cleared copy v2'], [2100, 'art', 'page'], [2800, 'view', { kind: 'flow', nodes: [{ x: 2, y: 8, t: 'Ad click' }, { x: 70, y: 8, t: 'Landing' }, { x: 138, y: 8, t: 'Form' }, { x: 206, y: 8, t: 'Thank you' }, { x: 272, y: 8, t: 'CRM event' }, { x: 138, y: 60, t: 'Error + retry', k: 'bad' }, { x: 206, y: 60, t: 'Cancel', k: 'bad' }], edges: ['M60 23 H70', 'M128 23 H138', 'M196 23 H206', 'M264 23 H272', 'M167 38 V60', 'M196 75 H206', 'M138 78 C112 78 112 28 138 28'], checks: [['Names and roles ✓', 'g'], ['Contrast declared ✓', 'g'], ['Error and retry states', 'b'], ['Keyboard walk: queued', 'n']] }], [3000, 'feed', 16, 'Maps the full flow, including error and retry'], [3800, 'art', 'flow', 'a11y'], [4300, 'feed', 16, 'Keyboard walk queued for a real browser', 'a11y', 'warn']] },

    { id: 'ops', phase: 4, clock: 'WK1 THU 13:00', dur: 5000, lead: 20, extra: [17, 18], status: 'Building',
      title: 'Tracking and media plans, inside one cap',
      text: 'Search and social are planned against the same $18,000. The cap is checked across channels, not per channel.',
      view: { kind: 'budget', cap: 18000, alloc: [{ name: 'Paid search', note: 'intent keywords', amt: 8100, pct: 45, c: '#2E9BFF' }, { name: 'Paid social', note: 'job-title audiences', amt: 4500, pct: 25, c: '#8ACFFF' }, { name: 'Partner co-marketing', note: 'joint events', amt: 1800, pct: 10, c: '#3DDC97' }, { name: 'Email and lifecycle', note: 'consent-gated', amt: 900, pct: 5, c: '#F5B544' }, { name: 'Reserve', note: 'held back', amt: 2700, pct: 15, c: '#6F6E69' }] },
      fx: [[0, 'hand', 25, 17], [300, 'work', [20, 17, 18]], [200, 'done', [15, 16]], [600, 'feed', 20, 'Traces the demo-request event from form to pipeline'], [1100, 'feed', 17, 'Builds the search account inside the cap'], [1600, 'feed', 18, 'Sets audiences and exclusions'], [3000, 'art', 'events', 'sp', 'soc'], [3300, 'feed', 17, 'Plan totals $15,300; $2,700 held in reserve', 'sp']] },

    { id: 'life', phase: 4, clock: 'WK1 THU 14:30', dur: 5000, lead: 19, extra: [21, 22], status: 'Drafting',
      title: 'Emails, partner ask and seller sheet',
      text: 'Nurture checks who is eligible before writing a word. Missing consent means no send, ever.',
      view: { kind: 'email', stages: [['Thanks. Here’s what happens next', 'Confirms the request and names the technical owner'], ['What a system review covers', 'Explains the steps and what we need from you'], ['A question about your loop', 'Asks one useful question and offers a call']] },
      fx: [[0, 'hand', 3, 19], [300, 'work', [19, 21, 22]], [200, 'done', [20, 17, 18]], [600, 'feed', 19, 'Checks eligibility first, then drafts three stages'], [1300, 'feed', 21, 'Drafts the co-marketing ask'], [1800, 'feed', 22, 'Builds the seller one-pager and objection answers'], [2800, 'art', 'mail'], [2900, 'st', 'blocked', 'mail'], [3000, 'art', 'partner', 'sell'], [3050, 'held', [19]], [3100, 'feed', 19, 'Sending blocked: consent not verified', 'mail', 'warn']] },

    { id: 'qa', phase: 4, clock: 'WK1 THU 16:00', dur: 5200, lead: 26, status: 'Auditing',
      title: 'Every file, every owner, every digest',
      text: 'The auditor recomputes digests and checks that each artifact has an owner and a reviewed predecessor.',
      view: { kind: 'integrity', total: 34, sampleIds: ['brief', 'copy2', 'adset2', 'page', 'flow', 'sp', 'soc', 'rev2'], note: 'Stale files kept for audit, never reused.' },
      fx: [[0, 'hand', 15, 26], [300, 'work', [26]], [200, 'done', [21, 22]], [600, 'feed', 26, 'Recomputes every digest and checks every owner'], [4000, 'art', 'audit'], [4100, 'st', 'cleared', 'audit', 'terr', 'atlas', 'comp', 'evid', 'search', 'edit', 'cal', 'press', 'diag', 'flow', 'a11y', 'events', 'partner', 'sell'], [4150, 'feed', 26, '34 of 34 digests match; 0 unowned files', 'audit', 'ok']] },

    { id: 'gate3', phase: 4, clock: 'WK1 THU 16:40', gate: { n: 3, who: 'Operator', title: 'Approve publish and budget', bullets: ['$15,300 planned, $2,700 held in reserve', 'Search and social go live; email stays blocked', 'The page uses cleared copy v2 only'], approve: ['page', 'sp', 'soc', 'events'], stamp: 'Approved' } },

    // ---------------------------------------------------------------- 6 Launch
    { id: 'launch', phase: 5, clock: 'WK2 MON 09:00', dur: 4800, lead: 17, extra: [18], status: 'Launching',
      title: 'Live, inside the cap',
      text: 'Spend guards pause every channel at the cap. Email stays blocked until consent is verified.',
      view: { kind: 'launch', rows: [['Paid search', 'Live · 12 counties · spend guard pauses at the $18,000 cap', 'Live', 'g'], ['Paid social', 'Live · exclusions on', 'Live', 'g'], ['Email', 'Drafts armed · consent not verified', 'Blocked', 'a'], ['Tracking', 'Test events reach the pipeline', 'Verified', 'g']] },
      fx: [[0, 'hand', 25, 17], [300, 'work', [17, 18]], [200, 'done', [26]], [600, 'feed', 17, 'Search is live, inside the cap'], [1100, 'feed', 18, 'Social is live, exclusions on'], [2400, 'art', 'launch'], [2450, 'feed', 17, 'Launch receipt filed', 'launch', 'ok'], [3300, 'hand', 17, 23], [3700, 'hand', 18, 23]] },

    { id: 'outlook', phase: 5, clock: 'WK2 MON 12:00', dur: 5000, lead: 23, status: 'Reporting',
      title: 'What to expect, and what would change our mind',
      text: 'The first report states assumptions, not results. Observed numbers stay blank until they exist.',
      view: { kind: 'outlook', funnel: [['Qualified requests', '8–20', 28, 44, 'Planning range for 14 days at the cap'], ['Click rate', '0.8–1.6%', 20, 40, 'Assumption · revisit after week 1'], ['Form rate', '5–9%', 25, 40, 'Assumption · revisit after week 1'], ['Qualified share', '40–60%', 35, 35, 'Assumption · sales confirms']] },
      fx: [[0, 'work', [23]], [200, 'done', [17, 18]], [500, 'feed', 23, 'Builds the 14-day outlook from stated assumptions'], [1700, 'feed', 23, 'Tracking checks pass in test mode; no observed data yet', null, 'ok'], [3300, 'art', 'outlook'], [3500, 'hand', 23, 0], [3900, 'hand', 23, 1]] },

    { id: 'learn', phase: 5, clock: 'WK2 MON 15:00', dur: 5200, lead: 24, extra: [0], status: 'Planning',
      title: 'Freezing the test before the data arrives',
      text: 'The experiment is written down first, so the result cannot be bent to fit. Then next week’s brief.',
      view: { kind: 'experiment', title: 'Hero headline test', fields: [['Question', 'Does “Help control scale” beat “See the evidence” on qualified requests per click?'], ['Metric', 'Qualified requests per click, over 14 days'], ['Rule', 'Ship the winner only if the interval excludes zero lift'], ['Limit', 'Tests the message, not the technology']] },
      fx: [[0, 'work', [24]], [200, 'done', [23]], [500, 'feed', 24, 'Freezes hypothesis, metric and decision rule'], [1900, 'art', 'exp'], [2000, 'feed', 24, 'Protocol frozen before launch data', 'exp'], [2600, 'hand', 24, 0], [3000, 'work', [0]], [3000, 'view', { kind: 'next', moves: [['Read the first-week query report', 'Watch for intents that fit the page map'], ['Decide on the next three counties', 'Only if the outlook assumptions hold'], ['Renew the evidence record expiring in 30 days', 'Source Scout owns the renewal']] }], [3300, 'feed', 0, 'Writes next week’s brief: three moves for the Operator'], [4200, 'art', 'next']] },

    { id: 'seal', phase: 5, clock: 'WK2 FRI 17:00', dur: 6200, seal: true, lead: 26 }
  ]
};
