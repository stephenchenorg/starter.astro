# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup and Installation
- **Install dependencies**: `yarn` (requires Node.js 22.x and Yarn 1.22.22)
- **Environment setup**: Copy `.env.example` to `.env` and set `SECRET_KEY_BASE` using `openssl rand -hex 64`

### Development Server
- **Development**: `yarn dev` or `npm run dev`
- **Staging mode**: `yarn dev --mode staging`
- **Production mode**: `yarn dev --mode production`

### Build and Preview
- **Build**: `yarn build` or `npm run build` (includes Astro type checking)
- **Staging build**: `yarn build --mode staging`
- **Production build**: `yarn build --mode production`
- **Preview**: `yarn preview` or `npm run preview`

### Code Quality
- **Lint**: `yarn lint` or `npm run lint`
- **Lint with auto-fix**: `yarn lint --fix`

### Storybook
- **Development**: `yarn storybook` or `npm run storybook` (runs on port 6006)
- **Build**: `yarn build-storybook` or `npm run build-storybook`

## Architecture Overview

### Tech Stack
- **Framework**: Astro 5.x with Vue 3 integration and server-side rendering
- **Deployment**: Netlify adapter with server output
- **Styling**: TailwindCSS 4.x with Flowbite components
- **Icons**: Unplugin Icons with Vue 3 compiler
- **Session Management**: Astro Cookie Session with custom middleware
- **Development Tools**: Storybook for component development, ESLint for code quality

### Project Structure
- **Pages**: `/src/pages/` - Astro pages and API routes
- **Components**: `/src/components/` - Reusable Vue components, UI components in `/src/components/ui/`
- **Layouts**: `/src/layouts/` - Astro layout components with partials in `/layouts/partials/`
- **Middleware**: `/src/middleware/` - Request processing pipeline (origin check, guest handling, auth)
- **Types**: `/src/types/` - TypeScript type definitions (alert, api, user types included)
- **Utils**: `/src/utils/` - Utility functions for formatting, logging, and class names
- **Styles**: `/src/styles/` - Global CSS and theme configuration
- **Theme**: `/src/theme/` - Theme provider and configuration for dynamic theming

### Middleware Pipeline
The middleware runs in sequence: `originCheck` → `guest` → `auth`. Custom origin checking is implemented instead of Astro's built-in security feature.

### Theme System
Uses CSS custom properties with TailwindCSS for dynamic theming. Primary, secondary, and accent colors are configurable through CSS variables.

### Key Configuration
- **Path aliases**: `@/*` maps to `./src/*`
- **TypeScript**: Strict configuration with Vue 3 JSX support
- **Build format**: File-based output with trailing slash handling disabled
- **Environment variables**: Configured through `src/site.config.ts` with API base URL and GA4 tracking