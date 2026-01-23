import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface Category {
  id: string;
  userId: string;
  name: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}
