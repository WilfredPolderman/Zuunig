import type { Budget } from '@/models/budget';
import firestore from '@react-native-firebase/firestore';

export async function getBudgetForMonth(userId: string, month: number, year: number): Promise<Budget | null> {
  const snap = await firestore()
    .collection('budgets')
    .where('userId', '==', userId)
    .where('month', '==', month)
    .where('year', '==', year)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Budget;
}

export async function updateBudgetForMonth(budgetId: string, newTotalBudget: number) {
  await firestore()
    .collection('budgets')
    .doc(budgetId)
    .update({
      totalBudget: newTotalBudget,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
}

export async function createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = firestore.FieldValue.serverTimestamp();
  const ref = await firestore()
    .collection('budgets')
    .add({
      ...budget,
      createdAt: now,
      updatedAt: now,
    });
  return ref.id;
}
