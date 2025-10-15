import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { X, Maximize2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';

interface FullscreenChartModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const FullscreenChartModal = React.memo(function FullscreenChartModal({
  visible,
  title,
  subtitle,
  children,
  onClose,
}: FullscreenChartModalProps) {
  useEffect(() => {
    if (visible) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [visible]);

  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['landscape', 'portrait']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Maximize2 size={20} color={LogiPointColors.white} />
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={LogiPointColors.white} />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          {children}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LogiPointColors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: LogiPointColors.midnight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.white,
  },
  subtitle: {
    fontSize: 13,
    color: LogiPointColors.gray[300],
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentLandscape: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
});
