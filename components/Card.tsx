import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Text, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
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

  const CardWrapper = Platform.OS === 'web' ? View : BlurView;
  const blurProps = Platform.OS === 'web' ? {} : { intensity: 40, tint: 'light' as const };

  return (
    <CardWrapper style={[styles.card, style]} {...blurProps}>
      <View style={styles.glassOverlay} />
      <View style={styles.shineEffect} />
      <View style={styles.contentWrapper}>
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
      </View>
      
      <Modal
        visible={editModalVisible && showLastUpdated}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalGlassOverlay} />
            <View style={styles.modalShineEffect} />
            <View style={styles.modalInnerContent}>
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
        </View>
      </Modal>
    </CardWrapper>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.08)',
      default: 'rgba(255, 255, 255, 0.05)',
    }),
    borderRadius: 20,
    padding: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(40px) saturate(150%)',
      WebkitBackdropFilter: 'blur(40px) saturate(150%)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
    } : {}),
  },
  glassOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  shineEffect: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contentWrapper: {
    padding: 16,
    position: 'relative' as const,
    zIndex: 1,
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
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.1)',
      default: 'rgba(255, 255, 255, 0.08)',
    }),
    borderRadius: 24,
    padding: 0,
    width: '80%',
    maxWidth: 400,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(40px) saturate(150%)',
      WebkitBackdropFilter: 'blur(40px) saturate(150%)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
    } : {}),
  },
  modalGlassOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
  },
  modalShineEffect: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalInnerContent: {
    padding: 24,
    position: 'relative' as const,
    zIndex: 1,
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
