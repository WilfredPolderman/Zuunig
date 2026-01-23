export interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
}