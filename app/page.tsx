'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import OnboardingWizard from '@/components/onboarding-wizard';

export default function HomePage() {
  const router = useRouter();
  const { isOnboarded, initialize } = useAppStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isOnboarded) {
      router.push('/dashboard');
    }
  }, [isOnboarded, router]);

  if (isOnboarded) {
    return null; // Will redirect
  }

  return <OnboardingWizard />;
}
