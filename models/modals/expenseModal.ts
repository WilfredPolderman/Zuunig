import { Expense } from '../expense';

export interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    amount: number,
    category: string,
    description: string,
    photoPath?: string,
    location?: { latitude: number; longitude: number },
    address?: string,
    goalId?: string
  ) => void;
  initialExpense?: Partial<Expense>;
}