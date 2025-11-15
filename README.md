# DATUM - Your Private Financial Mindfulness App

**DATUM** is a revolutionary personal finance application built on three core principles:

1. **🧘 Mindful Entry** - Manual transaction logging forces intentional financial awareness
2. **🔐 Data Sovereignty** - You own your data, stored in YOUR Supabase instance with end-to-end encryption
3. **📊 Powerful Insights** - AI-driven analysis and sophisticated forecasting tools

## 🎯 Philosophy

Unlike traditional finance apps that automatically sync with your bank accounts, DATUM requires you to manually log every transaction. This "friction by design" approach makes you more mindful of your spending habits. Your data is never stored on our servers—it lives in your personal Supabase database, encrypted with a key only you possess.

## ✨ Features

### Core Features
- **Manual Transaction Entry** with amount, type, date, category, tags, mood, and notes
- **Mood-Based Tracking** - Tag transactions with emotions (😊 Happy, 👍 Necessary, 🤔 Impulse, 😟 Regret)
- **Flexible Tagging System** - Create custom tags for deep analysis (#work, #lunch, #client-meeting)
- **Recurring Transaction Templates** - Create templates that require manual approval (maintaining mindfulness)

### Analysis & Insights
- **Where It Went** - Pie charts of spending by category
- **Mood Monitor** - Visualize your emotional relationship with money
- **Tag Deep Dive** - Analyze spending patterns by custom tags
- **Net Worth / Cash Flow** - Track income vs expenses over time
- **Goal Tracker** - Set and monitor financial goals
- **What-If Forecasting** - Scenario planning with goal integration

### AI-Powered Coach
- Pattern recognition and spending trend analysis
- Mindful nudges and positive reinforcement
- Conversational interface for financial questions
- Privacy-first: data is anonymized before AI analysis

### Data Management
- **CSV Import** - Quick start with existing data
- **JSON/CSV Export** - Full data ownership with easy export
- **Real-time Sync** - Automatic syncing across all your devices

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (User's own instance)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Recharts
- **AI**: Vercel AI SDK
- **State Management**: Zustand
- **Encryption**: Web Crypto API (AES-GCM with PBKDF2)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A free Supabase account ([supabase.com](https://supabase.com))

### Step 1: Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd datum
npm install
\`\`\`

### Step 2: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to start the onboarding process.

### Step 3: Set Up Your Supabase Database

The app will guide you through this, but here's a summary:

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose any name and password)
3. Go to **Settings → API** in your project
4. Copy your **Project URL** and **anon public** key
5. Go to the **SQL Editor** in Supabase
6. Open the `supabase-schema.sql` file from this project
7. Copy the entire SQL script and paste it into the SQL Editor
8. Click **Run** to create all necessary tables
9. Return to the DATUM app and enter your Supabase credentials

### Step 4: Set Up Encryption

Choose one of two options:

#### Option A: Master Password (Recommended)
- Create a strong master password (minimum 8 characters)
- You'll need this password every time you access DATUM
- More secure as the key is derived from your password

#### Option B: Random Key
- The app generates a cryptographically secure random key
- **CRITICAL**: You must save this key in a password manager
- If you lose this key, your encrypted data cannot be recovered!

### Step 5: Start Using DATUM

After setup, you'll be taken to your dashboard where you can:
- Add your first transaction
- Create custom categories and tags
- Set financial goals
- Explore AI-powered insights

## 🔐 Security & Privacy

### How Encryption Works

1. **Key Generation**: When you complete onboarding, a unique encryption key is generated
2. **Client-Side Encryption**: All sensitive data (amounts, notes, AI insights) is encrypted in your browser using AES-GCM before being sent to Supabase
3. **Zero-Knowledge**: Your Supabase database stores only encrypted ciphertext. Even you can't read your data without the encryption key!
4. **Key Storage**: 
   - Option A: Key is derived from your master password using PBKDF2 (100,000 iterations)
   - Option B: Key is stored in browser localStorage (less secure but more convenient)

### What's Encrypted?
✅ Transaction amounts  
✅ Transaction notes  
✅ Goal names and targets  
✅ AI insights  

### What's NOT Encrypted?
❌ Transaction dates (needed for date-based queries)  
❌ Transaction types (expense/income/investment)  
❌ Category and tag IDs (references to unencrypted lookup tables)  
❌ Mood tags (happy/necessary/impulse/regret)  

## 📁 Project Structure

\`\`\`
datum/
├── app/
│   ├── dashboard/          # Main dashboard pages
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (onboarding router)
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── onboarding-wizard.tsx
├── lib/
│   ├── encryption.ts       # Web Crypto API wrapper
│   ├── supabase.ts         # Supabase client wrapper
│   ├── store.ts            # Zustand state management
│   ├── types.ts            # TypeScript definitions
│   └── utils.ts            # Utility functions
├── supabase-schema.sql     # Database schema for user's Supabase
├── package.json
└── tailwind.config.js
\`\`\`

## 🎨 Customization

### Adding Custom Categories

Categories are stored in your Supabase database. You can add more through the UI or directly in your Supabase dashboard:

\`\`\`sql
INSERT INTO categories (name, icon, color) VALUES
    ('Groceries', '🛒', '#10b981'),
    ('Gym', '💪', '#f59e0b');
\`\`\`

### Modifying Dashboard Widgets

Dashboard widgets are configured in the `dashboard_widgets` table. You can customize the layout, add new widget types, or hide existing ones.

## 🤖 AI Setup (Optional)

To enable AI-powered insights, you need to configure an AI provider:

### Option 1: Using OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Create a `.env.local` file in the project root:

\`\`\`env
OPENAI_API_KEY=your-api-key-here
\`\`\`

### Option 2: Using Anthropic Claude

\`\`\`env
ANTHROPIC_API_KEY=your-api-key-here
\`\`\`

### ⚠️ Important: AI Privacy

When you use the AI Insight Coach:
- Only the last 30 days of transactions are sent to the AI
- Transaction notes and personal details are anonymized
- Only aggregated patterns are analyzed
- The AI never stores your data permanently

**If you're uncomfortable with this, you can use DATUM without AI features!**

## 🚧 Current Development Status

### ✅ Completed
- [x] Project initialization and configuration
- [x] Supabase SQL schema
- [x] Encryption utilities (Web Crypto API)
- [x] Onboarding wizard
- [x] Supabase client wrapper
- [x] State management (Zustand)
- [x] Basic dashboard layout

### 🔄 In Progress
- [ ] Transaction entry form with all fields
- [ ] Dashboard widgets (charts and visualizations)
- [ ] AI Insight Coach integration

### 📋 Planned
- [ ] Recurring transaction templates
- [ ] What-If forecasting lab
- [ ] Goal setting and tracking
- [ ] CSV import/export
- [ ] Real-time sync across devices
- [ ] Mobile responsive design improvements
- [ ] Dark mode support

## 🐛 Known Issues

1. **PowerShell Execution Policy**: If you encounter script execution errors, run PowerShell as Administrator and execute:
   \`\`\`powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   \`\`\`

2. **TypeScript Errors**: Some type errors may appear in development. These will be resolved as dependencies are fully installed.

## 📝 Contributing

This is a personal project, but contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project as you wish!

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI streaming utilities
- [Recharts](https://recharts.org/) - Composable charting library

## 💬 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Remember**: With great data sovereignty comes great responsibility. Always back up your encryption key and Supabase credentials!
