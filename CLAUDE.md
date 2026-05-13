# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev              # Start dev server (tsc + vite)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # ESLint (fix warnings)
```

### Deployment
```bash
npm run deploy                    # Build + deploy all to Firebase
npm run deploy:functions          # Deploy only Firebase Functions
npm run deploy:db                 # Deploy only Firestore
npm run deploy:hosting            # Deploy only Hosting
```

### PWA Assets
```bash
npm run generate-pwa-assets   # Generate icons from public/logo.svg
```

### Firebase Functions (in functions/ directory)
```bash
cd functions
npm run build          # Build TypeScript
npm run serve          # Start emulators
npm run deploy         # Deploy functions
npm run logs           # View function logs
```

## Architecture Overview

**Climb Calendar** is a PWA for managing climbing competitions. Built with React + TypeScript + Firebase.

### Tech Stack
- **Frontend**: React 18.2, TypeScript, Vite 5.0
- **Routing**: TanStack Router (file-based)
- **State**: TanStack Query (React Query) for server state
- **UI**: Chakra UI with custom theming
- **Calendar**: FullCalendar 6.1 (month/week/day/multi-month views)
- **Backend**: Firebase (Firestore, Auth, Functions)
- **Auth**: Firebase Auth + Google Identity Services (for Google Calendar)
- **i18n**: i18next (English/Bulgarian) with Zod error localization
- **Forms**: Formik + Zod validation
- **PWA**: Vite PWA plugin with auto-update

### Provider Stack (src/main.tsx)
```
CacheProvider (TanStack Query)
  └─ ChakraProvider (UI theming)
      └─ RouterProvider (TanStack Router)
```

### Key Routes
- `/` - Home: Competition calendar with filters (type, category, date, international/balkan)
- `/add` - Admin: Add/edit competitions (auth protected)

### Data Models (src/types.ts)
- **Competition**: name, date, dateDuration (1-7 days), type (Boulder|Lead|Speed[]), category (U9-U17, YouthA/B), balkan?, international?
- **UserEvent**: Custom personal planning events (dateDuration 1-20 days)
- **ViewMode**: calendar, table, list, calendar2

### Firebase Structure
- **Collections**: `competitions`, `userEvents`, `adminUsers`
- **Functions**: Auto-assigns admin role on user creation (neshev.rumenn@gmail.com)
- **Auth**: Google OAuth + Facebook OAuth

### State Management Patterns
- **TanStack Query**: All server state (src/cache/)
- **Local Storage**: User preferences (language, view mode)
- **Formik + Zod**: Type-safe forms with i18n errors

### Localization Workflow
When updating `/public/locales/{{lng}}.json`, increment version in `i18n.ts` - translations cached in localStorage.

### Google Calendar Integration
Uses Google Identity Services (GIS) for OAuth, not just Firebase Auth. Loads:
- `https://apis.google.com/js/api.js` (GAPI)
- `https://accounts.google.com/gsi/client` (GIS)

Requires CLIENT_ID from Google OAuth app (implicit token flow - short-lived access tokens).

### Firebase Hosting Setup
Site configured as custom target "main" → climbcalendar.web.app (not project-ID default).
