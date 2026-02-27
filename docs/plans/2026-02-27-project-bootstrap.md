# AI Dev Team Simulation — Project Bootstrap Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a production-ready Vite + React + TypeScript SPA with TanStack suite, MSW, Tailwind CSS, ESLint/Prettier, GitHub Issue templates, and project conventions docs.

**Architecture:** Single-page app bootstrapped with Vite. Routing handled by TanStack Router (file-based). Server state via TanStack Query backed by MSW handlers in development. TanStack Table/Form/Virtual for heavy data UI. Tailwind CSS for styling.

**Tech Stack:** Vite 6, React 19, TypeScript 5, TanStack Router, TanStack Query, TanStack Table, TanStack Form, TanStack Virtual, MSW 2, Tailwind CSS 4, ESLint 9 (flat config), Prettier 3

---

## Task 1: Git init + pnpm init

**Files:**
- Create: `.gitignore`

**Step 1: Init git repo**

```bash
cd /Users/fabiovedovelli/Code/ai-dev-team-simulation
git init
```

Expected: `Initialized empty Git repository`

**Step 2: Init pnpm**

```bash
pnpm init
```

Expected: `package.json` created.

**Step 3: Create `.gitignore`**

Create `/Users/fabiovedovelli/Code/ai-dev-team-simulation/.gitignore`:

```gitignore
node_modules/
dist/
.env
.env.local
*.local
.DS_Store
coverage/
```

**Step 4: Commit**

```bash
git add .gitignore package.json
git commit -m "chore: init repo"
```

---

## Task 2: Vite + React + TypeScript scaffold

**Files:**
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/vite-env.d.ts`

**Step 1: Install core deps**

```bash
pnpm add react react-dom
pnpm add -D vite @vitejs/plugin-react-swc typescript @types/react @types/react-dom
```

**Step 2: Create `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Dev Team Simulation</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 3: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
})
```

**Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 5: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**Step 6: Create `src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

**Step 7: Create `src/main.tsx` (placeholder — Router will replace this in Task 4)**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div>Bootstrapping...</div>
  </React.StrictMode>,
)
```

**Step 8: Update `package.json` scripts**

Add under `"scripts"` in `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

**Step 9: Verify dev server starts**

```bash
pnpm dev
```

Expected: `Local: http://localhost:5173/` with "Bootstrapping..." visible. Stop with Ctrl+C.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: vite + react + typescript scaffold"
```

---

## Task 3: Tailwind CSS 4

**Files:**
- Create: `src/index.css`
- Modify: `src/main.tsx` (add CSS import)
- Modify: `vite.config.ts` (add Tailwind plugin)

**Step 1: Install Tailwind**

```bash
pnpm add tailwindcss @tailwindcss/vite
```

**Step 2: Add Tailwind plugin to `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
  },
})
```

**Step 3: Create `src/index.css`**

```css
@import "tailwindcss";
```

**Step 4: Import CSS in `src/main.tsx`**

Add `import './index.css'` as the first import.

**Step 5: Verify Tailwind works**

Temporarily change `src/main.tsx` to:

```tsx
<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
  <p className="text-2xl font-bold">Tailwind OK</p>
</div>
```

Run `pnpm dev` and confirm dark background + white text. Then revert to plain `<div>Bootstrapping...</div>`.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: tailwind css 4"
```

---

## Task 4: TanStack Router

**Files:**
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx`
- Create: `src/routeTree.gen.ts` (auto-generated — commit after first gen)
- Modify: `src/main.tsx`
- Modify: `vite.config.ts`

**Step 1: Install TanStack Router**

```bash
pnpm add @tanstack/react-router
pnpm add -D @tanstack/router-plugin @tanstack/router-devtools
```

**Step 2: Add router plugin to `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TanStackRouterVite({ routesDirectory: './src/routes' }), react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
  },
})
```

**Step 3: Create `src/routes/__root.tsx`**

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})
```

**Step 4: Create `src/routes/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">AI Dev Team Simulation</h1>
    </main>
  )
}
```

**Step 5: Replace `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './index.css'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```

**Step 6: Run dev to trigger route generation**

```bash
pnpm dev
```

Expected: `routeTree.gen.ts` auto-generated, home page renders. Devtools panel visible at bottom. Stop with Ctrl+C.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: tanstack router with file-based routing"
```

---

## Task 5: TanStack Query

**Files:**
- Modify: `src/main.tsx`

**Step 1: Install TanStack Query**

```bash
pnpm add @tanstack/react-query
pnpm add -D @tanstack/react-query-devtools
```

**Step 2: Wrap app with QueryClientProvider in `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { routeTree } from './routeTree.gen'
import './index.css'

const queryClient = new QueryClient()
const router = createRouter({ routeTree, context: { queryClient } })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  </React.StrictMode>,
)
```

**Step 3: Update router context type in `src/routes/__root.tsx`**

```tsx
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { QueryClient } from '@tanstack/react-query'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: tanstack query with devtools"
```

---

## Task 6: TanStack Table, Form, Virtual

**Step 1: Install remaining TanStack packages**

```bash
pnpm add @tanstack/react-table @tanstack/react-form @tanstack/react-virtual
```

**Step 2: Verify they import cleanly — add a smoke-test import to `src/routes/index.tsx` temporarily**

Add at the top (DO NOT render anything, just ensure no TS errors):

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { useForm } from '@tanstack/react-form'
import { useVirtualizer } from '@tanstack/react-virtual'

// Suppress unused import errors during smoke test
void useReactTable
void useForm
void useVirtualizer
```

Run `pnpm build` — expected: success with no errors. Then remove those lines.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: tanstack table, form, virtual installed"
```

---

## Task 7: MSW (Mock Service Worker)

**Files:**
- Create: `src/mocks/handlers.ts`
- Create: `src/mocks/browser.ts`
- Create: `public/mockServiceWorker.js` (generated)
- Modify: `src/main.tsx`

**Step 1: Install MSW**

```bash
pnpm add -D msw
```

**Step 2: Generate SW file**

```bash
pnpm dlx msw init public/ --save
```

Expected: `public/mockServiceWorker.js` created, `package.json` updated with `"msw": { "workerDirectory": "public" }`.

**Step 3: Create `src/mocks/handlers.ts`**

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
]
```

**Step 4: Create `src/mocks/browser.ts`**

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

**Step 5: Start MSW in `src/main.tsx` before rendering**

Add before `ReactDOM.createRoot(...)`:

```typescript
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(/* ... */)
})
```

Wrap the existing `ReactDOM.createRoot` call inside the `.then()` callback.

**Step 6: Verify MSW works**

Run `pnpm dev`, open browser console. Expected: `[MSW] Mocking enabled.`

Also run in browser console:
```javascript
fetch('/api/health').then(r => r.json()).then(console.log)
```
Expected: `{ status: 'ok' }`

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: msw mock service worker setup"
```

---

## Task 8: ESLint + Prettier

**Files:**
- Create: `eslint.config.ts`
- Create: `.prettierrc`
- Create: `.prettierignore`

**Step 1: Install ESLint + plugins**

```bash
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

**Step 2: Install Prettier**

```bash
pnpm add -D prettier eslint-config-prettier
```

**Step 3: Create `eslint.config.ts`**

```typescript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'src/routeTree.gen.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  prettier,
)
```

**Step 4: Create `.prettierrc`**

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

**Step 5: Create `.prettierignore`**

```
dist/
node_modules/
public/mockServiceWorker.js
src/routeTree.gen.ts
```

**Step 6: Add scripts to `package.json`**

```json
"lint": "eslint . --report-unused-disable-directives --max-warnings 0",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

**Step 7: Run lint and format**

```bash
pnpm lint
pnpm format
```

Expected: no errors.

**Step 8: Commit**

```bash
git add -A
git commit -m "chore: eslint flat config + prettier"
```

---

## Task 9: GitHub Issue Templates

**Files:**
- Create: `.github/ISSUE_TEMPLATE/bug_report.md`
- Create: `.github/ISSUE_TEMPLATE/feature_request.md`
- Create: `.github/ISSUE_TEMPLATE/task.md`

**Step 1: Create `.github/ISSUE_TEMPLATE/bug_report.md`**

```markdown
---
name: Bug Report
about: Something is broken
labels: bug
---

## Describe the Bug
<!-- Clear description of what is wrong -->

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
<!-- What should happen -->

## Actual Behavior
<!-- What actually happens -->

## Screenshots / Logs
<!-- Attach if applicable -->

## Environment
- OS:
- Browser:
- App version:
```

**Step 2: Create `.github/ISSUE_TEMPLATE/feature_request.md`**

```markdown
---
name: Feature Request
about: Suggest a new feature
labels: enhancement
---

## Summary
<!-- One sentence: what and why -->

## Motivation
<!-- What problem does this solve? -->

## Proposed Solution
<!-- How should it work? -->

## Alternatives Considered
<!-- Other approaches you've thought of -->

## Acceptance Criteria
- [ ] ...
- [ ] ...
```

**Step 3: Create `.github/ISSUE_TEMPLATE/task.md`**

```markdown
---
name: Task
about: Engineering task or chore
labels: task
---

## What needs to be done
<!-- Describe the work -->

## Why
<!-- Context / business reason -->

## Definition of Done
- [ ] ...
- [ ] ...
```

**Step 4: Commit**

```bash
git add .github/
git commit -m "chore: github issue templates"
```

---

## Task 10: CLAUDE.md — Project Conventions

**Files:**
- Create: `CLAUDE.md`

**Step 1: Create `CLAUDE.md`**

```markdown
# AI Dev Team Simulation — Claude Code Conventions

## Project Overview
A React SPA that simulates an AI-powered development team workflow. Built with Vite + React 19 + TypeScript.

## Tech Stack
| Layer | Library |
|---|---|
| Build | Vite 6 + @vitejs/plugin-react-swc |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Routing | TanStack Router (file-based, `src/routes/`) |
| Server State | TanStack Query |
| Tables | TanStack Table |
| Forms | TanStack Form |
| Virtualisation | TanStack Virtual |
| Styling | Tailwind CSS 4 |
| API Mocking | MSW 2 |
| Linting | ESLint 9 flat config (`eslint.config.ts`) |
| Formatting | Prettier 3 (`.prettierrc`) |
| Package Manager | pnpm |

## Key Commands
```bash
pnpm dev          # dev server (MSW enabled automatically)
pnpm build        # tsc -b && vite build
pnpm preview      # preview production build
pnpm lint         # eslint with zero warnings
pnpm format       # prettier --write .
pnpm format:check # check formatting without writing
```

## File Conventions
- **Routes:** `src/routes/<name>.tsx` — TanStack Router auto-generates `src/routeTree.gen.ts` (do not edit)
- **API handlers:** `src/mocks/handlers.ts` — add MSW handlers here
- **Components:** `src/components/<FeatureName>/<ComponentName>.tsx`
- **Hooks:** `src/hooks/use<HookName>.ts`
- **Types:** `src/types/<domain>.ts`

## Code Style
- No semicolons, single quotes, 100 char line width (Prettier enforces)
- TypeScript strict mode — no `any`, no unused vars
- Named exports only (no default exports except route files)
- Co-locate tests with source: `src/components/Foo/Foo.test.tsx`

## MSW Usage
- Handlers live in `src/mocks/handlers.ts`
- MSW only starts in `import.meta.env.DEV`
- Use `http.get/post/put/delete` from `msw`, return `HttpResponse.json()`

## TanStack Router
- File-based routing: new page = new file in `src/routes/`
- Root layout: `src/routes/__root.tsx`
- Access QueryClient via router context: `const { queryClient } = Route.useRouteContext()`
- `routeTree.gen.ts` is auto-generated — never edit manually

## Git Conventions
- Branch naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`
- Commit format: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`
- PRs must pass lint + type check before merge
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: claude.md project conventions"
```

---

## Task 11: README.md

**Files:**
- Create: `README.md`

**Step 1: Create `README.md`**

```markdown
# AI Dev Team Simulation

A web application that simulates a collaborative AI-powered software development team. Visualise agent roles, task queues, sprint boards, and real-time code generation workflows — all in the browser, with a fully mocked backend.

## Features (planned)
- **Agent Dashboard** — see each AI agent's current role, status, and output
- **Task Board** — kanban view of issues assigned to agents (TanStack Table + Virtual)
- **Sprint Planner** — create and assign tasks via TanStack Form
- **Live Feed** — real-time stream of agent actions and decisions
- **Mock API** — all data served via MSW; no backend required

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 6 |
| Language | TypeScript 5 |
| Routing | TanStack Router |
| Data Fetching | TanStack Query |
| Tables | TanStack Table |
| Forms | TanStack Form |
| Virtualisation | TanStack Virtual |
| Styling | Tailwind CSS 4 |
| Mocking | MSW 2 |

## Getting Started

### Prerequisites
- Node.js ≥ 20
- pnpm ≥ 9

### Install
```bash
pnpm install
```

### Dev
```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). The mock API starts automatically via MSW.

### Build
```bash
pnpm build
pnpm preview
```

### Lint & Format
```bash
pnpm lint
pnpm format
```

## Project Structure
```
src/
├── routes/          # TanStack Router pages (file-based)
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── mocks/           # MSW handlers and browser worker
└── types/           # Shared TypeScript types
```

## Contributing
See [CLAUDE.md](./CLAUDE.md) for code conventions.
Use GitHub Issues (bug / feature / task templates in `.github/ISSUE_TEMPLATE/`).
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: readme with app description and setup guide"
```

---

## Task 12: Final verification

**Step 1: Clean install**

```bash
rm -rf node_modules
pnpm install
```

**Step 2: Type check**

```bash
pnpm build
```

Expected: `✓ built in` — zero errors.

**Step 3: Lint**

```bash
pnpm lint
```

Expected: `0 warnings, 0 errors`.

**Step 4: Format check**

```bash
pnpm format:check
```

Expected: all files already formatted.

**Step 5: Dev server smoke test**

```bash
pnpm dev
```

Open browser → `http://localhost:5173`.
Confirm:
- Page renders "AI Dev Team Simulation"
- Browser console shows `[MSW] Mocking enabled.`
- TanStack Router devtools panel visible
- TanStack Query devtools button visible

**Step 6: Final commit if any fixups needed**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

**Step 7: Show git log**

```bash
git log --oneline
```

Expected: 11 clean commits from Task 1–11.
