# MahaSetu

**One Government. One Experience.**

A frontend-only prototype of a citizen-centric government interoperability platform, built for Smart India Hackathon.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo flow

1. Open homepage — search "scholarship"
2. View service details → Check eligibility
3. See eligibility result → Start application
4. Notice pre-filled profile data → Submit
5. Go to My Applications → View timeline

## Tech stack

- React 19 + TypeScript
- React Router
- CSS design system (no Tailwind)
- Mock data + localStorage persistence

## Project structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── data/           # Mock data (replaceable with APIs)
├── services/       # Data access layer
├── context/        # App state
├── types/          # TypeScript types
├── utils/          # i18n helpers
└── styles/         # Design system CSS
```

## Note

This is a **prototype only**. No backend, authentication, or real government integrations are included.
