'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { initializeSupabase } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isOnboarded, supabaseConfig, initialize } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isOnboarded) {
      router.push('/');
      return;
    }

    // Initialize Supabase client if config exists
    if (supabaseConfig) {
      try {
        initializeSupabase(supabaseConfig);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        router.push('/');
      }
    }
  }, [isOnboarded, supabaseConfig, router]);

  if (!isOnboarded) {
    return null;
  }

  return <>{children}</>;
}
