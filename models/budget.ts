import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

export interface Budget {
  id: string
  userId: string
  month: number // 1-12
  year: number
  totalBudget: number
  createdAt: FirebaseFirestoreTypes.Timestamp
  updatedAt: FirebaseFirestoreTypes.Timestamp
}
