'use client';

/**
 * Supabase Client Wrapper
 * Handles connection to user's own Supabase instance
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from './types';

let supabaseClient: SupabaseClient | null = null;

/**
 * Initializes Supabase client with user's credentials
 */
export function initializeSupabase(config: SupabaseConfig): SupabaseClient {
  if (!config.url || !config.anonKey) {
    throw new Error('Supabase URL and anon key are required');
  }

  supabaseClient = createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false, // We don't use Supabase auth
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  return supabaseClient;
}

/**
 * Gets the current Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Please complete onboarding first.');
  }
  return supabaseClient;
}

/**
 * Checks if Supabase client is initialized
 */
export function isSupabaseInitialized(): boolean {
  return supabaseClient !== null;
}

/**
 * Clears the Supabase client (for logout/reset)
 */
export function clearSupabaseClient(): void {
  supabaseClient = null;
}

/**
 * Tests the Supabase connection
 */
export async function testSupabaseConnection(config: SupabaseConfig): Promise<boolean> {
  try {
    const testClient = createClient(config.url, config.anonKey);
    const { error } = await testClient.from('categories').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

/**
 * Storage helper for Supabase credentials
 */
export const supabaseStorage = {
  CONFIG_KEY: 'datum_supabase_config',

  save(config: SupabaseConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
  },

  get(): SupabaseConfig | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(this.CONFIG_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.CONFIG_KEY);
  },

  exists(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.CONFIG_KEY) !== null;
  },
};
