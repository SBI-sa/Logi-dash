import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Text, TouchableOpacity, TextInput, Modal, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
  const blurProps = Platform.OS === 'web' ? {} : { intensity: 65, tint: 'light' as const };

  return (
    <CardWrapper style={[styles.card, style]} {...blurProps} testID="glass-card">
      <View style={styles.glassOverlay} />
      <LinearGradient
        colors={["rgba(255,255,255,0.28)", "rgba(255,255,255,0.06)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalSheen}
      />
      <View style={styles.innerBorder} />
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
                testID="edit-last-updated"
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
            <LinearGradient
              colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.04)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalDiagonalSheen}
            />
            <View style={styles.modalInnerContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Last Updated</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} testID="close-edit-last-updated">
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
                testID="cancel-edit-last-updated"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                testID="save-edit-last-updated"
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
      web: 'rgba(255, 255, 255, 0.16)',
      default: 'rgba(255, 255, 255, 0.10)',
    }),
    borderRadius: 24,
    padding: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    shadowColor: '#001019',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
    overflow: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.06)',
    } : {}),
  },
  glassOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
  },
  diagonalSheen: {
    position: 'absolute' as const,
    top: -10,
    left: -10,
    right: -10,
    height: '55%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  innerBorder: {
    position: 'absolute' as const,
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    opacity: 0.35,
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
      web: 'rgba(255, 255, 255, 0.16)',
      default: 'rgba(255, 255, 255, 0.10)',
    }),
    borderRadius: 28,
    padding: 0,
    width: '80%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.32)',
    shadowColor: '#001019',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 14,
    overflow: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.06)',
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
  modalDiagonalSheen: {
    position: 'absolute' as const,
    top: -12,
    left: -12,
    right: -12,
    height: '55%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
