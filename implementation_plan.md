# RecycLens — Complete Project Implementation Plan

## Current State Assessment

After auditing every file, here's what exists and what's missing:

### ✅ What's Working
- **Auth backend**: Register + Login routes with Mongoose User model
- **Frontend screens**: 11 screens all built with UI (login, home, scan-result, guide, ai-tips, centers, history, history-detail, profile, success, _layout)
- **server.js**: Mongoose connection, cors, dotenv — all set up

### ❌ What's Broken / Missing
| Area | Problem |
|---|---|
| **Auth token** | Login returns a JWT but the app **never stores it** — navigates to `/home` and forgets |
| **User data** | Profile shows hardcoded `John Doe` — not the logged-in user |
| **Scan CRUD** | No `Scan` model or routes — scan-result uses hardcoded sample data |
| **History** | Hardcoded array of 5 items — no API calls |
| **AI Chat** | `handleSend` just calls `alert()` — no real AI integration |
| **Centers** | Hardcoded array — no API or database |
| **Stats** | Home shows hardcoded `12` and `8` — no real counts |
| **Old db.js** | [Backend/db.js](file:///d:/RecycLens/Backend/db.js) (native driver) is still present — dead code |

---

## User Review Required

> [!IMPORTANT]
> **AI Provider for Chat**: I plan to use **Google Gemini API** (free tier, `gemini-2.0-flash`) for the AI recycling assistant chat. This requires a free API key from [Google AI Studio](https://aistudio.google.com/apikey). Do you already have one, or would you prefer a different AI provider?

> [!IMPORTANT]
> **Recycling Centers**: Currently the centers are hardcoded. I will store them in MongoDB so they're manageable. For a real "nearby" feature you'd need Google Maps API, but for the FYP I'll use a **simulated distance** approach with the stored data. Is that acceptable?

> [!WARNING]
> **Expo Camera**: The scan button currently just navigates to `/scan-result` with hardcoded data. A real camera-based scan would require `expo-camera` + an image classification API. I will wire the flow so scanning works with a **simulated classification** (picks from known categories) that you can later swap with a real ML model. Is this acceptable for your FYP submission?

## Open Questions

1. **Forgot Password** — the "Forgot Password?" button is visible but does nothing. Should I implement email-based password reset, or leave it as a placeholder for now?
2. **Points / Badges** — the success screen shows "+10 Points" and "Eco Warrior Badge" — should I implement a simple gamification system (points per scan, badge thresholds)?

---

## Proposed Changes

### Phase 1 — Cleanup & Shared Utilities

#### [DELETE] [db.js](file:///d:/RecycLens/Backend/db.js)
Remove the old native MongoDB driver connection file — replaced by Mongoose in `server.js`.

#### [NEW] `app/utils/api.js`
Shared API helper for the React Native frontend:
- `getApiBaseUrl()` — extracted from `index.js` (currently duplicated logic)
- `apiRequest(endpoint, options)` — wrapper around `fetch` that auto-attaches the JWT from AsyncStorage
- `getToken()` / `setToken()` / `removeToken()` — AsyncStorage helpers

#### [NEW] `app/utils/auth-context.js`
React Context for auth state:
- Stores `user` object + `token`
- Provides `login()`, `logout()`, `loadUser()` methods
- Auto-loads token on app start to persist login

#### [MODIFY] [_layout.js](file:///d:/RecycLens/app/_layout.js)
Wrap the app in `<AuthProvider>` so all screens can access user data.

---

### Phase 2 — Backend Models & Routes

#### [NEW] `Backend/models/Scan.js`
Mongoose model for scan results:
```
- userId (ref → User)
- itemName (String)
- material (String)  
- isRecyclable (Boolean)
- confidence (Number)
- icon (String — emoji)
- timestamps: true
```

#### [NEW] `Backend/models/Center.js`
Mongoose model for recycling centers:
```
- name, address, phone
- accepts (String[])
- isOpen (Boolean)
- location: { lat, lng }
```

#### [NEW] `Backend/models/Tip.js`
Mongoose model for recycling tips:
```
- itemType (String)
- content (String)
- steps (String[])
- reuseIdeas (Object[])
```

#### [NEW] `Backend/middleware/authMiddleware.js`
JWT verification middleware:
- Reads `Authorization: Bearer <token>` header
- Verifies token, attaches `req.userId`
- Returns 401 if invalid/missing

#### [NEW] `Backend/routes/scans.js`
Scan CRUD API:
- `POST /api/scans` — create a new scan (protected)
- `GET /api/scans` — list user's scans with filtering (protected)
- `GET /api/scans/:id` — get single scan (protected)
- `DELETE /api/scans/:id` — delete a scan (protected)
- `GET /api/scans/stats` — get user's scan statistics (protected)

#### [NEW] `Backend/routes/centers.js`
Centers API:
- `GET /api/centers` — list centers with optional search
- `GET /api/centers/:id` — get single center

#### [NEW] `Backend/routes/tips.js`
Tips API:
- `GET /api/tips?item=plastic` — get tips for an item type
- `POST /api/tips/chat` — AI chat endpoint (proxies to Gemini)

#### [NEW] `Backend/routes/profile.js`
User profile API (all protected):
- `GET /api/profile` — get current user profile + stats
- `PUT /api/profile` — update name, phone
- `PUT /api/profile/password` — change password
- `DELETE /api/profile/history` — clear all scan history

#### [MODIFY] [server.js](file:///d:/RecycLens/Backend/server.js)
Mount the new route files:
```js
app.use("/api/scans", scanRoutes);
app.use("/api/centers", centerRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/profile", profileRoutes);
```

#### [NEW] `Backend/seed.js`
Database seeder script to populate:
- 4 sample recycling centers
- 10+ recycling tips for common items (plastic, glass, paper, metal, electronics, etc.)

---

### Phase 3 — Frontend Auth Integration

#### [MODIFY] [index.js](file:///d:/RecycLens/app/index.js)
- Replace local `getApiBaseUrl` with import from `utils/api.js`
- On successful login, **store token + user data** via AuthContext
- On app load, check for existing token → auto-navigate to `/home`
- Store JWT in AsyncStorage for persistence across app restarts

---

### Phase 4 — Connect Screens to Real APIs

#### [MODIFY] [home.js](file:///d:/RecycLens/app/home.js)
- Fetch real stats from `GET /api/scans/stats` on mount
- Show logged-in user's name in header
- Fetch 3 random tips from `GET /api/tips`

#### [MODIFY] [scan-result.js](file:///d:/RecycLens/app/scan-result.js)
- Accept scan data via route params (from a simulated scan)
- "Mark as Recycled" → `POST /api/scans` to save the scan to DB
- Pass scan data to guide/ai-tips screens via params

#### [MODIFY] [history.js](file:///d:/RecycLens/app/history.js)
- Replace hardcoded array with `GET /api/scans` API call
- Real-time stats from actual data
- Search and filter work on real data

#### [MODIFY] [history-detail.js](file:///d:/RecycLens/app/history-detail.js)
- Fetch scan by ID from `GET /api/scans/:id`
- "Delete from History" → `DELETE /api/scans/:id`

#### [MODIFY] [profile.js](file:///d:/RecycLens/app/profile.js)
- Fetch user profile from `GET /api/profile`
- Show real user name, email, join date
- "Edit Profile" → update via `PUT /api/profile`
- "Clear Scan History" → `DELETE /api/profile/history`
- "Log Out" → clear AsyncStorage + navigate to login

#### [MODIFY] [centers.js](file:///d:/RecycLens/app/centers.js)
- Fetch centers from `GET /api/centers`
- Search filters via API query params

#### [MODIFY] [ai-tips.js](file:///d:/RecycLens/app/ai-tips.js)
- Real chat messages stored in state
- `handleSend` → `POST /api/tips/chat` → append AI response to chat
- Quick questions send pre-filled messages
- Loading indicator while AI responds

#### [MODIFY] [guide.js](file:///d:/RecycLens/app/guide.js)
- Accept item type via route params
- Fetch relevant guide from `GET /api/tips?item=...`
- Display dynamic steps and reuse ideas

#### [MODIFY] [success.js](file:///d:/RecycLens/app/success.js)
- Receive scan data via params and display actual item info
- Show real points/stats from the saved scan

---

### Phase 5 — Simulated Scan Flow

#### [NEW] `app/scan.js`
New scan screen that simulates the camera/AI flow:
- Show a list of common items to "scan" (Plastic Bottle, Cardboard Box, Glass Jar, Coffee Cup, Aluminum Can, Styrofoam, etc.)
- Tapping an item simulates AI classification with a brief loading animation
- Navigates to `/scan-result` with the classified data
- This can later be swapped with `expo-camera` + a real ML model

#### [MODIFY] [_layout.js](file:///d:/RecycLens/app/_layout.js)
Add the new `scan` screen to the Stack navigator.

#### [MODIFY] [home.js](file:///d:/RecycLens/app/home.js)
Update `handleScan` to navigate to `/scan` instead of `/scan-result`.

---

### Phase 6 — Environment & Config

#### [MODIFY] [.env](file:///d:/RecycLens/Backend/.env)
Add Gemini API key:
```
GEMINI_API_KEY=your_key_here
```

#### [NEW] `.env` (frontend — Expo)
At the project root, create/update with:
```
EXPO_PUBLIC_API_BASE_URL=http://192.168.18.61:5001
```

---

### Phase 7 — Install Dependencies

#### Backend
```bash
npm install @google/generative-ai    # Gemini AI SDK
```

#### Frontend
```bash
npm install @react-native-async-storage/async-storage   # Token persistence
```

---

## Verification Plan

### Automated Tests
1. Start the backend server and verify all endpoints return correct responses:
   ```bash
   # Health check
   curl http://localhost:5001/api/health
   
   # Register
   curl -X POST http://localhost:5001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@gmail.com","password":"test123"}'
   
   # Login
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@gmail.com","password":"test123"}'
   
   # Protected routes with token
   curl http://localhost:5001/api/profile -H "Authorization: Bearer <token>"
   curl http://localhost:5001/api/scans -H "Authorization: Bearer <token>"
   curl http://localhost:5001/api/centers
   ```

2. Verify MongoDB has the seeded data:
   ```bash
   node Backend/seed.js
   ```

### Manual Verification
1. Run `npx expo start` and test the full flow on Android emulator / Expo Go:
   - Register → Login → Home (shows real stats)
   - Scan → See result → Mark as Recycled → Success screen
   - History → shows the scan we just made → Delete it
   - AI Chat → send a message → get real AI response
   - Centers → list loads from DB
   - Profile → shows real user data → Logout
2. Restart the app → should auto-login (token persisted)

---

## Summary

| Metric | Count |
|---|---|
| New backend files | 10 (models, routes, middleware, seed) |
| Modified backend files | 1 (server.js) |
| Deleted backend files | 1 (db.js) |
| New frontend files | 3 (api.js, auth-context.js, scan.js) |
| Modified frontend files | 10 (all screens + _layout) |
| **Total files touched** | **25** |
