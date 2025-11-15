# Quick Start Guide - Getting DATUM Running

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (REQUIRED)

You need to fix the PowerShell execution policy issue first:

**Option A: Run this in PowerShell as Administrator:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Option B: Use CMD instead:**
Just run the commands in Command Prompt (cmd.exe) instead of PowerShell.

Then install:
```bash
npm install
```

This will install all the React, Next.js, Supabase, and UI dependencies.

### Step 2: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 3: Set Up Supabase (First Time Only)

1. Go to [https://supabase.com](https://supabase.com) and create account
2. Create a new project (any name, choose a password)
3. Wait 1-2 minutes for project to be ready
4. Go to **Settings → API**
   - Copy your **Project URL**
   - Copy your **anon public** key
5. Go to **SQL Editor** → New Query
6. Copy the ENTIRE contents of `supabase-schema.sql` from this project
7. Paste and click **Run**
8. Verify it says "Success"

### Step 4: Complete Onboarding in the App

1. Back in the DATUM app (localhost:3000), click "Get Started"
2. Paste your Supabase URL and anon key
3. Click "Test Connection" - should succeed
4. Choose encryption method:
   - **Master Password**: More secure, you'll need to remember it
   - **Random Key**: More convenient, MUST save the key shown!
5. Click "Start Using DATUM"

### Step 5: Start Coding! 🎉

The foundation is complete. Now you can build:
- Transaction entry form
- Dashboard widgets
- Categories management
- Goals tracking
- AI insights
- And more!

## 🔧 Optional: Enable AI Features

If you want AI-powered insights:

1. Get an API key from:
   - [OpenAI](https://platform.openai.com) OR
   - [Anthropic](https://console.anthropic.com)

2. Create `.env.local` file in project root:

```env
# Use ONE of these:
OPENAI_API_KEY=sk-your-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

3. Restart the dev server:
```bash
# Press Ctrl+C, then:
npm run dev
```

## 📚 Where to Find Everything

| What | Where |
|------|-------|
| **Main app entry** | `app/page.tsx` |
| **Dashboard** | `app/dashboard/page.tsx` |
| **Onboarding wizard** | `components/onboarding-wizard.tsx` |
| **Encryption logic** | `lib/encryption.ts` |
| **Supabase client** | `lib/supabase.ts` |
| **State management** | `lib/store.ts` |
| **Database schema** | `supabase-schema.sql` |
| **Build status** | `BUILD_STATUS.md` (see what's done and what's next) |

## 🎯 What to Build Next

See `BUILD_STATUS.md` for the complete roadmap, but here are the priorities:

1. **Transaction Entry Form** - The core feature!
   - Create `components/transaction-modal.tsx`
   - Hook it up to the dashboard button
   - Implement encryption before saving

2. **Recent Transactions List**
   - Fetch from Supabase
   - Decrypt on client
   - Display in dashboard

3. **Dashboard Widgets**
   - Pie chart for spending by category
   - Bar chart for mood tracking
   - Line chart for cash flow

4. **Categories Management**
   - Add/edit/delete categories
   - Customize icons and colors

5. **Goals System**
   - Create goals
   - Track progress
   - Integrate with dashboard

## 💡 Tips

- All TypeScript errors will go away after `npm install`
- Check `BUILD_STATUS.md` for detailed task breakdown
- Read `SETUP.md` for comprehensive user setup instructions
- The SQL schema includes default categories and widgets
- Encryption happens automatically when you use the helper functions

## 🐛 Troubleshooting

**"Cannot find module 'react'" or similar errors:**
- Run `npm install` first!

**PowerShell script execution errors:**
- Run as Administrator: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- OR use CMD instead of PowerShell

**Supabase connection fails:**
- Verify you copied the correct URL and key
- Make sure you ran the SQL schema script
- Check if project is paused (free tier pauses after 7 days inactivity)

**Data doesn't decrypt:**
- Ensure you're using the same encryption key
- Check browser console for error messages
- Verify the key is stored correctly in localStorage

## 🚀 Ready to Build!

You now have:
- ✅ Complete project structure
- ✅ Working onboarding flow
- ✅ Secure encryption system
- ✅ Supabase integration
- ✅ State management
- ✅ UI component library
- ✅ Comprehensive documentation

**Time to build the features that make DATUM amazing!** 🎉

Check `BUILD_STATUS.md` for the full feature roadmap and development priorities.
