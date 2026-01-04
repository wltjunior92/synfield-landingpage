# AI Coding Agent Instructions - Synfield Landing Page

## Project Overview

Synfield is a React + TypeScript institutional landing page for a field control and traceability SaaS platform. The site is built with Vite, styled with Tailwind CSS, and targets a Portuguese-speaking audience (pt-BR).

## Architecture & Component Structure

### Main App Flow

The app follows a **single-page scroll layout** ([src/App.tsx](src/App.tsx)). Components are rendered in sequence to create a seamless scrolling experience:

```
Header (fixed nav) → Hero → ProblemSolver → HowItWorks → TargetAudience → Features → SecuritySection → AboutCrivora → ContactCTA → Footer
```

Each section component is self-contained and responsible for its own styling and layout.

### Key Directories

- **`src/components/`** - All UI sections (Header, Hero, Features, etc.). Each component is a standalone `.tsx` file with no state management beyond local React hooks.
- **`src/utils/constants.tsx`** - Single source of truth for content data (NAV_LINKS, FEATURES, STEPS, etc.). Update here when changing text, labels, or icon references.
- **`src/types/index.ts`** - TypeScript interfaces (NavLink, FeatureCardProps, StepCardProps, TargetAudienceProps).
- **`src/styles/globals.css`** - Custom CSS variables and Tailwind extensions (synfield-green: #0a3622, synfield-graphite: #2d2d2d).

## Styling & Design System

### Custom Colors

Use custom Tailwind classes defined in [src/styles/globals.css](src/styles/globals.css):

- **`.bg-synfield-green` / `.text-synfield-green`** - Primary brand green (#0a3622)
- **`.bg-synfield-graphite` / `.text-synfield-graphite`** - Secondary dark gray (#2d2d2d)
- Generic Tailwind utilities for secondary colors (emerald, gray, etc.)

### Button Component Pattern

The reusable [src/components/Button.tsx](src/components/Button.tsx) defines three variants:

- `primary` - Green background with white text
- `secondary` - Graphite background
- `outline` - Transparent with green border

All buttons extend `React.ButtonHTMLAttributes<HTMLButtonElement>`, enabling flexible integration.

### Responsive Design

Breakpoint usage: `md:` prefix for medium screens and up. Example: `hidden md:flex`, `md:text-base`.

## Development Workflow

### Commands

```bash
npm run dev      # Start Vite dev server (port 3000, all interfaces)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Environment Variables

The project expects `GEMINI_API_KEY` in `.env` file (used in [vite.config.ts](vite.config.ts)). This is injected as `process.env.GEMINI_API_KEY` in the frontend.

### Build Process

- **TypeScript**: Strict mode enabled. Runs `tsc -b` before Vite build to catch type errors early.
- **ESLint**: Uses Rocketseat config with React hooks and import sorting plugins.
- **Vite**: Path alias `@` resolves to `./src`.

## Common Patterns & Conventions

### Component Structure

All components follow this pattern:

```typescript
import { Icon } from 'lucide-react'
import { CONSTANTS } from '../utils/constants'
import { Button } from './Button'

export const ComponentName: React.FC = () => {
  // minimal state if needed
  return (
    <section id="section-id" className="...tailwind classes...">
      {content}
    </section>
  )
}
```

### Content Data

Content (copy, links, feature lists) lives in [src/utils/constants.tsx](src/utils/constants.tsx). Components import and map over these constants. This decouples content from presentation and makes multi-language support straightforward.

### Type Safety

All props are typed via interfaces in [src/types/index.ts](src/types/index.ts). Add new interfaces here, not inline in components.

### Icon Usage

Use Lucide React icons (e.g., `import { Camera } from 'lucide-react'`). Icons are pre-rendered in constants to avoid runtime overhead.

## Integration Points & External Dependencies

### Gemini API

Environment variable `GEMINI_API_KEY` is prepared for potential AI features but not currently used in visible components.

### Navigation & Anchors

Navigation links in the header use `href="#section-id"` for smooth scroll. Section components set matching `id` attributes (e.g., `id="produto"`, `id="como-funciona"`). Update NAV_LINKS in constants when adding new sections.

### Email Integration

Contact/demo CTAs use `mailto:` links with the CONTACT_EMAIL constant. Update [src/utils/constants.tsx](src/utils/constants.tsx) to change contact email globally.

## Code Quality & Best Practices

- **No external state management** - All components use React hooks (useState, useEffect) only.
- **Accessibility**: Use semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`). Ensure color contrast meets WCAG standards.
- **TypeScript strict mode** - All files must pass type checking.
- **Functional components** - No class components in this codebase.
- **Clean imports** - ESLint enforces simple-import-sort for consistent ordering.

## Debugging & Common Issues

### Dev Server Won't Start

Ensure `npm install` completes and port 3000 is available. The config binds to `0.0.0.0` to support remote access during development.

### Type Errors on Build

Run `npm run build` locally before pushing. `tsc -b` fails early if interfaces in [src/types/index.ts](src/types/index.ts) don't match component props.

### Styling Not Applied

Verify custom colors use the exact class names from [src/styles/globals.css](src/styles/globals.css). Tailwind PurgeCSS only includes classes referenced in source; typos will be stripped.

---

**Last updated:** December 27, 2025
