'use client';

/**
 * Recent Transactions List Component
 * Displays recent transactions with formatting and actions
 */

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { getTransactions, deleteTransaction } from '@/lib/services/transactions';
import { Transaction, MOOD_EMOJIS } from '@/lib/types';

interface RecentTransactionsProps {
  limit?: number;
  onEdit?: (transactionId: string) => void;
  onUpdate?: () => void;
}

export function RecentTransactions({
  limit = 5,
  onEdit,
  onUpdate,
}: RecentTransactionsProps) {
  const { encryptionKey } = useAppStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [onUpdate]);

  async function loadTransactions() {
    if (!encryptionKey) return;

    try {
      setIsLoading(true);
      const data = await getTransactions(encryptionKey, { limit });
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteTransaction(id);
      await loadTransactions();
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    } finally {
      setDeletingId(null);
    }
  }

  function formatAmount(amount: number, type: string) {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

    if (type === 'income') {
      return <span className="text-green-600 font-semibold">+{formatted}</span>;
    } else if (type === 'investment') {
      return <span className="text-blue-600 font-semibold">{formatted}</span>;
    } else {
      return <span className="text-red-600 font-semibold">-{formatted}</span>;
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case 'income':
        return '💰';
      case 'investment':
        return '📈';
      default:
        return '💸';
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            No transactions yet. Click "Add Transaction" to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{getTypeLabel(transaction.type)}</span>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {transaction.category && (
                      <span className="font-medium">{transaction.category.name}</span>
                    )}
                    {!transaction.category && (
                      <span className="font-medium text-muted-foreground">Uncategorized</span>
                    )}
                    {transaction.mood && (
                      <span className="text-lg">{MOOD_EMOJIS[transaction.mood]}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                    </span>
                    {transaction.tags && transaction.tags.length > 0 && (
                      <div className="flex gap-1">
                        {transaction.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {transaction.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{transaction.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {transaction.notes && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {transaction.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  {formatAmount(transaction.amount || 0, transaction.type)}
                </div>
                
                <div className="flex gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction.id)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                    className="h-8 w-8 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
