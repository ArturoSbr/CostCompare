# CostCompare 🛒

Ever stood in the aisle at Costco trying to figure out if the 900g jar of 
peanuts is actually cheaper than the 2lb tub? Yeah, me too.

CostCompare is a lightweight, offline-first web app that solves that exact 
problem. You just plug in the prices, quantities, and units (mass, volume, 
or count) for a few items, and it spits out a ranked list showing you the 
actual best value.

## Tech Stack
- **Framework:** SvelteKit (Svelte 5 Runes)
- **Styling:** Tailwind CSS v4
- **Storage:** Dexie.js (IndexedDB so it works completely offline)
- **Logic:** `convert` package handling the Costco math

## Running it Locally

Want to spin it up yourself? It's easy:

```sh
npm install
npm run dev
```

That's it. It's free, open source (MIT), and built to run directly on your 
phone as a PWA.
