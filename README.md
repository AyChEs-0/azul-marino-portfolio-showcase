# Azul Marino — Portfolio Showcase

Monorepo for Azul Marino's projects. Currently hosts **Noor del Conocimiento**, an Islamic trivia mobile app built with React Native + Expo.

---

## Projects

### `noor-del-conocimiento/mobile/` — Noor del Conocimiento

An Islamic knowledge quiz app available in **Spanish**, **English**, and **Moroccan Darija (Darija)**.

**Features:**
- 507 verified trivia questions across 3 categories: Corán y General, Profetas, Seerah
- 3 difficulty levels: easy / medium / hard
- Lifelines: 50/50, extra time, skip
- AI-powered feedback for wrong answers (Claude API)
- Multiplayer Majlis mode
- Multilingual UI (es / en / ma)

**Tech stack:** Expo SDK 52 · React Native New Architecture · expo-router · react-native-reanimated · AsyncStorage · EAS Build

**Build & run:**
```bash
cd noor-del-conocimiento/mobile
npm install
npx expo start          # development
eas build --platform android --profile preview  # cloud build
```

**Environment:** copy `.env.example` → `.env` and fill in `ANTHROPIC_API_KEY`.

---

## Root web app

A Vite + React + TypeScript + Tailwind web app (portfolio / tournament showcase). Run with:

```bash
npm install
npm run dev
```
