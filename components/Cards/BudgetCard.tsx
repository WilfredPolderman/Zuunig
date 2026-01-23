import { ThemeContext } from '@/context/ThemeProvider';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface BudgetCardProps {
  totalBudget: number;
  spent: number;
  onEdit?: (newBudget: number) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ totalBudget, spent, onEdit }) => {
  const [editVisible, setEditVisible] = useState(false);
  const [input, setInput] = useState(totalBudget.toString());
  const { colors } = useContext(ThemeContext);

  const remaining = totalBudget - spent;

  const handleSave = () => {
    const value = parseFloat(input.replace(',', '.'));
    if (!isNaN(value) && value >= 0) {
      onEdit?.(value);
      setEditVisible(false);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }] }>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[styles.title, { color: colors.text }]}>Totaal budget</Text>
        {onEdit && (
          <TouchableOpacity onPress={() => setEditVisible(true)} style={{ marginLeft: 8 }}>
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.amount, { color: colors.primary }]}>€{totalBudget}</Text>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Resterend budget</Text>
          <Text style={[styles.remaining, { color: colors.income }]}>€{remaining}</Text>
        </View>
        <View style={styles.col}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Uitgaven</Text>
          <Text style={[styles.spent, { color: colors.expense }]}>€{spent}</Text>
        </View>
      </View>
      <Modal visible={editVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }] }>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: colors.text }}>Pas maandbudget aan</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.primary, color: colors.text, backgroundColor: colors.background }]}
              keyboardType="numeric"
              value={input}
              onChangeText={setInput}
              placeholder="Nieuw budget"
              placeholderTextColor={colors.textSecondary}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={[styles.cancelBtn, { borderColor: colors.primary, backgroundColor: colors.background }] }>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Annuleren</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }] }>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Opslaan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
  },
  remaining: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  spent: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: 24,
    width: 280,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: '100%',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
});

export default BudgetCard;
