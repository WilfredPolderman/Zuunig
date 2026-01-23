import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Goal {
  id?: string;
  userId: string;
  name: string;
  target: number;
  saved: number;
  createdAt: FirebaseFirestoreTypes.Timestamp | number;
}