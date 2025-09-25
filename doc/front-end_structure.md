# SkillSwap Frontend Architecture & Logic

## Overview
SkillSwap’s frontend is a React + TypeScript application, organized for scalability and maintainability. It uses Vite for fast development, Supabase for authentication, and mock data for most end-points logic during development.

## Folder Structure
- `src/components/` – All UI components (pages, modals, buttons, cards, etc.)
- `src/contexts/` – React Contexts for global state (e.g., AppContext for navigation, auth, theme)
- `src/lib/` – Utility modules and mock data (`mock-data.ts`)
- `src/utils/supabase/` – Supabase client setup for authentication
- `src/styles/` – Global and component CSS
- `src/types/` – Shared TypeScript types

## Main Logic
- **Routing:** Page navigation is managed by a custom state (`currentPage`) in `AppContext`. No external router is used; instead, conditional rendering switches between pages.
- **Authentication:** 
  - Google sign-in uses Supabase OAuth (`supabase.auth.signInWithOAuth`).
  - Other login/signup flows use mock data for development.
- **Mock Data:** Workshops, users, and transactions are loaded from `mock-data.ts` for fast prototyping.
- **UI Components:** 
  - Reusable UI elements (Button, Card, Badge, etc.) are in `components/ui/`.
  - Main pages (Hero, AuthPage, Dashboard, etc.) are in `components/`.
- **State Management:** 
  - `AppContext` provides global state: user, navigation, theme, and mock data.
  - Local state (e.g., modal open/close) is managed with React’s `useState`.

## Key Flows
- **Hero Page:** Displays featured workshops (from mock data), navigation bar, and CTA buttons.
- **AuthPage:** Handles sign-in/sign-up, including Google OAuth.
- **Workshop Logic:** All workshop data is read from mock data; actions like “Join” update local state only.

## Development Notes
- All business logic is currently frontend-only, with mock data for non-auth features.
- Supabase is only used for Google authentication.
- Easily extendable to connect more features to Supabase or a backend API.

## To DO
- [] Rest API to connect with backend in lib/ api.ts
- [] edit pop up for profile reviews
- [] Direct link to AuthPage from hero Page

### Entire Page
- [] Explore Workshop 
- [] Create Workshop need API first
- [] Dashborad mock-data set up 

### Extra Extension Feature
- [] Leader Boards
- [] Reviews