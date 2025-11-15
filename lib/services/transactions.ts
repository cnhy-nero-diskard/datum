'use client';

/**
 * Transaction Service
 * Handles CRUD operations for transactions with encryption/decryption
 */

import { getSupabaseClient } from '../supabase';
import { encryptData, decryptData } from '../encryption';
import { Transaction, TransactionFormData, Tag } from '../types';

/**
 * Creates a new transaction with encryption
 */
export async function createTransaction(
  data: TransactionFormData,
  encryptionKey: string
): Promise<Transaction> {
  const supabase = getSupabaseClient();

  // Encrypt sensitive fields
  const encryptedAmount = await encryptData(data.amount.toString(), encryptionKey);
  const encryptedNotes = data.notes
    ? await encryptData(data.notes, encryptionKey)
    : null;

  // Insert transaction
  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert({
      encrypted_amount: encryptedAmount.encrypted,
      iv_amount: encryptedAmount.iv,
      type: data.type,
      transaction_date: data.transaction_date,
      category_id: data.category_id || null,
      mood: data.mood || null,
      encrypted_notes: encryptedNotes?.encrypted || null,
      iv_notes: encryptedNotes?.iv || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }

  // Handle tags
  if (data.tags && data.tags.length > 0) {
    await associateTags(transaction.id, data.tags);
  }

  // Decrypt and return
  const decrypted = await decryptTransaction(transaction, encryptionKey);
  return decrypted;
}

/**
 * Updates an existing transaction
 */
export async function updateTransaction(
  id: string,
  data: Partial<TransactionFormData>,
  encryptionKey: string
): Promise<Transaction> {
  const supabase = getSupabaseClient();

  // Build update object
  const updateData: any = {};

  if (data.amount !== undefined) {
    const encryptedAmount = await encryptData(data.amount.toString(), encryptionKey);
    updateData.encrypted_amount = encryptedAmount.encrypted;
    updateData.iv_amount = encryptedAmount.iv;
  }

  if (data.type) updateData.type = data.type;
  if (data.transaction_date) updateData.transaction_date = data.transaction_date;
  if (data.category_id !== undefined) updateData.category_id = data.category_id;
  if (data.mood !== undefined) updateData.mood = data.mood;

  if (data.notes !== undefined) {
    if (data.notes) {
      const encryptedNotes = await encryptData(data.notes, encryptionKey);
      updateData.encrypted_notes = encryptedNotes.encrypted;
      updateData.iv_notes = encryptedNotes.iv;
    } else {
      updateData.encrypted_notes = null;
      updateData.iv_notes = null;
    }
  }

  updateData.updated_at = new Date().toISOString();

  // Update transaction
  const { data: transaction, error } = await supabase
    .from('transactions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }

  // Update tags if provided
  if (data.tags !== undefined) {
    // Remove existing tags
    await supabase.from('transaction_tags').delete().eq('transaction_id', id);
    // Add new tags
    if (data.tags.length > 0) {
      await associateTags(id, data.tags);
    }
  }

  // Decrypt and return
  const decrypted = await decryptTransaction(transaction, encryptionKey);
  return decrypted;
}

/**
 * Deletes a transaction
 */
export async function deleteTransaction(id: string): Promise<void> {
  const supabase = getSupabaseClient();

  // Delete transaction (cascade will handle tags)
  const { error } = await supabase.from('transactions').delete().eq('id', id);

  if (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
}

/**
 * Gets transactions with optional filters
 */
export async function getTransactions(
  encryptionKey: string,
  options?: {
    limit?: number;
    offset?: number;
    categoryId?: string;
    type?: string;
    mood?: string;
    startDate?: string;
    endDate?: string;
    tagIds?: string[];
  }
): Promise<Transaction[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(*),
      transaction_tags(
        tag:tags(*)
      )
    `
    )
    .order('transaction_date', { ascending: false });

  // Apply filters
  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId);
  }
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  if (options?.mood) {
    query = query.eq('mood', options.mood);
  }
  if (options?.startDate) {
    query = query.gte('transaction_date', options.startDate);
  }
  if (options?.endDate) {
    query = query.lte('transaction_date', options.endDate);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data: transactions, error } = await query;

  if (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }

  // Decrypt all transactions
  const decrypted = await Promise.all(
    transactions.map((t) => decryptTransaction(t, encryptionKey))
  );

  // Filter by tags if needed (post-query filtering)
  if (options?.tagIds && options.tagIds.length > 0) {
    return decrypted.filter((t) =>
      t.tags?.some((tag) => options.tagIds!.includes(tag.id))
    );
  }

  return decrypted;
}

/**
 * Gets a single transaction by ID
 */
export async function getTransactionById(
  id: string,
  encryptionKey: string
): Promise<Transaction | null> {
  const supabase = getSupabaseClient();

  const { data: transaction, error } = await supabase
    .from('transactions')
    .select(
      `
      *,
      category:categories(*),
      transaction_tags(
        tag:tags(*)
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction');
  }

  return decryptTransaction(transaction, encryptionKey);
}

/**
 * Associates tags with a transaction (creates tags if they don't exist)
 */
async function associateTags(transactionId: string, tagNames: string[]): Promise<void> {
  const supabase = getSupabaseClient();

  for (const tagName of tagNames) {
    // Check if tag exists
    let { data: existingTag } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tagName.toLowerCase())
      .single();

    let tagId: string;

    if (existingTag) {
      tagId = existingTag.id;
    } else {
      // Create new tag
      const { data: newTag, error: tagError } = await supabase
        .from('tags')
        .insert({ name: tagName.toLowerCase() })
        .select('id')
        .single();

      if (tagError) {
        console.error('Error creating tag:', tagError);
        continue;
      }

      tagId = newTag.id;
    }

    // Associate tag with transaction
    await supabase.from('transaction_tags').insert({
      transaction_id: transactionId,
      tag_id: tagId,
    });
  }
}

/**
 * Decrypts a transaction object
 */
async function decryptTransaction(
  transaction: any,
  encryptionKey: string
): Promise<Transaction> {
  // Decrypt amount
  const amount = parseFloat(
    await decryptData(transaction.encrypted_amount, transaction.iv_amount, encryptionKey)
  );

  // Decrypt notes if present
  let notes: string | undefined;
  if (transaction.encrypted_notes && transaction.iv_notes) {
    notes = await decryptData(
      transaction.encrypted_notes,
      transaction.iv_notes,
      encryptionKey
    );
  }

  // Extract tags from junction table
  const tags: Tag[] = transaction.transaction_tags
    ? transaction.transaction_tags.map((tt: any) => tt.tag)
    : [];

  return {
    ...transaction,
    amount,
    notes,
    tags,
  };
}

/**
 * Gets all tags
 */
export async function getTags(): Promise<Tag[]> {
  const supabase = getSupabaseClient();

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }

  return tags;
}

/**
 * Gets all categories
 */
export async function getCategories() {
  const supabase = getSupabaseClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return categories;
}
