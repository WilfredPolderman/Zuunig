import { Expense } from "../expense";

export interface AllExpensesModalProps {
  visible: boolean;
  expenses: Expense[];
  onClose: () => void;
  onDelete?: (expenseId: string) => void;
}