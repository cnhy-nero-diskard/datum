'use client';

/**
 * Global State Management with Zustand
 * Manages app-wide state including onboarding, encryption, and user data
 */

import { create } from 'zustand';
import { SupabaseConfig } from './types';

interface AppState {
  // Onboarding
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;

  // Supabase configuration
  supabaseConfig: SupabaseConfig | null;
  setSupabaseConfig: (config: SupabaseConfig) => void;

  // Encryption
  encryptionKey: string | null;
  setEncryptionKey: (key: string) => void;
  hasEncryptionKey: boolean;

  // UI State
  isTransactionModalOpen: boolean;
  setTransactionModalOpen: (value: boolean) => void;

  // Initialize from storage
  initialize: () => void;

  // Clear all data (logout)
  clearAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isOnboarded: false,
  supabaseConfig: null,
  encryptionKey: null,
  hasEncryptionKey: false,
  isTransactionModalOpen: false,

  setOnboarded: (value: boolean) => {
    set({ isOnboarded: value });
    if (typeof window !== 'undefined') {
      localStorage.setItem('datum_onboarded', value ? 'true' : 'false');
    }
  },

  setSupabaseConfig: (config: SupabaseConfig) => {
    set({ supabaseConfig: config });
  },

  setEncryptionKey: (key: string) => {
    set({ encryptionKey: key, hasEncryptionKey: true });
  },

  setTransactionModalOpen: (value: boolean) => {
    set({ isTransactionModalOpen: value });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;

    // Check onboarding status
    const onboarded = localStorage.getItem('datum_onboarded') === 'true';
    
    // Load Supabase config
    const configStr = localStorage.getItem('datum_supabase_config');
    const config = configStr ? JSON.parse(configStr) : null;

    // Check for encryption key
    const encryptionKey = localStorage.getItem('datum_encryption_key');
    const hasKey = !!encryptionKey;

    set({
      isOnboarded: onboarded,
      supabaseConfig: config,
      encryptionKey: encryptionKey,
      hasEncryptionKey: hasKey,
    });
  },

  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    set({
      isOnboarded: false,
      supabaseConfig: null,
      encryptionKey: null,
      hasEncryptionKey: false,
      isTransactionModalOpen: false,
    });
  },
}));
