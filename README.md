# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Backend plan (what you need and how I would build it)

### 1) Core requirements
- **Auth**: email/password (or OAuth) with secure tokens.
- **Database**: store users, scans, history, and recycling centers.
- **Storage**: optional, for uploaded scan images.
- **AI/ML**: classify items and return recyclable tips.
- **Analytics**: track scans and engagement.
- **Notifications**: optional reminders and tips.
- **Admin tools**: manage centers, tips, and app content.

### 2) Recommended stack (simple and reliable)
Option A: **Supabase (Postgres + Auth + Storage)**
- Pros: fast setup, SQL, built-in auth, storage, edge functions.
- Cons: vendor-specific features.

Option B: **Firebase (Auth + Firestore + Storage + Functions)**
- Pros: mature mobile SDKs, great DX.
- Cons: NoSQL modeling complexity.

Option C: **Custom Node.js API**
- Express/Fastify + Postgres + Prisma + S3-compatible storage.
- Pros: full control.
- Cons: more maintenance.

### 3) Minimal data model
- **users**: id, name, email, created_at
- **scans**: id, user_id, item_name, material, recyclable, confidence, image_url, created_at
- **scan_events** (optional): id, scan_id, action, metadata, created_at
- **centers**: id, name, address, phone, accepts[], lat, lng, is_open
- **tips**: id, item_type, content, created_at

### 4) API endpoints you will need
- `POST /auth/signup`, `POST /auth/login`
- `GET /me`
- `POST /scans` (create scan result)
- `GET /scans?userId=...` (history)
- `GET /scans/:id`
- `DELETE /scans/:id`
- `GET /centers?near=lat,lng`
- `GET /tips?item=...`

### 5) AI pipeline (simple version)
- Client uploads image to storage.
- Backend calls an image model to classify item and material.
- Backend stores scan record and returns result + tips.

### 6) How I would implement it (step-by-step)
1. Pick Supabase or Firebase for fastest delivery.
2. Define tables/collections and row-level security (RLS).
3. Implement auth and protect user data.
4. Add scans CRUD endpoints (or use Supabase/Firebase SDK).
5. Add recycling centers endpoint with geo filtering.
6. Integrate AI classification (cloud function or edge function).
7. Wire the app to read/write data and show real history.
8. Add monitoring/logging and basic rate limits.

### 7) What you must prepare
- A project in Supabase/Firebase (or a server + DB).
- API keys for AI (if using a hosted model).
- Storage bucket for images.
- Map provider key (Google Maps or Mapbox) if you add real map view.
- Legal docs: privacy policy + data retention policy.

### 8) Security checklist
- Store secrets in server env vars only.
- Validate image size/type and throttle uploads.
- Enforce auth checks on all user data.
- Use HTTPS and short-lived tokens.

If you want, tell me your preferred backend option and I will draft the exact schema, endpoints, and client integration steps.
