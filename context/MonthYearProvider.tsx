import React, { createContext, ReactNode, useContext, useState } from 'react';

interface MonthYearContextProps {
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
}

const MonthYearContext = createContext<MonthYearContextProps | undefined>(undefined);

export const MonthYearProvider = ({ children }: { children: ReactNode }) => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  return (
    <MonthYearContext.Provider value={{ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }}>
      {children}
    </MonthYearContext.Provider>
  );
};

export function useMonthYear() {
  const context = useContext(MonthYearContext);
  if (!context) {
    throw new Error('useMonthYear must be used within a MonthYearProvider');
  }
  return context;
}
