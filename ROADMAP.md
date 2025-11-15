# DATUM Development Roadmap

## ✅ Phase 1: Foundation (COMPLETED)

- [x] Next.js 14 project setup with App Router
- [x] Tailwind CSS configuration
- [x] TypeScript configuration
- [x] shadcn/ui component library base
- [x] Complete Supabase SQL schema
- [x] Encryption system (AES-GCM + PBKDF2)
- [x] State management (Zustand)
- [x] Supabase client wrapper
- [x] Onboarding wizard (multi-step)
- [x] Basic dashboard layout
- [x] Comprehensive documentation

## 🔄 Phase 2: Core Transaction System (NEXT)

### Transaction Entry
- [ ] Create `components/transaction-modal.tsx`
  - [ ] Amount input with currency formatting
  - [ ] Type selector (Expense/Income/Investment)
  - [ ] Date picker (default: today)
  - [ ] Category dropdown (load from Supabase)
  - [ ] Tags input (multi-select, creatable)
  - [ ] Mood selector (emoji buttons)
  - [ ] Notes textarea
  - [ ] Form validation
  - [ ] Submit handler with encryption
- [ ] Create `lib/services/transactions.ts`
  - [ ] createTransaction() with encryption
  - [ ] updateTransaction()
  - [ ] deleteTransaction()
  - [ ] getTransactions() with decryption
  - [ ] getTransactionById()
  - [ ] Tag association logic

### Transaction Display
- [ ] Create `components/transactions-list.tsx`
  - [ ] Fetch and decrypt transactions
  - [ ] Format currency and dates
  - [ ] Category badges
  - [ ] Mood indicators
  - [ ] Tag chips
  - [ ] Edit button (opens modal)
  - [ ] Delete button with confirmation
- [ ] Add to dashboard recent transactions section
- [ ] Create `app/transactions/page.tsx`
  - [ ] Full list with pagination
  - [ ] Filters (date range, category, tags, mood)
  - [ ] Search functionality
  - [ ] Sort options

## 📊 Phase 3: Dashboard Widgets

### Widget Components
- [ ] Create `components/widgets/where-it-went.tsx`
  - [ ] Fetch transactions for current month
  - [ ] Aggregate by category
  - [ ] Pie chart using Recharts
  - [ ] Color code by category.color
  - [ ] Interactive tooltips
  - [ ] Legend with percentages
- [ ] Create `components/widgets/mood-monitor.tsx`
  - [ ] Aggregate by mood for current month
  - [ ] Bar chart with emoji labels
  - [ ] Comparison with previous month
  - [ ] Click to filter transactions by mood
- [ ] Create `components/widgets/cash-flow.tsx`
  - [ ] Aggregate income and expenses by month
  - [ ] Line chart (last 6 months)
  - [ ] Net calculation line
  - [ ] Toggle between 3/6/12 month views
- [ ] Create `components/widgets/goal-tracker.tsx`
  - [ ] Fetch active goals
  - [ ] Progress bars for each goal
  - [ ] Percentage complete
  - [ ] Quick actions (add contribution, view details)

### Widget System
- [ ] Create widget container/wrapper component
- [ ] Implement widget visibility toggles
- [ ] Add widget reordering (drag & drop)
- [ ] Save layout preferences to Supabase

## 🏷️ Phase 4: Categories & Tags Management

- [ ] Create `app/settings/categories/page.tsx`
  - [ ] List all categories
  - [ ] Add new category form
  - [ ] Edit category modal
  - [ ] Delete category (with confirmation)
  - [ ] Icon picker component
  - [ ] Color picker component
  - [ ] Reorder categories (drag & drop)
- [ ] Create `components/tag-manager.tsx`
  - [ ] List all tags with usage count
  - [ ] Rename tag
  - [ ] Merge tags functionality
  - [ ] Delete unused tags
  - [ ] Tag statistics

## 🎯 Phase 5: Goals System

- [ ] Create `components/goal-form.tsx`
  - [ ] Name input (encrypted)
  - [ ] Target amount input (encrypted)
  - [ ] Target date picker
  - [ ] Optional description
  - [ ] Validation
  - [ ] Encryption before save
- [ ] Create `app/goals/page.tsx`
  - [ ] List all goals (active and completed)
  - [ ] Create new goal button
  - [ ] Goal cards with progress
  - [ ] Filter: active/completed/all
- [ ] Create `app/goals/[id]/page.tsx`
  - [ ] Goal details
  - [ ] Progress chart
  - [ ] Transaction history for goal
  - [ ] Manually add/remove funds
  - [ ] Edit goal
  - [ ] Mark as complete
  - [ ] Delete goal
- [ ] Integrate with dashboard widget

## 🔄 Phase 6: Recurring Transactions

- [ ] Create `components/recurring-template-form.tsx`
  - [ ] All transaction fields
  - [ ] Recurrence pattern selector
    - [ ] Daily, Weekly, Bi-weekly, Monthly, Yearly
  - [ ] Start date
  - [ ] Next due date (auto-calculated)
  - [ ] Active/pause toggle
- [ ] Create `app/templates/page.tsx`
  - [ ] List all templates
  - [ ] Active/paused status
  - [ ] Next due date
  - [ ] Edit template
  - [ ] Delete template
  - [ ] Manually trigger template
- [ ] Create `app/pending/page.tsx`
  - [ ] List pending transactions from templates
  - [ ] Approve button → creates transaction
  - [ ] Edit before approving
  - [ ] Reject/skip button
  - [ ] Batch approve
- [ ] Create background job/cron to generate pending transactions
  - [ ] Check templates daily
  - [ ] Generate pending transactions for due dates
  - [ ] Update next_due_date

## 🤖 Phase 7: AI Insights Coach

### AI Infrastructure
- [ ] Create `lib/services/ai.ts`
  - [ ] aggregateTransactionData() - last 30 days
  - [ ] anonymizeData() - remove personal notes
  - [ ] buildAIContext() - format for LLM
  - [ ] generatePrompt() - coach personality
- [ ] Create `app/api/ai/chat/route.ts`
  - [ ] Integrate Vercel AI SDK
  - [ ] OpenAI or Anthropic client
  - [ ] Streaming response handler
  - [ ] Error handling
  - [ ] Rate limiting (if needed)

### AI UI
- [ ] Create `app/insights/page.tsx`
  - [ ] Chat interface
  - [ ] Message history
  - [ ] Streaming message display
  - [ ] Loading states
  - [ ] Error handling
  - [ ] "Ask a question" examples
- [ ] Create `components/widgets/daily-insight.tsx`
  - [ ] Display one AI insight
  - [ ] Refresh/regenerate button
  - [ ] Link to full insights page
  - [ ] Loading skeleton

### AI Prompt Engineering
- [ ] System prompt for financial coach personality
- [ ] Pattern detection prompts
- [ ] Positive reinforcement prompts
- [ ] Question answering prompts
- [ ] Test and refine prompts

## 🔮 Phase 8: What-If Forecasting Lab

- [ ] Create `app/forecast/page.tsx`
  - [ ] Scenario input form
    - [ ] Select category or tag
    - [ ] Percentage reduction/increase
    - [ ] Time period (1-12 months)
  - [ ] Calculation engine
    - [ ] Historical average calculation
    - [ ] Apply scenario changes
    - [ ] Project savings/costs
  - [ ] Results visualization
    - [ ] Current vs projected chart
    - [ ] Total savings/cost
    - [ ] Impact on active goals
  - [ ] Multiple scenario comparison
  - [ ] Save favorite scenarios

## 📥 Phase 9: Data Import/Export

### Import
- [ ] Create `components/import-csv.tsx`
  - [ ] File upload area (drag & drop)
  - [ ] CSV parser
  - [ ] Column mapping UI
    - [ ] Auto-detect columns
    - [ ] Manual column assignment
    - [ ] Preview data
  - [ ] Data validation
  - [ ] Category/tag matching or creation
  - [ ] Batch encryption
  - [ ] Progress indicator
  - [ ] Import summary
- [ ] Add to settings page

### Export
- [ ] Create `components/export-data.tsx`
  - [ ] Format selection (JSON/CSV)
  - [ ] Date range selector
  - [ ] Include options (transactions, goals, settings)
  - [ ] Decryption progress
  - [ ] Download handler
- [ ] Add to settings page

## ⚙️ Phase 10: Settings & Utilities

- [ ] Create `app/settings/page.tsx`
  - [ ] Supabase configuration display
  - [ ] Test connection button
  - [ ] Change encryption key flow
  - [ ] Export all data
  - [ ] Clear all data (with confirmation)
  - [ ] App version info
- [ ] Create `app/settings/security/page.tsx`
  - [ ] View encryption method
  - [ ] Change master password
  - [ ] Re-generate encryption key
  - [ ] Download encryption key backup

## 🔄 Phase 11: Real-time Sync

- [ ] Update Supabase client for realtime
- [ ] Subscribe to transaction changes
- [ ] Subscribe to goal changes
- [ ] Subscribe to category/tag changes
- [ ] Update UI on remote changes
- [ ] Conflict resolution strategy
- [ ] Toast notification for sync events

## 🎨 Phase 12: Polish & UX

### Design & Responsiveness
- [ ] Mobile responsive improvements
  - [ ] Optimize dashboard for mobile
  - [ ] Bottom navigation for mobile
  - [ ] Touch-friendly controls
- [ ] Dark mode implementation
  - [ ] Add theme toggle
  - [ ] Update all components
  - [ ] Store preference
- [ ] Improved animations
  - [ ] Page transitions
  - [ ] Modal animations
  - [ ] Chart animations

### User Experience
- [ ] Loading states for all async operations
- [ ] Error boundaries
- [ ] Toast notification system
- [ ] Empty states for all lists
- [ ] Keyboard shortcuts
  - [ ] Cmd/Ctrl + K for quick add transaction
  - [ ] Cmd/Ctrl + / for search
  - [ ] Arrow keys for navigation
- [ ] Data loading skeletons
- [ ] Optimistic UI updates

### Performance
- [ ] Implement React.memo for expensive components
- [ ] Virtual scrolling for long transaction lists
- [ ] Lazy load dashboard widgets
- [ ] Optimize Recharts rendering
- [ ] Cache decrypted data strategically

## 🚀 Phase 13: Advanced Features

### Analytics Deep Dive
- [ ] Create `app/analytics/page.tsx`
  - [ ] Spending trends over time
  - [ ] Category breakdown over time
  - [ ] Tag analysis
  - [ ] Mood correlation analysis
  - [ ] Day-of-week patterns
  - [ ] Time-of-day patterns
  - [ ] Custom date range reports

### Budgeting
- [ ] Create budget system
  - [ ] Set monthly budget per category
  - [ ] Track budget vs actual
  - [ ] Budget alerts
  - [ ] Budget rollover options

### Multi-Currency Support
- [ ] Add currency field to transactions
- [ ] Currency converter integration
- [ ] Multi-currency reporting

### Attachments
- [ ] Add receipt/image uploads
- [ ] Store in Supabase Storage (user's instance)
- [ ] Display in transaction details

## 📦 Phase 14: Deployment & Production

### Build & Deploy
- [ ] Environment variable configuration
- [ ] Build optimization
- [ ] Deploy to Vercel/Netlify
- [ ] Custom domain setup
- [ ] Performance monitoring

### Documentation
- [ ] User guide/help section
- [ ] Video tutorials
- [ ] FAQ section
- [ ] Troubleshooting guide

### Marketing
- [ ] Landing page
- [ ] Feature showcase
- [ ] Privacy policy
- [ ] Terms of service

---

## 📊 Progress Tracking

- **Phase 1**: ✅ 100% Complete
- **Phase 2**: ⬜ 0% Complete - START HERE
- **Phase 3**: ⬜ 0% Complete
- **Phase 4**: ⬜ 0% Complete
- **Phase 5**: ⬜ 0% Complete
- **Phase 6**: ⬜ 0% Complete
- **Phase 7**: ⬜ 0% Complete
- **Phase 8**: ⬜ 0% Complete
- **Phase 9**: ⬜ 0% Complete
- **Phase 10**: ⬜ 0% Complete
- **Phase 11**: ⬜ 0% Complete
- **Phase 12**: ⬜ 0% Complete
- **Phase 13**: ⬜ 0% Complete
- **Phase 14**: ⬜ 0% Complete

---

## 🎯 Recommended Build Order

For fastest time-to-value:

1. **Phase 2** - Transaction system (core feature)
2. **Phase 3** - Dashboard widgets (make it useful)
3. **Phase 4** - Categories management (customization)
4. **Phase 5** - Goals (key differentiator)
5. **Phase 7** - AI insights (wow factor)
6. **Phase 12** - Polish & UX (professional feel)
7. **Phase 6** - Recurring transactions (convenience)
8. **Phase 8** - Forecasting (power user feature)
9. **Phase 9** - Import/Export (data portability)
10. **Phase 10-14** - Everything else

---

**Current Status**: Foundation complete, ready to build features! 🚀
