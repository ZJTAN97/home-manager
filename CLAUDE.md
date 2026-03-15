# AGENTS.md - Home Manager

Guidelines for AI agents working in this repository.

## Project Overview

Home Manager is a household management PWA with a React frontend (web) and Hono API (api). Uses pnpm workspaces.

## Build Commands

```bash
# Install dependencies
pnpm install

# Web package (React + Vite)
cd web && pnpm dev          # Start dev server
cd web && pnpm build        # Production build (tsc -b && vite build)
cd web && pnpm preview      # Preview production build

# API package (Hono + Node)
cd api && pnpm dev          # Start dev server with hot reload (tsx watch)
cd api && pnpm build        # Compile TypeScript
cd api && pnpm start        # Run compiled output
```

## Lint/Format Commands

```bash
# Format all files
pnpm biome format --write .

# Check formatting
pnpm biome format .

# Lint all files
pnpm biome lint .

# Lint and apply safe fixes
pnpm biome lint --write .

# Check both lint and format
pnpm biome check .

# Check and auto-fix
pnpm biome check --write .
```

**Note**: There is no test runner configured. The `web` package has an unused `lint` script referencing ESLint - ignore it. Use Biome commands above.

## Code Style Guidelines

### Formatting (Biome)

- **Indent**: 2 spaces (never tabs)
- **Line width**: 80 characters
- **Line ending**: LF (`\n`)
- **Quotes**: Double quotes for strings/JSX
- **Semicolons**: Always required
- **Trailing commas**: ES5 style (objects/arrays only)
- **Arrow functions**: Always use parentheses `(x) => {}`
- **Bracket spacing**: `true` (e.g., `{ foo: bar }`)
- **Bracket same line**: `false` (braces on new line for multi-line)

### Import Organization

Biome auto-organizes imports. Keep these patterns:

```typescript
// 1. External dependencies (sorted alphabetically)
import { Hono } from "hono";
import React from "react";

// 2. Internal absolute imports (using @/ alias in web)
import { LayoutShell } from "@/components/LayoutShell";

// 3. Relative imports
import { helper } from "./utils";
```

**Web package**: Use `@/` alias for imports from `src/` directory.

### Naming Conventions

- **Components**: PascalCase (e.g., `LayoutShell.tsx`, `UserProfile`)
- **Hooks**: camelCase with `use` prefix (e.g., `useStorage.ts`)
- **Utils/Helpers**: camelCase (e.g., `formatDate.ts`)
- **Types/Interfaces**: PascalCase (e.g., `UserData`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Route files**: Use TanStack Router conventions
  - `route.tsx` - Route definition
  - `-page/PageName.tsx` - Page component
  - `-components/` - Route-specific components

### TypeScript Guidelines

- **Strict mode**: Enabled in both packages
- **No `any`**: Avoid explicit `any` (Biome warns on this)
- **Explicit returns**: Public functions should have return types
- **Unused variables**: Biome warns on unused variables/imports
- **Path aliases**:
  - Web: `@/*` maps to `./src/*`
  - API: No path aliases configured

### React Patterns

- **Functional components** only (no class components)
- **React Compiler**: Enabled via babel plugin
- **JSX**: Use double quotes in JSX attributes
- **Hooks**: Follow rules of hooks
- **File extensions**: `.tsx` for components, `.ts` for utilities

### Error Handling

- Use Zod for runtime validation (both packages have zod)
- API uses Hono's built-in error handling
- Prefer early returns over nested conditionals

## Project Structure

```
/
├── web/                    # React frontend (Vite + PWA)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── routes/         # TanStack Router routes
│   │   │   ├── -components/  # Route-specific components
│   │   │   └── (group)/      # Route groups
│   │   ├── hooks/          # Custom React hooks
│   │   └── types.ts        # Global types
│   └── public/             # Static assets
├── api/                    # Hono backend
│   └── src/
│       └── index.ts        # Entry point
└── biome.json              # Lint/format config (root)
```