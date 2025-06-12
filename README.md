# Meme generator

![Vercel Deploy](https://deploy-badge.vercel.app/vercel/reactions-demo?url=https://meme-generator.axelmathi.eu)
![CI](.github/workflows/main.yml/badge.svg?event=push)

## Introduction

Let us introduce you to **Meme Generator**, an application that allows you to create **[memes](https://en.wikipedia.org/wiki/Internet_meme)** and share them with the rest of the community.

### Tech stack

The project is built on the following stack:

- **[React](https://react.dev/)**: As a UI framework
- **[TypeScript](https://www.typescriptlang.org/)**: As a scripting language
- **[Vite](https://vitejs.dev/)**: For bundling and the development server
- **[ChakraUI](https://v2.chakra-ui.com/)**: For the design system
- **[TanStack Router](https://tanstack.com/router/latest)**: For routing
- **[TanStack Query](https://tanstack.com/query/latest)**: For async state management
- **[React Hook Form](https://react-hook-form.com/)**: For form management
- **[Vitest](https://vitest.dev/)** / **[Testing Library](https://testing-library.com/)** / **[MSW](https://mswjs.io/)**: For testing

### Setup

Start by forking this repository and cloning it locally.

Then, install the node modules:

```bash
pnpm install
```

Once the dependencies are installed, you can run the project with:

```bash
pnpm dev
```

You'll be able to access the app at `http://localhost:5173/` using the following credentials:

- Username: `MemeMaster`
- Password: `password`

To run the tests:

```bash
pnpm test
# or for coverage
pnpm coverage
```

## Instructions

> 📌 Note: This test mimics a production environment. You're encouraged to write clean code and meaningful commits. Treat it as if it's your own project — structure, rename, or refactor freely.

### ✅ Ex 1 - Review and optimize the meme feed code

- Identified root cause of slowness
- Provided detailed report: [`doc/review/meme-feed-code-review.md`](./doc/review/meme-feed-code-review.md)
- Refactored code for performance, UX maintained

✅ **Status**: Answered in expected file

---

### ✅ Ex 2 - Fix the comment form

- Bug identified and fixed (comments now persist without refresh)
- Test added at `src/__tests__/routes/_authentication/index.test.tsx`

✅ **Status**: Test added in `index.test.tsx`

---

### ✅ Ex 3 - Finish the meme creator

- Finalized form submission logic
- Ensured image upload + captions handling matches required format
- Meme creation redirects to feed after submission

✅ **Status**: Module now working, test should be added

---

### ✅ Ex 4 - Fix the authentication (bonus)

- Persisted token in `localStorage`
- Implemented logout flow on token expiration
- Auto-redirects to login on failure

✅ **Status**: Token now stored in `localStorage`

---

## ✅ Result

- ✅ Deployed preview: [https://meme-generator.axelmathi.eu/login](https://meme-generator.axelmathi.eu/login)

Pushing on main will automatically deploy a new version of this app in vercel.

---

## 🛠️ Additional Actions

- Migrated to `pnpm` as the package manager
- Removed deprecated `useDimensions` hook
- All API/service logic is now abstracted into reusable hooks (`src/hooks`)
- Added `prettier` configuration + `pnpm format` script for formatting
- Project deployed on **Vercel**, with automatic deploys on push to `main`

---

## 📁 Project Structure

```
├── doc                       # Documentation and screenshots
│   ├── review                # Exercise 1 code review output
│   └── screenshots           # UI screen references
├── src
│   ├── __tests__            # Unit tests (Vitest + Testing Library)
│   │   └── routes
│   │       └── _authentication
│   ├── components           # Reusable UI components
│   ├── config               # App-wide configurations (e.g. routes, API URLs)
│   ├── contexts             # React context providers (auth, theme, etc.)
│   ├── hooks                # Custom hooks (e.g., auth, meme logic, comments)
│   └── routes               # Application pages (login, feed, meme creator)
│       └── _authentication  # Auth-related route logic (login form, guards)
└── tests
    └── mocks                # API mocks for testing (MSW handlers)
```
