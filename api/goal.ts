
import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Goal {
  id?: string;
  userId: string;
  name: string;
  target: number;
  saved: number;
  createdAt: FirebaseFirestoreTypes.Timestamp | number;
}

export async function createGoal(name: string, target: number): Promise<Goal> {
  const user = auth().currentUser;
  if (!user) throw new Error('Niet ingelogd');
  const now = firestore.FieldValue.serverTimestamp();
  const ref = await firestore()
    .collection('goals')
    .add({
      userId: user.uid,
      name,
      target,
      saved: 0,
      createdAt: now,
    });
  const docSnap = await ref.get();
  return { id: docSnap.id, ...docSnap.data() } as Goal;
}

export async function getGoals(): Promise<Goal[]> {
  const user = auth().currentUser;
  if (!user) throw new Error('Niet ingelogd');
  const snap = await firestore()
    .collection('goals')
    .where('userId', '==', user.uid)
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
}

export async function getGoalById(goalId: string): Promise<Goal | null> {
  const docSnap = await firestore().collection('goals').doc(goalId).get();
  if (!docSnap.exists) return null;
  return { id: docSnap.id, ...docSnap.data() } as Goal;
}

export async function addToGoal(goalId: string, amount: number): Promise<void> {
  await firestore().collection('goals').doc(goalId).update({
    saved: firestore.FieldValue.increment(amount),
  });
}

export async function deleteGoal(goalId: string): Promise<void> {
  const expensesSnap = await firestore()
    .collection('expenses')
    .where('goalId', '==', goalId)
    .get();
  const batch = firestore().batch();
    expensesSnap.forEach(doc => batch.update(doc.ref, { goalId: null }));
  await batch.commit();
    await firestore().collection('goals').doc(goalId).delete();
}

export async function updateGoal(goalId: string, data: Partial<Pick<Goal, 'name' | 'target'>>): Promise<void> {
  await firestore().collection('goals').doc(goalId).update(data);
}
