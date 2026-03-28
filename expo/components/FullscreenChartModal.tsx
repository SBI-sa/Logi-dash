import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
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
  const lockInProgress = useRef(false);
  const unmounted = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    unmounted.current = false;

    const applyOrientation = async () => {
      if (lockInProgress.current || unmounted.current) {
        return;
      }

      lockInProgress.current = true;

      try {
        if (visible) {
          const isSupported = await ScreenOrientation.supportsOrientationLockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          ).catch(() => false);
          
          if (isSupported && !unmounted.current) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
          }
        }
      } catch (error) {
        console.error('[orientation] Failed to lock orientation:', error);
      } finally {
        lockInProgress.current = false;
      }
    };

    if (visible) {
      applyOrientation();
    }

    return () => {
      unmounted.current = true;
      
      if (Platform.OS !== 'web' && !lockInProgress.current) {
        lockInProgress.current = true;
        ScreenOrientation.supportsOrientationLockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        )
          .then((isSupported) => {
            if (isSupported) {
              return ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            }
          })
          .catch((error) => {
            console.error('[orientation] Failed to restore portrait:', error);
          })
          .finally(() => {
            lockInProgress.current = false;
          });
      }
    };
  }, [visible]);

  const [dims, setDims] = useState<{ width: number; height: number }>(() => {
    const w = Dimensions.get('window');
    return { width: w.width, height: w.height };
  });

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      console.log('[fullscreen] dimensions changed', window.width, window.height);
      setDims({ width: window.width, height: window.height });
    });
    return () => {
      if (sub && typeof (sub as unknown as { remove?: () => void }).remove === 'function') {
        (sub as unknown as { remove: () => void }).remove();
      }
    };
  }, []);

  const isLandscape = dims.width > dims.height;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      supportedOrientations={['landscape', 'portrait']}
      presentationStyle="fullScreen"
      hardwareAccelerated
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.container} testID="fullscreen-chart-modal">
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
    backgroundColor: Platform.select({
      web: 'rgba(16, 18, 27, 0.55)',
      default: LogiPointColors.white,
    }),
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(14px) saturate(140%)',
          WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        }
      : {}),
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
