<div align="center">

<img src="public/logo.svg" alt="Dendro" height="60" />

# Dendro

[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-2d6a4f?style=flat-square)](LICENSE)

*A forestry & plant intelligence platform built for people who care about trees.*

</div>

---

## Why Dendro exists

Most plant databases are built for researchers — dense, hard to navigate, and disconnected from the bigger picture of why forests matter.

Dendro was created to bridge that gap. It pulls live data from multiple botanical sources (Trefle, Perenual, GBIF, Tropicos) and presents it in a way that's actually readable — whether you're a student, a conservationist, or just someone who wants to know what tree is growing in their backyard.

A secondary focus is the **Philippines**, one of the world's biodiversity hotspots, whose native flora is underrepresented in most Western-centric plant tools. Dendro surfaces Philippine species specifically, using GBIF and Tropicos data.

The news feed aggregates forestry and conservation stories from CIFOR, Rainforest Action Network, Global Forest Watch, and others — because staying informed is part of caring.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth & Database | [Supabase](https://supabase.com) |
| Plant Data | [Trefle API](https://trefle.io), [Perenual API](https://perenual.com), [GBIF](https://gbif.org), [Tropicos](https://tropicos.org) |
| News | CIFOR · RAN · Forest Trends · SFI · Global Forest Watch · Greenpeace (RSS) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Icons | [Lucide React](https://lucide.dev) |
| Deployment | Vercel |

---

## Local setup

```bash
git clone https://github.com/httpsdave/dendro.git
cd dendro
npm install
cp .env.example .env.local   # fill in your API keys
npm run dev
```

> **Required env vars:** `TREFLE_API_TOKEN`, `PERENUAL_API_KEY`, `TROPICOS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

<div align="center">
  <sub>Built by <a href="https://github.com/httpsdave">httpsdave</a></sub>
</div>

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
