/**
 * Type definitions for DATUM application
 */

export type TransactionType = 'expense' | 'income' | 'investment';

export type MoodType = 'happy' | 'necessary' | 'impulse' | 'regret';

export type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '😊',
  necessary: '👍',
  impulse: '🤔',
  regret: '😟',
};

export const MOOD_LABELS: Record<MoodType, string> = {
  happy: 'Happy / Worth It',
  necessary: 'Necessary / Planned',
  impulse: 'Impulse / Unplanned',
  regret: 'Regret / Stress',
};

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  encrypted_amount: string;
  type: TransactionType;
  transaction_date: string;
  category_id?: string;
  mood?: MoodType;
  encrypted_notes?: string;
  created_at: string;
  updated_at: string;
  // Decrypted fields (populated on client)
  amount?: number;
  notes?: string;
  // Related data
  category?: Category;
  tags?: Tag[];
}

export interface Goal {
  id: string;
  encrypted_name: string;
  encrypted_target_amount: string;
  target_date?: string;
  current_amount: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Decrypted fields
  name?: string;
  target_amount?: number;
}

export interface RecurringTemplate {
  id: string;
  encrypted_amount: string;
  type: TransactionType;
  category_id?: string;
  mood?: MoodType;
  encrypted_notes?: string;
  recurrence_pattern: RecurrencePattern;
  next_due_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Decrypted fields
  amount?: number;
  notes?: string;
  // Related data
  category?: Category;
  tags?: Tag[];
}

export interface PendingTransaction {
  id: string;
  template_id: string;
  encrypted_amount: string;
  type: TransactionType;
  proposed_date: string;
  category_id?: string;
  mood?: MoodType;
  encrypted_notes?: string;
  created_at: string;
  // Decrypted fields
  amount?: number;
  notes?: string;
  // Related data
  category?: Category;
  tags?: Tag[];
}

export interface DashboardWidget {
  id: string;
  widget_type: string;
  position: number;
  configuration?: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIInsight {
  id: string;
  encrypted_insight: string;
  insight_type?: string;
  created_at: string;
  // Decrypted field
  insight?: string;
}

export interface UserSettings {
  id: string;
  setting_key: string;
  setting_value?: string;
  created_at: string;
  updated_at: string;
}

// Form data interfaces (unencrypted, used in UI)
export interface TransactionFormData {
  amount: number;
  type: TransactionType;
  transaction_date: string;
  category_id?: string;
  mood?: MoodType;
  notes?: string;
  tags: string[];
}

export interface GoalFormData {
  name: string;
  target_amount: number;
  target_date?: string;
}

export interface RecurringTemplateFormData {
  amount: number;
  type: TransactionType;
  category_id?: string;
  mood?: MoodType;
  notes?: string;
  tags: string[];
  recurrence_pattern: RecurrencePattern;
  next_due_date: string;
}

// Analysis data structures
export interface CategorySpending {
  category: string;
  amount: number;
  count: number;
  color?: string;
}

export interface MoodSpending {
  mood: MoodType;
  amount: number;
  count: number;
}

export interface TagSpending {
  tag: string;
  amount: number;
  count: number;
}

export interface CashFlowData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

// Supabase configuration
export interface SupabaseConfig {
  url: string;
  anonKey: string;
}
