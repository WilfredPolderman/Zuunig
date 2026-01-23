export async function updateExpense(
  expenseId: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const now = firestore.FieldValue.serverTimestamp();
  await firestore()
    .collection('expenses')
    .doc(expenseId)
    .update({
      ...updates,
      updatedAt: now,
    });
}
import type { Expense } from '@/models/expense';
import firestore from '@react-native-firebase/firestore';

export async function addExpense(
  expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const now = firestore.FieldValue.serverTimestamp();
  let dateValue = expense.date;
  if (expense.date instanceof Date) {
    dateValue = firestore.Timestamp.fromDate(expense.date);
  }
  const ref = await firestore()
    .collection('expenses')
    .add({
      ...expense,
      date: dateValue,
      createdAt: now,
      updatedAt: now,
    });
  return ref.id;
}

export async function getExpensesForMonth(
  userId: string,
  month: number,
  year: number
): Promise<Expense[]> {
  const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const startOfNextMonth = new Date(year, month, 1, 0, 0, 0, 0);
  const snap = await firestore()
    .collection('expenses')
    .where('userId', '==', userId)
    .where('date', '>=', firestore.Timestamp.fromDate(startOfMonth))
    .where('date', '<', firestore.Timestamp.fromDate(startOfNextMonth))
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
}

export async function deleteExpense(expenseId: string): Promise<void> {
  const expenseRef = firestore().collection('expenses').doc(expenseId);
  const expenseSnap = await expenseRef.get();
  if (expenseSnap.exists()) {
    const expense = expenseSnap.data() as Expense;
    if (expense.goalId && typeof expense.amount === 'number') {
      await firestore().collection('goals').doc(expense.goalId).update({
        saved: firestore.FieldValue.increment(-expense.amount),
      });
    }
  }
  await expenseRef.delete();
}