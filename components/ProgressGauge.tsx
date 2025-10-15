import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

interface ProgressGaugeProps {
  current: number;
  target: number;
  label: string;
  color?: string;
}

export const ProgressGauge = React.memo(function ProgressGauge({ current, target, label, color = LogiPointColors.primary }: ProgressGaugeProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOverTarget = current >= target;
  
  const formatValue = (value: number) => {
    return `${(value / 1000000).toFixed(2)}M`;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{percentage.toFixed(0)}%</Text>
      </View>
      
      <View style={styles.gaugeBackground}>
        <View 
          style={[
            styles.gaugeFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: isOverTarget ? LogiPointColors.chart.green : color,
            }
          ]} 
        />
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.value}>{formatValue(current)}</Text>
        <Text style={styles.target}>Target: {formatValue(target)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.primary,
  },
  gaugeBackground: {
    height: 12,
    backgroundColor: LogiPointColors.gray[200],
    borderRadius: 6,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
  },
  target: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
  },
});
