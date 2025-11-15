# DATUM Setup Guide

This guide will walk you through setting up DATUM from scratch.

## Part 1: Local Development Setup

### 1.1 Install Dependencies

Before running the installation, you may need to allow PowerShell scripts on Windows:

\`\`\`powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
\`\`\`

Then install Node.js dependencies:

\`\`\`bash
npm install
\`\`\`

### 1.2 Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at [http://localhost:3000](http://localhost:3000)

## Part 2: Supabase Database Setup

### 2.1 Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

### 2.2 Create a New Project

1. Click "New Project"
2. Choose an organization (or create one)
3. Fill in the project details:
   - **Name**: `datum-db` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is perfect for personal use

4. Click "Create new project" and wait 1-2 minutes for setup

### 2.3 Get Your API Credentials

1. In your Supabase project, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL**: Something like `https://abcdefghijk.supabase.co`
   - **anon public** key: A long JWT token starting with `eyJhbGciOi...`

⚠️ **Important**: Never share your `service_role` key! Only use the `anon` key.

### 2.4 Run the Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Open the `supabase-schema.sql` file from this project in a text editor
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This creates all the necessary tables:
- `categories` - Transaction categories
- `tags` - Flexible tagging system
- `transactions` - Your financial transactions (encrypted)
- `goals` - Financial goals (encrypted)
- `recurring_templates` - Templates for recurring transactions
- `pending_transactions` - Queue for recurring transaction approval
- `user_settings` - App configuration
- `dashboard_widgets` - Dashboard layout preferences
- `ai_insights` - AI-generated insights history (encrypted)

### 2.5 Verify the Setup

Run this query in the SQL Editor to verify:

\`\`\`sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
\`\`\`

You should see all the tables listed above.

## Part 3: First-Time Onboarding

### 3.1 Launch the App

1. Open [http://localhost:3000](http://localhost:3000)
2. You'll see the DATUM welcome screen

### 3.2 Connect to Supabase

1. Click "Get Started"
2. On the Supabase setup screen, paste:
   - Your **Project URL**
   - Your **anon public** key
3. Click "Test Connection"
4. If successful, you'll move to encryption setup

**Troubleshooting**: If connection fails, verify:
- ✅ You copied the correct URL and key
- ✅ You ran the SQL schema script
- ✅ Your Supabase project is active (not paused)

### 3.3 Set Up Encryption

You have two options:

#### Option A: Master Password (More Secure)

**Pros:**
- Key never leaves your device
- Derived from a password you remember
- More secure than stored key

**Cons:**
- Must enter password each session
- Forgotten password = lost data forever

**Steps:**
1. Select "Master Password"
2. Create a strong password (minimum 8 characters)
3. Confirm the password
4. Click "Continue"

#### Option B: Random Key (More Convenient)

**Pros:**
- Automatically loaded from browser storage
- No password to remember

**Cons:**
- Less secure (key in localStorage)
- Must save key backup manually

**Steps:**
1. Select "Random Key"
2. Click "Continue"
3. **CRITICAL**: Copy the displayed encryption key
4. Save it in a password manager (1Password, Bitwarden, etc.)
5. Click "Copy to Clipboard"
6. Store it safely before proceeding

⚠️ **WARNING**: If you lose your encryption key, your data is permanently unrecoverable!

### 3.4 Complete Setup

Click "Start Using DATUM" and you'll be taken to your dashboard!

## Part 4: Optional AI Setup

If you want AI-powered insights:

### 4.1 Get an AI API Key

Choose ONE of these providers:

**Option 1: OpenAI**
1. Go to [https://platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to **API Keys**
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

**Option 2: Anthropic Claude**
1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to **API Keys**
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

### 4.2 Configure the App

1. Create a file named `.env.local` in the project root
2. Add your API key:

For OpenAI:
\`\`\`env
OPENAI_API_KEY=sk-your-key-here
\`\`\`

For Anthropic:
\`\`\`env
ANTHROPIC_API_KEY=sk-ant-your-key-here
\`\`\`

3. Restart the development server:
\`\`\`bash
# Press Ctrl+C to stop the server
npm run dev
\`\`\`

### 4.3 Privacy Note

When using AI features:
- Only last 30 days of data is sent
- Personal notes are anonymized
- Only spending patterns are analyzed
- No data is permanently stored by the AI

## Part 5: Daily Usage

### Adding Your First Transaction

1. Click "+ Add Transaction" in the dashboard
2. Fill in:
   - **Amount**: The transaction value
   - **Type**: Expense, Income, or Investment
   - **Date**: When it occurred (defaults to today)
   - **Category**: Choose from the dropdown
   - **Tags**: Add custom tags (e.g., `#lunch`, `#work`)
   - **Mood**: How you felt about this transaction
   - **Notes**: Any additional context
3. Click "Save"

### Understanding the Dashboard

- **Quick Stats**: Month-to-date summary
- **Where It Went**: Category breakdown
- **Mood Monitor**: Emotional spending patterns
- **Recent Transactions**: Latest activity
- **Daily Insight**: AI coaching (if enabled)

## Part 6: Backup & Recovery

### Backing Up Your Data

**Option 1: Export Data** (Coming Soon)
- Click Settings → Export Data
- Download JSON or CSV file
- Store safely offline

**Option 2: Supabase Backup**
- Your data is in YOUR Supabase database
- Supabase automatically backs up daily
- You can also export from Supabase dashboard

### Backing Up Your Encryption Key

**If using Master Password:**
- Just remember your password!
- Write it down and store securely
- Use a password manager

**If using Random Key:**
- Already stored in localStorage
- **MUST** also save a backup copy
- Store in password manager
- Consider printing and storing physically

### Recovering Access

**If you lose your encryption key:**
- Unfortunately, your encrypted data is unrecoverable
- This is by design for maximum security
- You can only start fresh with a new key

**If you lose Supabase credentials:**
- Log into supabase.com to retrieve them
- Go to Settings → API to get your keys
- Your data is safe in your Supabase project

## Part 7: Multi-Device Usage

### Using DATUM on Multiple Devices

1. On each new device:
   - Install and run DATUM
   - Complete onboarding with SAME Supabase credentials
   - Use SAME encryption key/password
2. Your data automatically syncs via Supabase!

### Sync Limitations

- Changes sync when you refresh the page
- Real-time updates coming soon
- Both devices must use identical encryption keys

## Troubleshooting

### "Cannot connect to Supabase"
- ✅ Check URL and anon key are correct
- ✅ Verify SQL schema was run successfully
- ✅ Check project isn't paused (Supabase free tier auto-pauses after 7 days inactivity)

### "Decryption failed"
- ✅ Verify you're using the correct encryption key
- ✅ Check if you recently changed your master password
- ✅ Ensure same key is used across all devices

### "AI insights not working"
- ✅ Check `.env.local` file exists with API key
- ✅ Restart development server after adding .env
- ✅ Verify API key is valid and has credits
- ✅ Add at least a few transactions first

### Build/TypeScript errors
- ✅ Run `npm install` to ensure all dependencies installed
- ✅ Delete `node_modules` and `.next` folders, then reinstall
- ✅ Check Node.js version is 18 or higher

## Next Steps

- Add your first transaction
- Create custom categories and tags
- Set financial goals
- Explore the What-If forecasting lab
- Try the AI Insight Coach

Enjoy your journey to financial mindfulness! 🧘💰
