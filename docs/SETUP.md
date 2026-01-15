# Compound — Setup & Development Guide

This document covers technical setup, tooling, and conventions for the Compound project.

For product vision and invariants, see [README.md](../README.md).

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173/`

---

## Stack

* **Vite** — Build tool and dev server
* **React 19** — UI framework
* **TypeScript** — Type safety (strict mode enabled)
* **Tailwind CSS** — Utility-first styling
* **shadcn/ui** — Composable, accessible component system
* **Zustand** — Lightweight state management (used for document + view state)
* **lucide-react** — Icon library

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all files |
| `npm run format` | Format all source files with Prettier |
| `npm run format:check` | Check formatting without modifying files |
| `npm run typecheck` | Run TypeScript compiler without emitting files |

---

## Project Structure

```
src/
  app/              # Application shell and page components
  components/
    ui/             # shadcn/ui components (Button, Card, etc.)
    common/         # App-specific reusable components
  domain/           # Core types and business logic
  lib/              # Utility functions (cn, helpers)
  stores/           # Zustand stores (document, view, spec)
  styles/           # Global CSS (if needed beyond index.css)
  main.tsx          # App entry point
  App.tsx           # Root component

public/             # Static assets
docs/               # Documentation and ADRs
```

---

## Path Aliasing

The project uses `@/*` for clean imports:

```typescript
// ✅ Do this
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ❌ Avoid this
import { Button } from "../../components/ui/button"
```

Configured in:
- `tsconfig.app.json` (`paths`)
- `vite.config.ts` (`resolve.alias`)

---

## Styling Conventions

### Tailwind CSS

* **Grayscale by default** — No color unless explicitly needed
* **Design tokens** — Use CSS variables defined in `src/index.css`
* **Utility-first** — Compose styles with Tailwind classes
* **Responsive** — Use Tailwind breakpoints (`sm:`, `md:`, `lg:`)

### CSS Variables

Theme tokens are defined in `src/index.css`:

```css
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--border, --input, --ring
--radius
```

Light and dark mode variants are included.

### Using `cn()`

The `cn()` utility (from `@/lib/utils`) merges Tailwind classes safely:

```typescript
import { cn } from "@/lib/utils"

<div className={cn("base-class", isActive && "active-class", className)} />
```

---

## Adding shadcn/ui Components

shadcn/ui components are **not installed via npm**. They are copied into the project as source files.

### Manual Installation (Current Approach)

1. Find the component on [ui.shadcn.com](https://ui.shadcn.com/)
2. Copy the source code into `src/components/ui/`
3. Install any required dependencies (e.g., `@radix-ui/*`)
4. Import and use: `import { Button } from "@/components/ui/button"`

### Currently Installed Components

- **Button** — `src/components/ui/button.tsx`
- **Card** — `src/components/ui/card.tsx`

### Dependencies

Most shadcn components require:

```bash
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
```

(Already installed in this project.)

---

## Code Quality

### TypeScript

* Strict mode enabled
* No unused variables/parameters
* Explicit types for all exports
* Use `type` imports where possible

### ESLint

* React Hooks rules enforced
* React Refresh compatibility checked
* Prettier integration for formatting

### Prettier

Configuration in `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

---

## State Management

Compound uses **Zustand** for state management, split into logical slices:

* `document.store.ts` — Document graph and node CRUD
* `view.store.ts` — UI state (selection, focus, collapsed nodes)
* `spec.store.ts` — Spec surface logic (lifted references)

**Key principle**: Document state and view state are separate.

* Document changes are persisted
* View changes are ephemeral (unless explicitly saved)

---

## Development Workflow

### Before Committing

```bash
npm run format       # Auto-format all files
npm run lint         # Check for linting issues
npm run typecheck    # Verify types
npm run build        # Ensure production build works
```

### Adding a New Feature

1. Define types in `src/domain/types.ts` (if needed)
2. Add store logic in `src/stores/` (if stateful)
3. Build UI components in `src/components/`
4. Wire up in `src/app/` or `src/App.tsx`
5. Verify no lint/type errors
6. Test manually in dev server

---

## Environment Setup

### Node Version

Use Node.js **18+** or **20+** (LTS recommended).

### Editor

**VS Code** recommended with these extensions:

* ESLint
* Prettier
* Tailwind CSS IntelliSense
* TypeScript and JavaScript Language Features (built-in)

EditorConfig is included (`.editorconfig`) for consistent formatting.

---

## Build & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/`

### Serving Production Build Locally

```bash
npm run preview
```

### Deployment

The project is a **static site** and can be deployed to:

* Vercel
* Netlify
* GitHub Pages
* Any static host

No server-side logic required.

---

## Troubleshooting

### Dev server won't start

* Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
* Check Node version: `node -v` (should be 18+)

### TypeScript errors in IDE

* Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"
* Verify `tsconfig.app.json` is correct

### Tailwind classes not working

* Ensure `index.css` imports Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
* Check `tailwind.config.js` content paths include your files

### shadcn component not found

* Verify the component file exists in `src/components/ui/`
* Check that all Radix UI dependencies are installed
* Ensure `@/*` path alias is working (restart dev server)

---

## Next Steps

* Add more shadcn/ui components as needed
* Set up React Router (if multi-page navigation is required)
* Add tests (Vitest + React Testing Library recommended)
* Configure CI/CD pipeline

---

## References

* [Vite Documentation](https://vite.dev/)
* [React Documentation](https://react.dev/)
* [Tailwind CSS Documentation](https://tailwindcss.com/)
* [shadcn/ui Components](https://ui.shadcn.com/)
* [Zustand Documentation](https://zustand-demo.pmnd.rs/)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/)
