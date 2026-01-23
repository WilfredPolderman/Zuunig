import { addCategory, getCategories } from '@/api/category'
import { getExpensesForMonth } from '@/api/expense'
import MonthSelector from '@/components/modals/monthSelectorModal'
import { useMonthYear } from '@/context/MonthYearProvider'
import { ThemeContext } from '@/context/ThemeProvider'
import useUser from '@/hooks/useUser'
import type { FunctionComponent } from 'react'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Categories: FunctionComponent = () => {
  const { colors, padding } = useContext(ThemeContext)

  const user = useUser()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectedMonth, setSelectedMonth, selectedYear, setSelectedYear } = useMonthYear()
  const [expenses, setExpenses] = useState<any[]>([])
  const [expensesLoading, setExpensesLoading] = useState(false)

  const fetchCategories = async () => {
    if (!user) return
    setLoading(true)
    const cats = await getCategories(user.uid)
    setCategories(cats)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      setExpensesLoading(true);
      const exp = await getExpensesForMonth(user.uid, selectedMonth, selectedYear);
      setExpenses(exp);
      setExpensesLoading(false);
    };
    fetchExpenses();
  }, [user, selectedMonth, selectedYear]);

  const handleAddCategory = async () => {
    setError(null)
    if (!user) return
    if (!newCategory.trim()) {
      setError('Vul een categorienaam in.')
      return
    }
    setAdding(true)
    await addCategory(user.uid, newCategory.trim())
    setNewCategory('')
    setError(null)
    await fetchCategories()
    setAdding(false)
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: padding.lg }]}> 
      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
        }}
      />
      <View style={{ flexDirection: 'row', marginVertical: 16 }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: error ? colors.error : colors.primary,
            borderRadius: 8,
            padding: 10,
            color: colors.text,
            backgroundColor: colors.card,
            marginRight: 8,
          }}
          placeholder="Nieuwe categorie"
          placeholderTextColor={colors.textSecondary}
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity
          onPress={handleAddCategory}
          disabled={adding || !newCategory.trim() || !!error}
          style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{adding ? '...' : 'Toevoegen'}</Text>
        </TouchableOpacity>
      </View>
      {error && (
        <Text style={{ color: colors.error, marginBottom: 8 }}>{error}</Text>
      )}
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            const categoryExpenses = expenses.filter(e => e.category === item.name);
            const total = categoryExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
            return (
              <View style={[
                styles.categoryCard,
                { backgroundColor: colors.card, borderColor: colors.primary + '30' }
              ]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.iconCircle}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ color: colors.text, fontSize: 17, fontWeight: 'bold', marginLeft: 10 }}>{item.name}</Text>
                </View>
                {expensesLoading ? (
                  <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                  <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>{total.toFixed(2)} €</Text>
                )}
              </View>
            );
          }}
          ListEmptyComponent={<Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 24 }}>Geen categorieën gevonden</Text>}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 10,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
})

export default Categories
