import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, Text, TouchableOpacity, TextInput, Modal, Platform, Image } from 'react-native';
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
  const blurProps = Platform.OS === 'web' ? {} : { intensity: 95, tint: 'light' as const };

  return (
    <CardWrapper style={[styles.card, style]} {...blurProps} testID="glass-card">
      <View style={styles.glassOverlay} />
      <Image
        source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/textures/noise-512.png' }}
        style={styles.noiseOverlay}
        resizeMode="cover"
        accessibilityLabel="glass-noise"
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.10)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.diagonalSheen}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.85)", "rgba(255,255,255,0.00)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.topHighlight}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.00)", "rgba(255,255,255,0.18)", "rgba(255,255,255,0.00)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.bottomGlow}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.45)", "rgba(255,255,255,0.00)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.edgeShineLeft}
      />
      <LinearGradient
        colors={["rgba(255,255,255,0.00)", "rgba(255,255,255,0.45)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.edgeShineRight}
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
              colors={["rgba(255,255,255,0.58)", "rgba(255,255,255,0.12)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalDiagonalSheen}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.00)", "rgba(255,255,255,0.20)", "rgba(255,255,255,0.00)"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={styles.modalBottomGlow}
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
      web: 'rgba(255, 255, 255, 0.42)',
      default: 'rgba(255, 255, 255, 0.38)',
    }),
    borderRadius: 28,
    padding: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    shadowColor: '#001019',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.35,
    shadowRadius: 48,
    elevation: 24,
    overflow: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(80px) saturate(280%) contrast(1.15) brightness(1.05)',
      WebkitBackdropFilter: 'blur(80px) saturate(280%) contrast(1.15) brightness(1.05)',
      boxShadow: '0 20px 64px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.15), inset 0 1.5px 0 rgba(255,255,255,0.85), inset 0 -1.5px 0 rgba(0,0,0,0.12)',
    } : {}),
  },
  glassOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 28,
  },
  noiseOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.12,
    pointerEvents: 'none' as const,
  },
  diagonalSheen: {
    position: 'absolute' as const,
    top: -16,
    left: -16,
    right: -16,
    height: '70%',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  topHighlight: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    opacity: 0.95,
  },
  bottomGlow: {
    position: 'absolute' as const,
    left: 20,
    right: 20,
    bottom: 16,
    height: 64,
    borderRadius: 32,
    opacity: 0.85,
  },
  edgeShineLeft: {
    position: 'absolute' as const,
    top: 16,
    bottom: 16,
    left: 0,
    width: 20,
    opacity: 0.75,
  },
  edgeShineRight: {
    position: 'absolute' as const,
    top: 16,
    bottom: 16,
    right: 0,
    width: 20,
    opacity: 0.75,
  },
  innerBorder: {
    position: 'absolute' as const,
    top: 1.5,
    left: 1.5,
    right: 1.5,
    bottom: 1.5,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    opacity: 0.75,
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
      web: 'rgba(255, 255, 255, 0.45)',
      default: 'rgba(255, 255, 255, 0.40)',
    }),
    borderRadius: 28,
    padding: 0,
    width: '80%',
    maxWidth: 440,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.68)',
    shadowColor: '#001019',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.36,
    shadowRadius: 48,
    elevation: 24,
    overflow: 'hidden',
    position: 'relative' as const,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(85px) saturate(290%) contrast(1.15) brightness(1.05)',
      WebkitBackdropFilter: 'blur(85px) saturate(290%) contrast(1.15) brightness(1.05)',
      boxShadow: '0 20px 68px rgba(0,0,0,0.30), 0 10px 28px rgba(0,0,0,0.18), inset 0 1.5px 0 rgba(255,255,255,0.88), inset 0 -1.5px 0 rgba(0,0,0,0.12)',
    } : {}),
  },
  modalGlassOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 28,
  },
  modalDiagonalSheen: {
    position: 'absolute' as const,
    top: -16,
    left: -16,
    right: -16,
    height: '68%',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
  },
  modalBottomGlow: {
    position: 'absolute' as const,
    left: 24,
    right: 24,
    bottom: 16,
    height: 40,
    borderRadius: 20,
    opacity: 0.8,
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
