import { GoalModalProps } from '@/models/modals/goalModalProps';
import React, { FunctionComponent } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const GoalModal: FunctionComponent<GoalModalProps> = ({
  visible,
  goal,
  editName,
  editTarget,
  onChangeName,
  onChangeTarget,
  onSave,
  onDelete,
  onCancel,
  colors,
}) => {
  if (!goal) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}> 
          <Text style={[styles.title, { color: colors.text }]}>Doel aanpassen</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.primary }]}
            value={editName}
            onChangeText={onChangeName}
            placeholder="Doelnaam"
            placeholderTextColor={colors.textSecondary}
          />
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.primary }]}
            value={editTarget}
            onChangeText={onChangeTarget}
            placeholder="Doelbedrag (€)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.primary, flex: 1 }]}
              onPress={onSave}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Opslaan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.primary, flex: 1 }]}
              onPress={onCancel}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Annuleer</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#e74c3c' }]}
            onPress={onDelete}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Verwijder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' },
  modal: { padding: 24, borderRadius: 16, minWidth: 260 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },
  btn: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
});

export default GoalModal;
