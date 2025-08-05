# Chatty Setup Guide

This guide will help you set up Chatty with all required services and environment variables.

## Prerequisites

- Node.js 18+ installed
- A Clerk account (free tier available)
- A Convex account (free tier available)

## Step 1: Clone and Install Dependencies

The project should already be initialized with all dependencies. If not:

```bash
npm install
```

## Step 2: Set up Clerk Authentication

1. **Create a Clerk Application**
   - Go to [clerk.com](https://clerk.com) and sign up/sign in
   - Create a new application
   - Choose your preferred authentication methods (Email, Google, GitHub, etc.)

2. **Get your Clerk Keys**
   - In your Clerk dashboard, go to "API Keys"
   - Copy your `Publishable Key` and `Secret Key`

3. **Configure Clerk Settings**
   - Go to "Paths" in your Clerk dashboard
   - Set the following paths:
     - Sign-in URL: `/sign-in`
     - Sign-up URL: `/sign-up`
     - Sign-in redirect: `/chat`
     - Sign-up redirect: `/chat`

## Step 3: Set up Convex Database

1. **Install Convex CLI** (if not already installed)
   ```bash
   npm install -g convex
   ```

2. **Create a Convex Project**
   - Go to [convex.dev](https://convex.dev) and sign up/sign in
   - Run in your project directory:
     ```bash
     npx convex dev
     ```
   - Follow the prompts to create a new project
   - This will create a `.env.local` file with your Convex URL and deploy key

3. **Deploy your Schema**
   - The schema is already defined in `convex/schema.ts`
   - Run `npx convex dev` to deploy it

## Step 4: Configure Environment Variables

Update your `.env.local` file with the actual values:

```bash
# =============================================================================
# CORE APPLICATION CONFIGURATION
# =============================================================================
NEXT_PUBLIC_APP_NAME=Chatty
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# =============================================================================
# AUTHENTICATION (CLERK) - REQUIRED
# =============================================================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE

# Authentication Flow URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat

# Webhook secret (get from Clerk dashboard -> Webhooks)
CLERK_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# =============================================================================
# DATABASE (CONVEX) - REQUIRED
# =============================================================================
NEXT_PUBLIC_CONVEX_URL=https://YOUR_DEPLOYMENT.convex.cloud
CONVEX_DEPLOY_KEY=YOUR_CONVEX_DEPLOY_KEY

# =============================================================================
# API SECURITY
# =============================================================================
CORS_ORIGIN=http://localhost:3000
CORS_CREDENTIALS=true
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# Generate a secure JWT secret (minimum 32 characters)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-replace-this
JWT_EXPIRES_IN=7d

# =============================================================================
# DEVELOPMENT TOOLS
# =============================================================================
NEXT_TELEMETRY_DISABLED=1
ANALYZE=false
```

## Step 5: Set up Clerk Webhooks (Optional but Recommended)

1. **Create a Webhook in Clerk**
   - Go to your Clerk dashboard
   - Navigate to "Webhooks"
   - Click "Add Endpoint"
   - Set the URL to: `http://localhost:3000/api/webhooks/clerk` (for development)
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret

2. **Add the Webhook Secret to Environment Variables**
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

## Step 6: Run the Application

1. **Start Convex Development Server**
   ```bash
   npx convex dev
   ```
   Keep this running in one terminal.

2. **Start Next.js Development Server**
   ```bash
   npm run dev
   ```
   In another terminal.

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see the Chatty landing page

## Step 7: Test the Setup

1. **Sign Up/Sign In**
   - Click "Get Started" or "Sign In"
   - Create a new account or sign in with existing credentials
   - You should be redirected to `/chat`

2. **Verify Database Connection**
   - Check the Convex dashboard to see if user data appears
   - Verify that tables are created with the correct schema

## Troubleshooting

### Common Issues

1. **"Environment validation failed"**
   - Make sure all required environment variables are set
   - Check for typos in variable names
   - Ensure Clerk and Convex keys are valid

2. **"Please set CONVEX_DEPLOY_KEY"**
   - Run `npx convex dev` to initialize Convex
   - Copy the deploy key from the generated `.env.local` file

3. **Authentication not working**
   - Verify Clerk keys are correct
   - Check that Clerk paths are configured properly
   - Ensure webhook URL is accessible (use ngrok for local development)

4. **Database queries failing**
   - Verify Convex URL is correct
   - Ensure schema is deployed (`npx convex dev`)
   - Check Convex dashboard for errors

### Development Tips

1. **Use Convex Dashboard**
   - Monitor real-time data changes
   - Test queries and mutations
   - View logs and errors

2. **Use Clerk Dashboard**
   - Monitor user signups and authentication
   - Test different auth providers
   - Configure user profile fields

3. **Environment Variables**
   - Never commit `.env.local` to version control
   - Use `.env.example` as a template
   - Validate environment variables on app startup

## Production Deployment

When ready to deploy to production:

1. **Deploy to Vercel**
   ```bash
   npx vercel
   ```

2. **Set Production Environment Variables**
   - Add all environment variables to Vercel dashboard
   - Update Clerk settings with production URLs
   - Update Convex deployment for production

3. **Configure Production Webhooks**
   - Update Clerk webhook URL to production domain
   - Test webhook functionality

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure Clerk and Convex services are properly configured
4. Review the setup steps above

For more detailed documentation:
- [Clerk Documentation](https://clerk.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Next.js Documentation](https://nextjs.org/docs)