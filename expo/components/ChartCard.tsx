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
  lastUpdated?: string;
  onLastUpdatedChange?: (value: string) => void;
}

export const ChartCard = React.memo(function ChartCard({ title, children, subtitle, lastUpdated, onLastUpdatedChange }: ChartCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <>
      <Card style={styles.container} lastUpdated={lastUpdated} onLastUpdatedChange={onLastUpdatedChange}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <TouchableOpacity
            style={styles.fullscreenButton}
            onPress={() => setIsFullscreen(true)}
          >
            <Maximize2 size={20} color={LogiPointColors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer} testID="chart-card-content">
          {!isFullscreen ? children : null}
        </View>
      </Card>

      <FullscreenChartModal
        visible={isFullscreen}
        title={title}
        subtitle={subtitle}
        onClose={() => setIsFullscreen(false)}
      >
        {children}
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
  },
  fullscreenButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: LogiPointColors.gray[100],
    marginLeft: 12,
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
  chartContainer: {
    minHeight: 200,
  },
});
