import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Maximize2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { Card } from './Card';
import { FullscreenChartModal } from './FullscreenChartModal';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  fullscreenContent?: React.ReactNode;
}

export const ChartCard = React.memo(function ChartCard({ title, children, subtitle, fullscreenContent }: ChartCardProps) {
  const [fullscreenVisible, setFullscreenVisible] = useState(false);

  return (
    <>
      <Card style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={() => setFullscreenVisible(true)}
          >
            <Maximize2 size={20} color={LogiPointColors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          {children}
        </View>
      </Card>

      <FullscreenChartModal
        visible={fullscreenVisible}
        onClose={() => setFullscreenVisible(false)}
        title={title}
      >
        {fullscreenContent || children}
      </FullscreenChartModal>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: LogiPointColors.gray[600],
  },
  fullscreenButton: {
    padding: 8,
    marginLeft: 8,
  },
  chartContainer: {
    minHeight: 200,
  },
});
