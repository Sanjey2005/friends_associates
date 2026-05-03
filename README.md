# Friends Associates

Friends Associates is a Next.js App Router insurance management app for customer policies, vehicles, quote leads, admin workflows, reminders, and support chat.

## Stack

- Next.js 16 App Router and React 19
- TypeScript
- MongoDB with Mongoose
- Cookie-based JWT auth signed and verified with `jose`
- Same-origin browser requests through `src/lib/api-client.ts`
- Email delivery with `nodemailer`
- Tests with Vitest and React Testing Library

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in real values:

```env
MONGO_URI=mongodb+srv://user:password@cluster.example/friends_associates
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET_USER=replace-with-a-long-random-user-secret
JWT_SECRET_ADMIN=replace-with-a-long-random-admin-secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
CRON_SECRET=replace-with-a-long-random-cron-secret
```

3. Create or update an admin:

```bash
npm run admin:create -- --email=admin@example.com --password=StrongPassword123!
```

4. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build production assets
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run test` - run the Vitest suite once
- `npm run test:watch` - run Vitest in watch mode
- `npm run admin:create -- --email=... --password=...` - create or update an admin
- `npm run admin:verify -- --email=... --password=...` - verify admin credentials
- `npm run email:test -- --to=...` - send a test email
- `npm run user:check -- --email=...` or `--phone=...` - inspect a user without dumping secrets

## Environment

Required runtime variables:

- `MONGO_URI`
- `JWT_SECRET_USER`
- `JWT_SECRET_ADMIN`
- `NEXT_PUBLIC_APP_URL`
- `EMAIL_USER`
- `EMAIL_PASS`

Optional or environment-specific variables:

- `EMAIL_SERVICE` defaults to `gmail`
- `CRON_SECRET` protects the reminder cron in production
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `TEST_EMAIL_TO` can be used as script defaults

## Auth And Security Notes

- User and admin JWTs are stored in `HttpOnly` cookies and verified in `src/proxy.ts` for dashboard access.
- Server routes use shared helpers in `src/lib/server-auth.ts` for `requireUser`, `requireAdmin`, and optional sessions.
- User self-registration requires email verification before login.
- Verification and reset links store hashed tokens in MongoDB. Plaintext token lookup remains temporarily supported for already-issued links until they expire.
- Browser code should use `apiFetch` instead of direct `fetch` boilerplate or third-party HTTP clients.
- Logout must use the server endpoints so `HttpOnly` cookies are cleared by the response.

## API Overview

Authentication:

- `POST /api/auth/user/register`
- `POST /api/auth/user/login`
- `POST /api/auth/user/logout`
- `POST /api/auth/user/resend-verification`
- `POST /api/auth/user/verify`
- `POST /api/auth/user/forgot-password`
- `POST /api/auth/user/reset-password`
- `POST /api/auth/admin/login`
- `POST /api/auth/admin/logout`

Resources:

- `GET /api/policies`
- `GET /api/policies?scope=admin`
- `POST /api/policies`
- `PUT /api/policies`
- `GET /api/vehicles`
- `GET /api/vehicles?scope=admin`
- `POST /api/vehicles`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users`
- `DELETE /api/users?id=...`
- `GET /api/leads`
- `POST /api/leads`
- `PUT /api/leads`
- `GET /api/chat`
- `GET /api/chat?scope=admin`
- `POST /api/chat`

Cron:

- `GET /api/cron/reminders`
- In production, send `x-cron-secret: <CRON_SECRET>`.
- A legacy `?key=<CRON_SECRET>` fallback is still accepted.

## Quality Checks

Run these before shipping:

```bash
npm run lint
npm run test
npm run build
npm audit --omit=dev
```

`npm audit --omit=dev` may report moderate transitive `next`/`postcss` findings until the framework dependency provides a safe non-breaking fix. The dependency cleanup goal is no direct production high or critical findings.
