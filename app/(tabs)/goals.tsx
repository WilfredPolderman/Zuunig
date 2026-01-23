import { createGoal, deleteGoal, getGoals as fetchGoals, updateGoal } from '@/api/goal';
import GoalModal from '@/components/modals/GoalModal';
import { ThemeContext } from '@/context/ThemeProvider';
import useUser from '@/hooks/useUser';
import type { Goal } from '@/models/goal';
import { useFocusEffect } from '@react-navigation/native';
import type { FunctionComponent } from 'react';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const Goals: FunctionComponent = () => {
  const user = useUser();
  const { colors, padding } = useContext(ThemeContext);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [editGoalId, setEditGoalId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const data = await fetchGoals();
      setGoals(data);
    } catch (e) { }
    setLoading(false);
  };


  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadGoals();
      }
    }, [user])
  );

  const handleAddGoal = async () => {
    if (!user) return;
    if (!name.trim()) {
      setError('Vul een doelnaam in.');
      return;
    }
    const amount = parseFloat(targetAmount.replace(',', '.'));
    if (!targetAmount || isNaN(amount) || amount <= 0) {
      setError('Vul een geldig doelbedrag in.');
      return;
    }
    try {
      await createGoal(name.trim(), amount);
      setName('');
      setTargetAmount('');
      setError(null);
      loadGoals();
    } catch (e) {
      setError('Er is iets misgegaan.');
    }
  };

  // Helpers voor validatie
  const isNameValid = name.trim().length > 0;
  const parsedAmount = parseFloat(targetAmount.replace(',', '.'));
  const isAmountValid = !!targetAmount && !isNaN(parsedAmount) && parsedAmount > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: padding.lg }]}>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: !isNameValid && name.length > 0 ? colors.error : colors.primary },
          ]}
          placeholder="Doelnaam"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={val => {
            setName(val);
            if (error) setError(null);
          }}
        />
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: !isAmountValid && targetAmount.length > 0 ? colors.error : colors.primary },
          ]}
          placeholder="Bedrag (€)"
          placeholderTextColor={colors.textSecondary}
          value={targetAmount}
          onChangeText={val => {
            setTargetAmount(val);
            if (error) setError(null);
          }}
          keyboardType="numeric"
        />
      </View>
      {error && (
        <Text style={{ color: colors.error, marginBottom: 8 }}>{error}</Text>
      )}
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary, opacity: isNameValid && isAmountValid ? 1 : 0.7 }]}
        onPress={handleAddGoal}
        disabled={!isNameValid || !isAmountValid}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Voeg doel toe</Text>
      </TouchableOpacity>
      <FlatList
        data={goals}
        keyExtractor={(item, index) => item.id ? item.id : `goal-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.goalCard, { backgroundColor: colors.card }]}
            onLongPress={() => {
              setSelectedGoal(item);
              setEditName(item.name);
              setEditTarget(item.target.toString());
              setModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.goalName, { color: colors.text }]}>{item.name}</Text>
            <Text style={{ color: colors.textSecondary }}>Doelbedrag: €{item.target}</Text>
            <Text style={{ color: colors.textSecondary }}>Gespaard: €{item.saved}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading ? <Text style={{ color: colors.textSecondary, marginTop: 20 }}>Nog geen doelen</Text> : null}
      />
      <GoalModal
        visible={modalVisible}
        goal={selectedGoal}
        editName={editName}
        editTarget={editTarget}
        onChangeName={setEditName}
        onChangeTarget={setEditTarget}
        onSave={async () => {
          if (!selectedGoal?.id) return;
          await updateGoal(selectedGoal.id, {
            name: editName,
            target: parseFloat(editTarget),
          });
          setModalVisible(false);
          setSelectedGoal(null);
          setEditName('');
          setEditTarget('');
          loadGoals();
        }}
        onDelete={async () => {
          if (!selectedGoal?.id) return;
          await deleteGoal(selectedGoal.id);
          setModalVisible(false);
          setSelectedGoal(null);
          setEditName('');
          setEditTarget('');
          loadGoals();
        }}
        onCancel={() => {
          setModalVisible(false);
          setSelectedGoal(null);
          setEditName('');
          setEditTarget('');
        }}
        colors={colors}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },
  addBtn: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  goalCard: { padding: 16, borderRadius: 12, marginBottom: 12 },
  goalName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
});

export default Goals;
