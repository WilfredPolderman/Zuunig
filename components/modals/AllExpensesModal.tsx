import { deleteExpense, updateExpense } from '@/api/expense';
import { ThemeContext } from '@/context/ThemeProvider';
import type { AllExpensesModalProps } from '@/models/modals/allExpensesModalProps';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ExpenseModal from './ExpenseModal';

const AllExpensesModal: React.FC<AllExpensesModalProps> = ({ visible, expenses, onClose, onDelete }) => {
  const { colors } = useContext(ThemeContext);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<typeof expenses[0] | null>(null);

  const handleDelete = async (expenseId: string) => {
    Alert.alert('Verwijder uitgave', 'Weet je zeker dat je deze uitgave wilt verwijderen?', [
      { text: 'Annuleer', style: 'cancel' },
      { text: 'Verwijder', style: 'destructive', onPress: async () => {
        setDeletingId(expenseId);
        await deleteExpense(expenseId);
        setDeletingId(null);
        if (onDelete) onDelete(expenseId);
      }}
    ]);
  };

  const handleEdit = (expense: typeof expenses[0]) => {
    setEditingExpense(expense);
  };

  const handleSaveEdit = async (amount: number, category: string, description: string, photoPath?: string) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, {
        amount,
        category,
        description,
      });
      setEditingExpense(null);
      if (onDelete) onDelete(editingExpense.id);
    }
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={[styles.modal, { backgroundColor: colors.card, borderColor: colors.border }] }>
            <Text style={[styles.title, { color: colors.text }]}>Alle uitgaven deze maand</Text>
            <FlatList
              data={expenses}
              keyExtractor={(item, idx) => item.id || idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.expenseRow}>
                  <Text style={[styles.expenseText, { color: colors.text }]}>{item.category}</Text>
                  <Text style={[styles.expenseText, { color: colors.text }]}>€{item.amount.toFixed(2)}</Text>
                  <View style={[styles.expenseText, { alignItems: 'center', justifyContent: 'center' }]}> 
                    {!!item.description && (
                      <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center' }}>{item.description}</Text>
                    )}
                    {item.address && (
                      <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: 'center', fontStyle: 'italic', marginTop: item.description ? 2 : 0 }}>
                        {item.address}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => handleEdit(item)}
                    accessibilityLabel="Bewerk uitgave"
                  >
                    <MaterialIcons name="edit" size={20} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    onPress={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    accessibilityLabel="Verwijder uitgave"
                  >
                    <MaterialIcons name="delete" size={20} color={colors.expense} />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: colors.textSecondary }}>Geen uitgaven</Text>}
            />
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: colors.primary }]} onPress={onClose}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sluiten</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {editingExpense && (
        <ExpenseModal
          visible={true}
          onClose={() => setEditingExpense(null)}
          onSave={handleSaveEdit}
          initialExpense={editingExpense}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    borderWidth: 1.5,
    // borderColor via inline style
  },
  iconBtn: {
    marginHorizontal: 2,
    padding: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseText: {
    flex: 1,
    textAlign: 'center',
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 8,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AllExpensesModal;
