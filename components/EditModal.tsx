import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { LogiPointColors } from '@/constants/colors';
import { X, ChevronDown } from 'lucide-react-native';
import { useState } from 'react';

interface EditModalProps {
  visible: boolean;
  title: string;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
  fields?: { 
    label: string; 
    value: string; 
    onChange: (text: string) => void; 
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'decimal-pad';
    type?: 'text' | 'dropdown';
    options?: string[];
  }[];
}

export function EditModal({
  visible,
  title,
  value,
  onChangeText,
  onSave,
  onCancel,
  keyboardType = 'numeric',
  fields,
}: EditModalProps) {
  const [expandedDropdown, setExpandedDropdown] = useState<number | null>(null);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit {title}</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color={LogiPointColors.gray[600]} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {fields ? (
              fields.map((field, index) => (
                <View key={index} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  {field.type === 'dropdown' && field.options ? (
                    <View>
                      <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setExpandedDropdown(expandedDropdown === index ? null : index)}
                      >
                        <Text style={styles.dropdownButtonText}>{field.value || 'Select option'}</Text>
                        <ChevronDown size={20} color={LogiPointColors.gray[600]} />
                      </TouchableOpacity>
                      {expandedDropdown === index && (
                        <View style={styles.dropdownOptions}>
                          {field.options.map((option, optIndex) => (
                            <TouchableOpacity
                              key={optIndex}
                              style={[
                                styles.dropdownOption,
                                field.value === option && styles.dropdownOptionSelected
                              ]}
                              onPress={() => {
                                field.onChange(option);
                                setExpandedDropdown(null);
                              }}
                            >
                              <Text style={[
                                styles.dropdownOptionText,
                                field.value === option && styles.dropdownOptionTextSelected
                              ]}>
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  ) : (
                    <TextInput
                      style={styles.modalInput}
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType={field.keyboardType || 'default'}
                      placeholder={`Enter ${field.label.toLowerCase()}`}

                    />
                  )}
                </View>
              ))
            ) : (
              <TextInput
                style={styles.modalInput}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                placeholder="Enter value"

              />
            )}
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  closeButton: {
    padding: 4,
  },
  modalScroll: {
    maxHeight: 400,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: LogiPointColors.midnight,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
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
    color: LogiPointColors.midnight,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  saveButtonText: {
    color: LogiPointColors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  dropdownButton: {
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: LogiPointColors.midnight,
  },
  dropdownOptions: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
    marginTop: -16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
  },
  dropdownOptionSelected: {
    backgroundColor: LogiPointColors.primary,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: LogiPointColors.midnight,
  },
  dropdownOptionTextSelected: {
    color: LogiPointColors.white,
    fontWeight: '600' as const,
  },
});
