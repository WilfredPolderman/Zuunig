import type { Expense } from '@/models/expense';
import { useMemo } from 'react';

export function useExpenseStats(expenses: Expense[]) {
  return useMemo(() => {
    const today = new Date();
    const toDate = (d: any) => d?.toDate ? d.toDate() : new Date(d);

    const todaySpent = expenses
      .filter(e => {
        const date = toDate(e.date);
        return date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weekTotal = expenses
      .filter(e => {
        const date = toDate(e.date);
        return date >= startOfWeek && date < endOfWeek;
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return { todaySpent, weekAvg: weekTotal / 7 };
  }, [expenses]);
}
