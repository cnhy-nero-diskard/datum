'use client';

/**
 * Onboarding Wizard Component
 * Guides users through setting up their Supabase instance and encryption key
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { generateEncryptionKey, keyStorage, deriveKeyFromPassword } from '@/lib/encryption';
import { testSupabaseConnection, initializeSupabase, supabaseStorage } from '@/lib/supabase';
import { SupabaseConfig } from '@/lib/types';

type OnboardingStep = 'welcome' | 'supabase' | 'encryption' | 'complete';

export default function OnboardingWizard() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [usePassword, setUsePassword] = useState(true);
  const [generatedKey, setGeneratedKey] = useState('');

  const { setOnboarded, setSupabaseConfig, setEncryptionKey } = useAppStore();

  const handleSupabaseSetup = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Please provide both Supabase URL and anon key');
      }

      if (!supabaseUrl.includes('supabase.co')) {
        throw new Error('Please provide a valid Supabase URL');
      }

      // Test connection
      const config: SupabaseConfig = {
        url: supabaseUrl,
        anonKey: supabaseKey,
      };

      const isConnected = await testSupabaseConnection(config);
      if (!isConnected) {
        throw new Error('Could not connect to Supabase. Please check your credentials and ensure you have run the SQL schema script.');
      }

      // Save config
      supabaseStorage.save(config);
      setSupabaseConfig(config);
      initializeSupabase(config);

      // Move to encryption setup
      setStep('encryption');
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Supabase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncryptionSetup = async () => {
    setError('');
    setIsLoading(true);

    try {
      let encKey: string;

      if (usePassword) {
        // Use password-based encryption
        if (!masterPassword) {
          throw new Error('Please enter a master password');
        }

        if (masterPassword.length < 8) {
          throw new Error('Master password must be at least 8 characters');
        }

        if (masterPassword !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Derive key from password
        const { key, salt } = await deriveKeyFromPassword(masterPassword);
        
        // Export the key to store
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        encKey = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
        
        keyStorage.save(encKey, salt);
      } else {
        // Generate random key
        encKey = await generateEncryptionKey();
        setGeneratedKey(encKey);
        keyStorage.save(encKey);
      }

      setEncryptionKey(encKey);
      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to set up encryption');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    setOnboarded(true);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Welcome to DATUM</CardTitle>
              <CardDescription className="text-base">
                Your Private Financial Mindfulness App
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🔐 You Own Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  DATUM is built on a unique principle: your financial data belongs to you, and only you.
                  We never store your data on our servers.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">🧘 Mindful Finance</h3>
                <p className="text-sm text-muted-foreground">
                  By manually logging each transaction, you become more aware of your spending habits
                  and make more intentional financial decisions.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">📊 Powerful Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered analysis of your spending patterns, mood-based tracking, and
                  sophisticated forecasting tools.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-amber-900 mb-2">Before You Begin</h4>
                <p className="text-sm text-amber-800">
                  You'll need to create your own free Supabase account and run a simple SQL script.
                  Don't worry—we'll guide you through every step!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setStep('supabase')} className="w-full" size="lg">
                Get Started →
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Supabase Setup Step */}
        {step === 'supabase' && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Connect Your Supabase Database</CardTitle>
              <CardDescription>
                Set up your personal database in just a few minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-blue-900">Quick Setup Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">supabase.com</a> and create a free account</li>
                  <li>Create a new project (choose any name and password)</li>
                  <li>Go to Settings → API in your project</li>
                  <li>Copy your "Project URL" and "anon public" key</li>
                  <li>Go to the SQL Editor and run the schema script from <code className="bg-blue-100 px-1 rounded">supabase-schema.sql</code> in this project</li>
                </ol>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase Project URL</Label>
                  <Input
                    id="supabase-url"
                    type="url"
                    placeholder="https://xxxxx.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supabase-key">Supabase Anon Key</Label>
                  <Input
                    id="supabase-key"
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('welcome')} disabled={isLoading}>
                ← Back
              </Button>
              <Button onClick={handleSupabaseSetup} disabled={isLoading}>
                {isLoading ? 'Connecting...' : 'Test Connection →'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Encryption Setup Step */}
        {step === 'encryption' && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Set Up Encryption</CardTitle>
              <CardDescription>
                Protect your data with end-to-end encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">🔒 Your Data, Your Key</h4>
                <p className="text-sm text-purple-800">
                  All sensitive data (amounts, notes, insights) is encrypted on your device before
                  being sent to your Supabase database. Even you can't read your data without the encryption key!
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={usePassword ? 'default' : 'outline'}
                    onClick={() => setUsePassword(true)}
                    className="flex-1"
                  >
                    Master Password
                  </Button>
                  <Button
                    variant={!usePassword ? 'default' : 'outline'}
                    onClick={() => setUsePassword(false)}
                    className="flex-1"
                  >
                    Random Key
                  </Button>
                </div>

                {usePassword ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="master-password">Create Master Password</Label>
                      <Input
                        id="master-password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={masterPassword}
                        onChange={(e) => setMasterPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        You'll need this password every time you access DATUM
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-semibold text-amber-900 mb-2">⚠️ Important</h4>
                    <p className="text-sm text-amber-800">
                      We'll generate a secure random key for you. You <strong>must</strong> save this key
                      in a password manager. If you lose it, your encrypted data cannot be recovered!
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('supabase')} disabled={isLoading}>
                ← Back
              </Button>
              <Button onClick={handleEncryptionSetup} disabled={isLoading}>
                {isLoading ? 'Setting up...' : 'Continue →'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <Card>
            <CardHeader>
              <CardTitle>🎉 You're All Set!</CardTitle>
              <CardDescription>
                Your private financial mindfulness journey begins now
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedKey && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 space-y-3">
                  <h4 className="font-bold text-red-900">⚠️ SAVE YOUR ENCRYPTION KEY</h4>
                  <p className="text-sm text-red-800 font-medium">
                    Copy this key and store it safely in a password manager. You will NOT see this again!
                  </p>
                  <div className="bg-white rounded p-3 font-mono text-xs break-all border border-red-200">
                    {generatedKey}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedKey);
                      alert('Key copied to clipboard!');
                    }}
                    className="w-full"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-semibold">Database Connected</h4>
                    <p className="text-sm text-muted-foreground">
                      Your personal Supabase instance is ready
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-semibold">Encryption Active</h4>
                    <p className="text-sm text-muted-foreground">
                      All your data will be encrypted before storage
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-semibold">100% Private</h4>
                    <p className="text-sm text-muted-foreground">
                      Only you have access to your financial data
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleComplete} className="w-full" size="lg">
                Start Using DATUM →
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
