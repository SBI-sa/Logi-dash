import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
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
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    if (visible && timestamp) {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        setDateInput(`${year}-${month}-${day}`);
        setTimeInput(`${hours}:${minutes}`);
      }
    } else if (visible && !timestamp) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      setDateInput(`${year}-${month}-${day}`);
      setTimeInput(`${hours}:${minutes}`);
    }
  }, [visible, timestamp]);

  const handleSave = () => {
    if (!dateInput || !timeInput) {
      Alert.alert('Invalid Input', 'Please enter both date and time.');
      return;
    }

    const dateTimeString = `${dateInput}T${timeInput}:00`;
    const parsedDate = new Date(dateTimeString);

    if (isNaN(parsedDate.getTime())) {
      Alert.alert('Invalid Date', 'Please enter a valid date and time.');
      return;
    }

    const isoString = parsedDate.toISOString();
    onSave(isoString);
    onClose();
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
              placeholderTextColor={LogiPointColors.gray}
              keyboardType="default"
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Time (HH:MM, 24-hour)</Text>
            <TextInput
              style={styles.input}
              value={timeInput}
              onChangeText={setTimeInput}
              placeholder="14:30"
              placeholderTextColor={LogiPointColors.gray}
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
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: LogiPointColors.midnight,
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: LogiPointColors.midnight,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: LogiPointColors.gray,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: LogiPointColors.midnight,
    backgroundColor: LogiPointColors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: LogiPointColors.lightGray,
  },
  cancelButtonText: {
    color: LogiPointColors.midnight,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: LogiPointColors.teal,
  },
  saveButtonText: {
    color: LogiPointColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
