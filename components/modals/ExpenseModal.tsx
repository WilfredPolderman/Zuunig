import { addDefaultCategories, getCategories } from '@/api/category';
import { addToGoal, getGoals, Goal } from '@/api/goal';
import { ThemeContext } from '@/context/ThemeProvider';
import useUser from '@/hooks/useUser';
import { ExpenseModalProps } from '@/models/modals/expenseModal';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import React, { useContext, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import CameraModal from './CameraModal';

const ExpenseModal: React.FC<ExpenseModalProps> = ({ visible, onClose, onSave, initialExpense }) => {
  const { colors } = useContext(ThemeContext);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoPath, setPhotoPath] = useState<string | undefined>(undefined);
  const [showCamera, setShowCamera] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalId, setGoalId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  useEffect(() => {
    if (visible && initialExpense) {
      setAmount(initialExpense.amount !== undefined ? initialExpense.amount.toString() : '');
      setCategory(initialExpense.category || '');
      setDescription(initialExpense.description || '');
      setPhotoPath(undefined); 
    } else if (visible) {
      setAmount('');
      setCategory('');
      setDescription('');
      setPhotoPath(undefined);
    }
  }, [visible, initialExpense]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        await addDefaultCategories(user.uid);
        const cats = await getCategories(user.uid);
        setCategories(cats);
        try {
          const userGoals = await getGoals();
          setGoals(userGoals);
        } catch {}
      }
    };
    fetchData();
  }, [user, visible]);

  async function handleSave() {
    setError(null);
    const value = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(value) || value <= 0) {
      setError('Vul een geldig bedrag in.');
      return;
    }
    if (!category) {
      setError('Kies een categorie.');
      return;
    }
    let location = undefined;
    let address = undefined;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        location = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        const geocode = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        if (geocode && geocode.length > 0) {
          const g = geocode[0];
          address = [g.city || g.subregion || g.region, g.country].filter(Boolean).join(', ');
        }
      }
    } catch {}
    await onSave(value, category, description, photoPath, location, address, goalId || undefined);
    if (goalId) {
      try {
        await addToGoal(goalId, value);
      } catch {}
    }
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setAmount('');
    setCategory('');
    setGoalId('');
    setDescription('');
    setPhotoPath(undefined);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }] }>
          <Text style={[styles.title, { color: colors.text }]}>Nieuwe uitgave</Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: error && error.includes('bedrag') ? colors.error : colors.primary, color: colors.text, backgroundColor: colors.background },
            ]}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Bedrag (€)"
            placeholderTextColor={colors.textSecondary}
          />
          <View style={[
            styles.input,
            { borderColor: error && error.includes('categorie') ? colors.error : colors.primary, backgroundColor: colors.background, padding: 0 },
          ]}>
            <Picker
              selectedValue={category}
              onValueChange={itemValue => setCategory(itemValue)}
              style={{ color: colors.text, width: '100%' }}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="Kies een categorie" value="" color={colors.textSecondary} />
              {categories.map(cat => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.name} color={colors.text} />
              ))}
            </Picker>
          </View>
          <View style={[styles.input, { borderColor: colors.primary, backgroundColor: colors.background, padding: 0 }]}> 
            <Picker
              selectedValue={goalId}
              onValueChange={itemValue => setGoalId(itemValue)}
              style={{ color: colors.text, width: '100%' }}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="Koppel aan doel (optioneel)" value="" color={colors.textSecondary} />
              {goals.map(goal => (
                <Picker.Item key={goal.id} label={goal.name} value={goal.id!} color={colors.text} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={[styles.input, { borderColor: colors.primary, color: colors.text, backgroundColor: colors.background }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Omschrijving (optioneel)"
            placeholderTextColor={colors.textSecondary}
          />
          {error && (
            <Text style={{ color: colors.error, marginBottom: 8 }}>{error}</Text>
          )}

          <TouchableOpacity onPress={() => setShowCamera(true)} style={{ marginTop: 16, backgroundColor: colors.primary, borderRadius: 20, padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <MaterialIcons name="photo-camera" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold' }}>Voeg foto toe</Text>
          </TouchableOpacity>
          {photoPath && (
            <View style={{ marginTop: 10, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Foto toegevoegd</Text>
            </View>
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.cancelBtn, { borderColor: colors.primary, backgroundColor: colors.background }] }>
              <Text style={{ color: colors.primary }}>Annuleren</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: error ? 0.7 : 1 }] } disabled={!!error}>
              <Text style={{ color: '#fff' }}>Opslaan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <CameraModal
        showCamera={showCamera}
        cameraType="back"
        onClose={photo => {
          setShowCamera(false);
          if (photo && photo.path) setPhotoPath(photo.path);
        }}
      />
    </Modal>
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
    borderRadius: 14,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    width: '100%',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    width: '100%',
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  saveBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
});

export default ExpenseModal;
