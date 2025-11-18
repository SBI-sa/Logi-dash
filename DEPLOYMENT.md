# LogiPoint Dashboard - Deployment Guide

## Environment Variables Setup

This application uses environment variables to securely store credentials. All sensitive information has been moved out of the codebase and into environment variables.

### Required Environment Variables

The following environment variables must be configured:

#### Supabase Configuration
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous/public API key

#### Authentication Credentials
- `EXPO_PUBLIC_VIEWER_USERNAME` - Username for viewer account (read-only access)
- `EXPO_PUBLIC_VIEWER_PASSWORD` - Password for viewer account
- `EXPO_PUBLIC_ADMIN_EMAIL` - Email for admin account (full edit access)
- `EXPO_PUBLIC_ADMIN_PASSWORD` - Password for admin account
- `EXPO_PUBLIC_ADMIN_NAME` - Display name for admin user

### Setup Instructions for Different Environments

#### 1. Replit (Current Production)
All secrets are already configured in Replit Secrets:
1. Go to the "Secrets" tab (🔒 icon) in the left sidebar
2. All 7 required secrets are already added
3. Secrets are automatically available as `process.env.EXPO_PUBLIC_*` in the code

#### 2. Local Development
For local development on your machine:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the actual values in `.env`:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_key
   # ... etc
   ```

3. **Important:** Never commit `.env` to git (it's already in `.gitignore`)

#### 3. Production Deployment (Vercel, Netlify, etc.)
When deploying to other platforms:

1. Add all 7 environment variables in your platform's dashboard
2. Use the exact variable names (with `EXPO_PUBLIC_` prefix)
3. For web builds, run: `npx expo export --platform web`

### How It Works

- The `EXPO_PUBLIC_` prefix makes these variables available in client-side code
- Expo automatically injects these at build time
- The application behavior remains identical to before - only the source of credentials changed
- Authentication logic is unchanged (viewer and admin access work the same way)

### Security Notes

- Never commit actual credentials to git
- Use `.env.example` as a template (safe to commit)
- Replit Secrets encrypts all values automatically
- The `.env` file is ignored by git (see `.gitignore`)

### Verifying Setup

After adding secrets, restart the development server:
```bash
npx expo start --web --port 5000
```

Login should work exactly as before:
- Viewer: Use viewer username and password from secrets
- Admin: Use admin email and password from secrets
