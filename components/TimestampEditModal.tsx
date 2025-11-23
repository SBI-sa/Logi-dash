import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Alert from '@blazejkustra/react-native-alert';
import { LogiPointColors } from '@/constants/colors';

interface TimestampEditModalProps {
  visible: boolean;
  timestamp: string | null;
  title: string;
  onSave: (timestamp: string) => void;
  onClose: () => void;
}

export const TimestampEditModal: React.FC<TimestampEditModalProps> = ({
  visible,
  timestamp,
  title,
  onSave,
  onClose,
}) => {
  const [dateInput, setDateInput] = useState('');

  useEffect(() => {
    if (visible && timestamp) {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        setDateInput(`${year}-${month}-${day}`);
      }
    } else if (visible && !timestamp) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      
      setDateInput(`${year}-${month}-${day}`);
    }
  }, [visible, timestamp]);

  const handleSave = () => {
    if (!dateInput) {
      Alert.alert('Invalid Input', 'Please enter a date.');
      return;
    }

    const dateTimeString = `${dateInput}T00:00:00`;
    const parsedDate = new Date(dateTimeString);

    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Invalid Date', 'Please enter a valid date.');
      return;
    }

    const isoString = parsedDate.toISOString();
    onSave(isoString);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.inputSection}>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={dateInput}
              onChangeText={setDateInput}
              placeholder="2025-11-10"
              placeholderTextColor="#9ca3af"
              keyboardType="default"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003d4d',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003d4d',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#003d4d',
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#003d4d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#00617f',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
