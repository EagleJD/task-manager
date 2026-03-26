# Project Guide

This file is intended for coding agents working in this repository.
Read this before making UI, build, or data model changes.

## Project Summary

- Project name: `task-manager`
- Stack: Next.js App Router, React, Neon Postgres
- Product shape: diary-themed task manager with a Kuromi sticker collage background
- Current product tone: cute, dense, decorative, scrapbook-like, but still usable as a real task manager

## Current Product Goal

The app should feel like a personal diary page covered with Kuromi stickers, while still functioning as a reliable task manager.

The user wants:

- A background that feels packed with Kuromi stickers, with very little empty space
- Sticker placement that feels clustered and organic, not obviously repeated in rows
- A diary/scrapbook visual direction rather than a generic productivity dashboard
- Top-of-page bookmark decorations that sit at the top of the webpage, not inside the title card
- Consistent category/tag handling between the task creation form and rendered task cards
- A clean, working production build

## Visual Direction

### Background stickers

- Prefer dense sticker coverage over minimalism
- Avoid obvious vertical or horizontal repetition
- Avoid large empty gaps between clusters
- Keep sticker opacity consistent unless there is a very strong reason not to
- Keep sticker sizes within a fairly narrow range
- Use local image assets when possible
- Kuromi sticker assets currently live in `public/kuromi-stickers/`

### Layout mood

- The page should feel like a decorated diary or scrapbook
- Decorative elements should feel intentional, tactile, and a little dimensional
- Bookmarks should look like physical paper/plastic tabs with depth, not simple flat pills
- Bookmarks belong at the very top of the page
- The hero/title card should remain readable despite the busy background

### Things to avoid

- Repetitive wallpaper-like sticker placement
- Large transparent or empty background zones
- Generic SaaS-looking layouts
- Putting bookmark tabs inside the hero card
- Huge variation in sticker scale unless explicitly requested

## System Direction

### Build and config

- Keep `next.config.mjs` compatible with Next.js 16 conventions
- Preserve the `turbopack.root` fix
- If image sourcing changes, prefer approaches that do not reintroduce unstable remote image build issues

### Task data

- Categories must stay normalized and consistent across:
  - form options
  - API writes
  - API reads
  - task card rendering
- Current normalized categories are:
  - `work`
  - `personal`
  - `study`

## Current Important Files

- `src/components/TaskManager.js`
- `src/components/KuromiStickers.js`
- `src/lib/taskOptions.js`
- `src/app/page.js`
- `src/app/globals.css`
- `src/app/api/tasks/route.js`
- `next.config.mjs`

## Working Rules For Agents

- Check the local Next.js docs under `node_modules/next/dist/docs/` before making framework-sensitive changes
- Preserve the diary/Kuromi visual identity unless the user asks for a redesign
- Validate with `npm run lint` and `npm run build` after meaningful changes
- Do not silently undo visual density in the background
- Do not break tag/category normalization
- Prefer incremental refinement over broad redesigns unless requested

## Current Status

As of now, the project already has:

- working task CRUD
- due date editing
- priority columns
- normalized category handling
- local Kuromi PNG sticker assets
- dense background sticker rendering
- top-of-page bookmark decorations
- successful lint/build verification

## If You Need To Extend The Design

- Add more local Kuromi sticker assets instead of relying only on remote GIFs
- Increase density by adding more cluster centers before increasing size variance
- Protect readability of the main content with layering, contrast, and soft surfaces
- Keep decorative changes mobile-aware
