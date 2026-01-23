
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: any;
  photoPath?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  goalId?: string;
}