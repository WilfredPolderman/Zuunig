// Voeg basiscategorieën toe voor een gebruiker als ze nog niet bestaan
export async function addDefaultCategories(userId: string) {
  const defaultNames = [
    'Boodschappen',
    'Vervoer',
    'Wonen',
    'Gezondheid',
    'Vrije tijd',
    'Overig',
  ];
  const existing = await getCategories(userId);
  const existingNames = new Set(existing.map(c => c.name));
  for (const name of defaultNames) {
    if (!existingNames.has(name)) {
      await addCategory(userId, name);
    }
  }
}
import type { Category } from '@/models/category';
import firestore from '@react-native-firebase/firestore';

export async function getCategories(userId: string): Promise<Category[]> {
  const snap = await firestore()
    .collection('categories')
    .where('userId', '==', userId)
    .orderBy('name')
    .get();
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(userId: string, name: string): Promise<string> {
  const now = firestore.FieldValue.serverTimestamp();
  const ref = await firestore()
    .collection('categories')
    .add({
      userId,
      name,
      createdAt: now,
      updatedAt: now,
    });
  return ref.id;
}
