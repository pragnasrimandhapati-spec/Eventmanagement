# EventHub – Event Registration (Firebase)

## One-time Firebase setup (project: event-management21)
1. **Authentication → Sign-in method →** enable **Email/Password**.
2. **Firestore Database →** create a database (production mode).
3. **Firestore → Rules →** paste the contents of `firestore.rules` and **Publish**.
4. Edit the admin email in **two places** (keep them identical):
   - `firebase-config.js` → `ADMIN_EMAILS`
   - `firestore.rules` → `isAdmin()`
5. **Sign up once with the admin email** (use an email you own) – that account becomes the admin.

## Run locally
The app uses ES modules, so it must be served over http (double-clicking index.html will not work).

    python -m http.server 8000      # then open http://localhost:8000

(or use the VS Code "Live Server" extension). `localhost` is already an authorised domain in Firebase.

## Roles
| Role | Can do |
|---|---|
| Participant (default for every sign-up) | create account, log in, register for events, view / cancel own tickets |
| Admin (email listed in ADMIN_EMAILS) | log in, see ALL registrations (who registered for which event), search/filter, export CSV, remove entries. Cannot register. |

## Data (Firestore)
- `users/{uid}` – name, email, role
- `registrations/{uid_eventId}` – one registration per user per event (ticket, event, phone, college, year, people, createdAt)
