'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { TransactionModal } from '@/components/transaction-modal';
import { RecentTransactions } from '@/components/recent-transactions';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleTransactionSuccess() {
    setRefreshKey((prev) => prev + 1);
  }

  function handleEditTransaction(id: string) {
    setEditingTransactionId(id);
    setIsTransactionModalOpen(true);
  }

  function handleCloseModal() {
    setIsTransactionModalOpen(false);
    setEditingTransactionId(undefined);
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">DATUM</h1>
            <p className="text-sm text-muted-foreground">Your Financial Mindfulness Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsTransactionModalOpen(true)} size="lg">
              + Add Transaction
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-muted-foreground">
            Ready to log your financial journey? Start by adding your first transaction.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl">$0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-3xl">$0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">This Month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Net</CardDescription>
              <CardTitle className="text-3xl">$0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Income - Expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Transactions</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">This Month</p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Widgets Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Where It Went</CardTitle>
              <CardDescription>Spending by category this month</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
              No transactions yet. Add your first transaction to see insights!
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mood Monitor</CardTitle>
              <CardDescription>How you felt about your spending</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
              Track your emotional relationship with money
            </CardContent>
          </Card>

          <RecentTransactions 
            limit={5} 
            onEdit={handleEditTransaction}
            onUpdate={handleTransactionSuccess}
            key={refreshKey}
          />

          <Card>
            <CardHeader>
              <CardTitle>Daily Insight</CardTitle>
              <CardDescription>AI-powered financial coaching</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
              Add transactions to get personalized insights
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        open={isTransactionModalOpen}
        onOpenChange={handleCloseModal}
        transactionId={editingTransactionId}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
}
