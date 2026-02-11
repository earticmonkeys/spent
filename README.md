# 💸 Expense Tracker PWA

A minimal, playful expense tracking web app built with **Next.js**,
**Prisma**, and **SQLite** --- installable as a **Progressive Web App
(PWA)**.

> "Poof 💸 There goes your money again!"

------------------------------------------------------------------------

## ✨ Features

-   📅 Daily expense tracking
-   💰 Auto-calculated total per day
-   ⚡ Instant save with Enter key
-   🎲 Random playful notifications
-   📱 Installable PWA (Android / iOS / macOS)
-   🗄 SQLite database
-   🔥 Clean and minimal UI (MUI)

------------------------------------------------------------------------

## 🛠 Tech Stack

-   Next.js 16 (App Router)
-   TypeScript
-   Prisma ORM
-   SQLite
-   MUI
-   Day.js
-   next-pwa

------------------------------------------------------------------------

## 📦 Installation

``` bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
npm install
```

------------------------------------------------------------------------

## 🗄 Setup Database

Generate Prisma client:

``` bash
npx prisma generate
```

Run migrations:

``` bash
npx prisma migrate dev
```

------------------------------------------------------------------------

## 🚀 Run Development

``` bash
npm run dev
```

Open:

    http://localhost:3000

------------------------------------------------------------------------

## 🏗 Production Build

``` bash
npm run build
npm start
```

------------------------------------------------------------------------

## 📱 PWA Support

This app supports installation as a Progressive Web App.

### Requirements:

-   HTTPS (required on Android)
-   `manifest.json`
-   Service worker via `next-pwa`
-   Icons (192x192, 512x512)

### Test PWA:

1.  Open in Chrome
2.  DevTools → Application → Manifest
3.  Check Service Worker registered
4.  Install from browser menu



------------------------------------------------------------------------

## 🎲 Fun Notification System

Randomized message packs for:

-   ✅ Successful save
-   ⚠️ Incomplete input
-   ❌ Save failure

Adds personality to the experience.

------------------------------------------------------------------------

## 🧩 Future Improvements

-   Categories
-   Monthly summary
-   Charts
-   Dark mode
-   Cloud sync
-   Authentication
-   Offline caching strategy upgrade

------------------------------------------------------------------------

## 📄 License

MIT

------------------------------------------------------------------------

## 👨‍💻 Author

Built with ☕ and questionable financial decisions.
