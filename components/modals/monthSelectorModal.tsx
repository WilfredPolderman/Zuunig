import { ThemeContext } from '@/context/ThemeProvider';
import type { MonthSelectorProps } from '@/models/modals/monthSelectorProps';
import { Picker } from '@react-native-picker/picker';
import type { FunctionComponent } from 'react';
import React, { useContext, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december'
];

const MonthSelector: FunctionComponent<MonthSelectorProps> = ({
  selectedMonth,
  selectedYear,
  onSelect,
}) => {
  const { colors } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);

  const handleSave = () => {
    onSelect(tempMonth, tempYear);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.selectorButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => { setTempYear(selectedYear); setModalVisible(true); }}
      >
        <Text style={[styles.selectorButtonText, { color: colors.text }]}>{MONTHS[selectedMonth - 1]} {selectedYear}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modal, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, color: colors.text }}>Selecteer maand en jaar</Text>
            <Picker
              selectedValue={tempMonth}
              onValueChange={setTempMonth}
              style={{ width: '100%', color: colors.text, marginBottom: 16 }}
              dropdownIconColor={colors.primary}
            >
              {MONTHS.map((m, i) => (
                <Picker.Item key={m} label={m} value={i + 1} color={colors.text} />
              ))}
            </Picker>
            <Picker
              selectedValue={tempYear}
              onValueChange={setTempYear}
              style={{ width: '100%', color: colors.text, marginBottom: 16 }}
              dropdownIconColor={colors.primary}
            >
              {Array.from({ length: 12 }, (_, i) => selectedYear - 6 + i).map(y => (
                <Picker.Item key={y} label={y.toString()} value={y} color={colors.text} />
              ))}
            </Picker>
            <TouchableOpacity style={[styles.selectorButton, { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={handleSave}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Bevestigen</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
    modal: {
      backgroundColor: 'rgba(255,255,255,0.98)',
      borderRadius: 22,
      padding: 28,
      width: 340,
      borderWidth: 1.5,
      borderColor: '#e5e7eb',
    },
  selectorButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#d1d5db',
  },
  selectorButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.2,
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    gap: 32,
  },
  arrowButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  arrowText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  yearText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    minWidth: 70,
    textAlign: 'center',
  },
  monthGrid: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    gap: 0,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    gap: 0,
  },
  monthButton: {
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    minWidth: 90,
    maxWidth: 110,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  monthButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  monthText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'capitalize',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  monthTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default MonthSelector;