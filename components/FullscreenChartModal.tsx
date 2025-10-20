import React, { useEffect, useRef } from 'react';
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
  const opInFlight = useRef<Promise<void> | null>(null);
  const lastLocked = useRef<'portrait' | 'landscape' | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    let cancelled = false;

    const runSerial = async (fn: () => Promise<void>) => {
      const prev = opInFlight.current;
      try {
        if (prev) {
          await prev.catch(() => undefined);
        }
      } finally {
        if (!cancelled) {
          const p = fn().catch((e) => {
            console.log('[orientation] lock error', e);
          });
          opInFlight.current = p;
          await p;
        }
      }
    };

    const applyOrientation = async () => {
      try {
        const desired = visible ? 'landscape' : 'portrait';
        if (lastLocked.current === desired) {
          return;
        }

        const lock = visible
          ? ScreenOrientation.OrientationLock.LANDSCAPE
          : ScreenOrientation.OrientationLock.PORTRAIT_UP;

        const isSupported = await ScreenOrientation.supportsOrientationLockAsync(lock).catch(() => false);
        if (!isSupported) {
          console.log('[orientation] desired lock not supported on this device');
          lastLocked.current = desired;
          return;
        }

        await ScreenOrientation.lockAsync(lock);
        lastLocked.current = desired;
      } catch (error) {
        console.log('[orientation] lockAsync failed', error);
      }
    };

    runSerial(applyOrientation);

    return () => {
      cancelled = true;
      if (Platform.OS !== 'web') {
        runSerial(async () => {
          try {
            const isSupported = await ScreenOrientation.supportsOrientationLockAsync(
              ScreenOrientation.OrientationLock.PORTRAIT_UP,
            ).catch(() => false);
            if (isSupported) {
              await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
              lastLocked.current = 'portrait';
            }
          } catch (e) {
            console.log('[orientation] restore portrait failed', e);
          }
        });
      }
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
    backgroundColor: Platform.select({
      web: 'rgba(255, 255, 255, 0.85)',
      default: LogiPointColors.white,
    }),
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    } : {}),
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
