import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Edit2, X } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  lastUpdated?: string;
  onLastUpdatedChange?: (value: string) => void;
}

export const Card = React.memo(function Card({ children, style, lastUpdated, onLastUpdatedChange }: CardProps) {
  const { isAdmin } = useAuth();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editValue, setEditValue] = useState(lastUpdated || '');

  React.useEffect(() => {
    setEditValue(lastUpdated || '');
  }, [lastUpdated]);

  const handleSave = () => {
    if (onLastUpdatedChange) {
      onLastUpdatedChange(editValue);
    }
    setEditModalVisible(false);
  };

  const showLastUpdated = lastUpdated !== undefined;

  return (
    <View style={[styles.card, style]}>
      {showLastUpdated && (
        <View style={styles.lastUpdatedContainer}>
          <Text style={styles.lastUpdatedText}>{lastUpdated || 'Not updated'}</Text>
          {isAdmin && onLastUpdatedChange && (
            <TouchableOpacity
              style={styles.editIcon}
              onPress={() => {
                setEditValue(lastUpdated || '');
                setEditModalVisible(true);
              }}
            >
              <Edit2 size={12} color={LogiPointColors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      )}
      {children}
      
      <Modal
        visible={editModalVisible && showLastUpdated}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Last Updated</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <X size={24} color={LogiPointColors.gray[600]} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="Enter last updated date"
              placeholderTextColor={LogiPointColors.gray[400]}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  lastUpdatedContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  lastUpdatedText: {
    fontSize: 10,
    color: LogiPointColors.gray[500],
    fontStyle: 'italic' as const,
  },
  editIcon: {
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  input: {
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: LogiPointColors.midnight,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: LogiPointColors.gray[200],
  },
  saveButton: {
    backgroundColor: LogiPointColors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
});
