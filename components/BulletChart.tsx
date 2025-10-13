import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

interface BulletChartProps {
  year: string;
  current: number;
  previous: number;
  percentageChange: number;
  color?: string;
}

export const BulletChart = React.memo(function BulletChart({ 
  year, 
  current, 
  previous, 
  percentageChange,
  color = LogiPointColors.primary 
}: BulletChartProps) {
  const max = Math.max(current, previous) * 1.2;
  const currentPercentage = (current / max) * 100;
  const previousPercentage = (previous / max) * 100;
  
  const changeColor = percentageChange >= 0 ? LogiPointColors.chart.green : LogiPointColors.chart.red;
  const changeSymbol = percentageChange >= 0 ? '+' : '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.year}>{year}</Text>
        <View style={styles.changeContainer}>
          <Text style={[styles.changeText, { color: changeColor }]}>
            {changeSymbol}{percentageChange.toFixed(1)}%
          </Text>
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        <View style={styles.barRow}>
          <Text style={styles.label}>Current</Text>
          <View style={styles.barWrapper}>
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${currentPercentage}%`,
                    backgroundColor: color,
                  }
                ]} 
              />
            </View>
            <Text style={styles.value}>{current.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.barRow}>
          <Text style={styles.label}>Previous</Text>
          <View style={styles.barWrapper}>
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${previousPercentage}%`,
                    backgroundColor: LogiPointColors.beige,
                  }
                ]} 
              />
            </View>
            <Text style={styles.value}>{previous.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: LogiPointColors.gray[100],
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  chartContainer: {
    gap: 16,
  },
  barRow: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barBackground: {
    flex: 1,
    height: 28,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 6,
    minWidth: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    minWidth: 70,
  },
});
