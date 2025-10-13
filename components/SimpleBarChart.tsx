import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  maxValue?: number;
}

export const SimpleBarChart = React.memo(function SimpleBarChart({ data, maxValue }: SimpleBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const percentage = (item.value / max) * 100;
        const barColor = item.color || LogiPointColors.primary;
        
        return (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                  }
                ]} 
              />
              <Text style={styles.value}>{item.value.toLocaleString()}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  barContainer: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: LogiPointColors.gray[700],
    fontWeight: '500' as const,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    height: 32,
    borderRadius: 6,
    minWidth: 2,
    flexShrink: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    minWidth: 60,
    flexShrink: 0,
  },
});
