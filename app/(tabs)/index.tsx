import { createBudget, getBudgetForMonth, updateBudgetForMonth } from '@/api/budget'
import { addExpense, getExpensesForMonth } from '@/api/expense'
import BudgetCard from '@/components/Cards/BudgetCard'
import ExpenseStatsCard from '@/components/Cards/expenseStats'
import AllExpensesModal from '@/components/modals/AllExpensesModal'
import ExpenseModal from '@/components/modals/ExpenseModal'
import MonthSelector from '@/components/modals/monthSelectorModal'
import { useMonthYear } from '@/context/MonthYearProvider'
import { ThemeContext } from '@/context/ThemeProvider'
import { useExpenseStats } from '@/hooks/useExpenseStats'
import useUser from '@/hooks/useUser'
import type { Expense } from '@/models/expense'
import { MaterialIcons } from '@expo/vector-icons'
import { Timestamp } from '@react-native-firebase/firestore'
import * as Location from 'expo-location'
import type { FunctionComponent } from 'react'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Home: FunctionComponent = () => {
  const { colors, padding } = useContext(ThemeContext)
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useMonthYear()

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
    }
  }, []);
  const user = useUser()
  const [budget, setBudget] = useState<number | null>(null)
  const [budgetId, setBudgetId] = useState<string | null>(null)
  const [spent, setSpent] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [expenseModalVisible, setExpenseModalVisible] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [showCamera, setShowCamera] = useState(false)
  const [expensesModalVisible, setExpensesModalVisible] = useState(false)

  useEffect(() => {
    if (user) {
      setLoading(true)
      getBudgetForMonth(user.uid, selectedMonth, selectedYear).then(b => {
        setBudget(b?.totalBudget ?? 0)
        setBudgetId(b?.id ?? null)
        setLoading(false)
      })
      getExpensesForMonth(user.uid, selectedMonth, selectedYear).then(expenses => {
        setExpenses(expenses)
        const total = expenses.reduce((sum, e) => sum + e.amount, 0)
        setSpent(total)
      })
    }
  }, [user, selectedMonth, selectedYear])

  async function handleEditBudget(newBudget: number) {
    if (budgetId) {
      await updateBudgetForMonth(budgetId, newBudget)
      setBudget(newBudget)
    } else if (user) {
      const id = await createBudget({
        userId: user.uid,
        month: selectedMonth,
        year: selectedYear,
        totalBudget: newBudget,
      })
      setBudget(newBudget)
      setBudgetId(id)
    }
  }

  async function handleAddExpense(amount: number, category: string, description: string, photoPath?: string, location?: { latitude: number; longitude: number }, address?: string, goalId?: string) {
    if (!user) return;
    const now = new Date();
    const firestoreDate = Timestamp.fromDate(now);
    await addExpense({
      userId: user.uid,
      amount,
      category,
      description,
      date: firestoreDate,
      ...(photoPath ? { photoPath } : {}),
      ...(location ? { location } : {}),
      ...(address ? { address } : {}),
      ...(goalId ? { goalId } : {}),
    });
    const expenses = await getExpensesForMonth(user.uid, selectedMonth, selectedYear);
    setExpenses([...expenses]);
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    setSpent(total);
    setExpenseModalVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <MonthSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelect={(month, year) => {
            setSelectedMonth(month)
            setSelectedYear(year)
          }}
        />
        <BudgetCard totalBudget={budget ?? 0} spent={spent} onEdit={handleEditBudget} />
        {(() => {
          const { todaySpent, weekAvg } = useExpenseStats(expenses);
          return <ExpenseStatsCard todaySpent={todaySpent} weekAvg={weekAvg} />;
        })()}

        <View style={[styles.recentCard, {
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 4,
          alignItems: 'center',
        }]}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.text, marginBottom: 8, textAlign: 'center' }}>Laatste 3 uitgaven</Text>
          {[...expenses]
            .sort((a, b) => {
              let dateA: Date;
              let dateB: Date;
              if (a.date && typeof a.date.toDate === 'function') {
                dateA = a.date.toDate();
              } else if (typeof a.date === 'string' || typeof a.date === 'number') {
                dateA = new Date(a.date);
              } else {
                dateA = new Date(0);
              }
              if (b.date && typeof b.date.toDate === 'function') {
                dateB = b.date.toDate();
              } else if (typeof b.date === 'string' || typeof b.date === 'number') {
                dateB = new Date(b.date);
              } else {
                dateB = new Date(0);
              }
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 3)
            .map(exp => (
              <View key={exp.id} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8, width: '100%' }}>
                <Text style={{ flex: 1, color: colors.text, textAlign: 'center' }}>{exp.category}</Text>
                <Text style={{ flex: 1, textAlign: 'center', color: colors.text }}>€{exp.amount.toFixed(2)}</Text>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  {!!exp.description && (
                    <Text style={{ color: colors.textSecondary, textAlign: 'center', fontSize: 13 }}>{exp.description}</Text>
                  )}
                  {exp.address && (
                    <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: exp.description ? 2 : 0, fontStyle: 'italic' }}>
                      {exp.address}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          {expenses.length === 0 && <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>Geen uitgaven</Text>}
          <View style={{ alignItems: 'center', marginTop: 8, width: '100%' }}>
            <TouchableOpacity onPress={() => setExpensesModalVisible(true)}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Bekijk alles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setExpenseModalVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={40} color="#222" />
      </TouchableOpacity>
      <ExpenseModal
        visible={expenseModalVisible}
        onClose={() => setExpenseModalVisible(false)}
        onSave={async (
          amount: number,
          category: string,
          description: string,
          photoPath?: string
        ): Promise<void> => {
          let locationObj: { latitude: number; longitude: number } | undefined = undefined;
          let address: string | undefined = undefined;
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const loc = await Location.getCurrentPositionAsync({});
              locationObj = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              };
              const geocode = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
              if (geocode && geocode.length > 0) {
                const g = geocode[0];
                // Alleen stad/dorp en land tonen
                address = [g.city || g.subregion || g.region, g.country].filter(Boolean).join(', ');
              }
            } else {
              Alert.alert('Locatie niet toegestaan', 'Locatie kan niet worden opgeslagen zonder toestemming.');
            }
          } catch (e) {
            Alert.alert('Locatie fout', 'Kon locatie of adres niet ophalen.');
          }
          await handleAddExpense(amount, category, description, photoPath, locationObj, address);
        }}
      />
      <AllExpensesModal
        visible={expensesModalVisible}
        expenses={expenses}
        onClose={() => setExpensesModalVisible(false)}
        onDelete={async (expenseId: string) => {
          if (!user) return;
          const updatedExpenses = await getExpensesForMonth(user.uid, selectedMonth, selectedYear);
          setExpenses(updatedExpenses);
          const total = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
          setSpent(total);
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  monthSelectorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 180,
    alignSelf: 'center',
  },
  mainCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    minHeight: 120,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 70,
  },
  recentCard: {
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 40,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
})

export default Home
