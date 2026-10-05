# SecondLife Supabase Setup

> The current app login is a demo-only browser gate: any name plus the shared password `1234`. It is not Supabase authentication and is not secure. The Supabase schema and configuration below are retained for backend development, but they are not used by this demo login flow.

SecondLife uses Supabase Auth for credentials and sessions, and the `public.profiles` table for user profile data. The browser app only needs the project URL and the public anon/publishable key. Never put a service-role key in this app or in a `VITE_` variable.

## 1. Create a project

Create a project at [supabase.com](https://supabase.com/) and wait for its database to finish provisioning.

## 2. Copy the public project settings

In the Supabase dashboard, open **Project Settings > API** (or the project **Connect** panel) and copy:

- Project URL
- `anon` / publishable key

Do not copy the `service_role` / secret key.

## 3. Configure local environment

Create `secondlife/.env.local` next to `package.json` using these exact variable names:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

Use the actual values from the project settings. `.env.local` is ignored by Git. Restart Vite after changing it.

## 4. Create the profile table and policies

Open **SQL Editor > New query** in Supabase. Paste and run the complete migration at `supabase/migrations/20261005000000_profiles.sql`. For an existing project where that migration was already run, also run `supabase/migrations/20261006000000_profiles_onboarding.sql`; it adds the `onboarding_completed` column required by onboarding and refreshes the Supabase schema cache. Both migrations are safe to rerun.

It creates `public.profiles`, enables row-level security, grants authenticated users only the needed table operations, limits profile reads/writes to `auth.uid() = id`, updates `updated_at`, and creates a profile whenever an Auth user is created. The trigger marks users with no valid role/name as incomplete so they can finish onboarding.

## 5. Enable email authentication

Open **Authentication > Providers > Email** and enable Email. For the requested verification flow, enable **Confirm email**. Configure your SMTP/email provider for reliable delivery; Supabase's built-in mail service has low rate limits and is intended for development.

Registration sends `full_name` and `role` as Auth user metadata. The database trigger creates the profile even when email confirmation means Supabase returns no session to the browser. The app does not sign the user in until Supabase supplies a real session.

## 6. Configure URL redirects

Open **Authentication > URL Configuration**:

- Set the Site URL to `http://localhost:5173` for local development.
- Add `http://localhost:5173/**` to Redirect URLs.
- Add `http://127.0.0.1:5173/**` if you open the app using that host.
- For production, set the Site URL to your deployed origin and add that origin's callback/reset routes to Redirect URLs.

The app uses `/auth/callback` for registration email verification and `/reset-password` for recovery links. The redirect origin must match the origin you use to open the app.

## 7. Start the app

From the `secondlife` directory:

```powershell
npm install
npm run dev
```

Open the local URL Vite prints, normally `http://localhost:5173`.

## 8. Test registration and verification

1. Open `/register`, enter a name, valid email, password of at least 8 characters, matching confirmation, and one role.
2. Submit. With email confirmation enabled, the page says: “Account created. Please check your email to verify your account.”
3. Open the verification email and follow its link back to `/auth/callback`.
4. Once verified and signed in, the app loads the profile and opens `/dashboard`. If the profile is incomplete, it routes to `/onboarding` first.

Use an inbox you can access. A duplicate registration is handled without exposing raw Auth/database errors.

## 9. Test login and session persistence

1. Sign in with the verified email and password at `/login`.
2. Confirm that invalid credentials show “Email or password is incorrect.” and an unverified account asks you to verify its email.
3. With **Remember this session** checked, Supabase Auth persists its session in browser local storage through its storage adapter. Unchecked sessions use tab-scoped session storage. Neither path stores a password, and the app reads/authenticates sessions through Supabase Auth APIs and events.
4. Refresh `/dashboard`; the existing Supabase session should restore without showing the dashboard before auth initialization finishes.

## 10. Test protected routes and logout

1. While signed out, open `/dashboard`, `/components`, `/projects`, `/impact`, `/profile`, `/donor`, or `/organization`; each redirects to `/login`.
2. Sign in and open those URLs; they require an authenticated session and a completed profile. Incomplete profiles are sent to `/onboarding`.
3. Open the profile menu in the dashboard header and choose **Sign out**.
4. Confirm that Supabase signs out and the app returns to `/login`.

## 11. Test recovery and profile updates

1. On `/forgot-password`, submit an email address. The app always displays “If an account exists for this email, we've sent instructions to reset your password.”
2. Open the email link. It returns to `/reset-password`; enter matching passwords of at least 8 characters.
3. Confirm the success message, then sign in using the updated password.
4. Open **Profile settings**, update the name, role, or avatar URL, and save. The email is read-only here; email changes must use Supabase's Auth email-change confirmation flow.

## 12. Package and configuration notes

The app dependencies are `@supabase/supabase-js` and `react-router-dom`; both are installed in `package.json`. All privileged database access remains behind Supabase RLS and the signup trigger. The browser receives only the public anon/publishable key.

Project creation, SMTP delivery, redirect allowlists, and running the SQL migration must be completed in the Supabase dashboard; they cannot be automated safely from this frontend repository.

## Role-Based Marketplace Prototype

The current UI uses a browser-local demo gate and browser-local marketplace state. It does not call Supabase for login, requests, payments, or deliveries. Sign in using any role-appropriate display name and the shared demo password `1234`. The password is not written to browser storage. Use **Remember me** to persist the demo profile; uncheck it to keep it tab-scoped.

Demo persona names that load pre-seeded records:

| Role | Name | Location |
| --- | --- | --- |
| Project Maker | Asha Raman | Chennai |
| Project Maker | Ravi Kumar | Bengaluru |
| Seller | Arun Electronics | Chennai |
| Seller | Priya Tech Reuse | Bengaluru |
| Seller | Chennai Makers | Chennai |
| Organization | SSIT Innovation Lab | Chennai |
| Organization | Campus E-Waste Center | Coimbatore |
| Organization | GreenTech Foundation | Bengaluru |

Other names create empty demo profiles for that selected role. Demo registration accepts the requested role-specific profile fields but uses the same shared `1234` gate and does not create a Supabase Auth user.

### Routes

- `/roles` selects Project Maker, Seller, or Organization.
- `/login/project_maker`, `/login/seller`, `/login/organization` are role-specific demo login pages.
- `/register/project_maker`, `/register/seller`, `/register/organization` create browser-local role profiles.
- Project Maker workspaces are under `/project-maker/*`.
- Seller workspaces are under `/seller/*`.
- Organization workspaces are under `/organization/*`.
- A signed-in demo profile is redirected back to its own role dashboard if it attempts another role's workspace.

### Shared database schema

After the base profile/onboarding migrations, run `supabase/migrations/20261007000000_role_marketplace.sql` in the Supabase SQL Editor. It converts legacy profile roles, constrains roles to `project_maker`, `seller`, and `organization`, adds organization/location profile fields, and creates inventories, projects, requirements, listings, requests, feedback, request-event history, and an RLS-aware feedback average view.

Listings reference owned inventory and enforce `available + reserved + transferred + cancelled = total`. A database trigger rejects listing quantities beyond currently owned stock. Request triggers validate role/ownership transitions, reserve quantity on acceptance, return it on rejection/cancellation, enforce delivery order, and decrement owned inventory only on delivery. Profile roles are immutable to browser updates. Apply the migrations in timestamp order.

The app's current workflow tests use seeded browser demo records from `src/data/demoStore.js`, not those Supabase tables. SQL trigger behavior still needs to be verified against the live Supabase project after applying the migration. Payment amounts are estimates only; no payment provider is integrated. Delivery is a local demo state machine in the UI and is not connected to a carrier.

### Demo workflow checks

1. Sign in as Asha Raman / Project Maker and use **Find Components** to view matches sourced only from available seller/organization listings.
2. Sign in as Arun Electronics / Seller. In **My Inventory**, compare owned stock to listed, reserved, and private quantities. Accept Asha's request for the SG90 Servo and advance it under **Delivery** through Packed, Picked Up, In Transit, and Delivered.
3. After Delivered, the request is marked transferred, listing reservation becomes a transfer, and inventory decreases. Impact values count completed demo transfers only.
4. Sign in as SSIT Innovation Lab / Organization to manage bulk resources and compare its own available listings to maker requirements.
5. Try opening another role's route while signed in; the route guard returns to the current role dashboard.

The browser-local marketplace demo store key is versioned. Clearing site data resets its seeded inventory, listings, projects, requests, and feedback.