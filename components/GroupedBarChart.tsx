import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

export interface GroupedBarData {
  label: string;
  values: {
    label: string;
    value: number;
    color: string;
  }[];
}

interface GroupedBarChartProps {
  data: GroupedBarData[];
  maxValue?: number;
}

export const GroupedBarChart = React.memo(function GroupedBarChart({ data, maxValue }: GroupedBarChartProps) {
  const max = maxValue || Math.max(...data.flatMap(d => d.values.map(v => v.value)));
  
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.groupContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <View style={styles.barsContainer}>
              {item.values.map((bar, barIndex) => {
                const percentage = (bar.value / max) * 100;
                
                return (
                  <View key={barIndex} style={styles.barRow}>
                    <View style={styles.barWrapper}>
                      <View 
                        style={[
                          styles.bar, 
                          { 
                            width: `${percentage}%`,
                            backgroundColor: bar.color,
                          }
                        ]} 
                      />
                      <Text style={styles.value}>{bar.value.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.barLabel}>{bar.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  groupContainer: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: LogiPointColors.gray[700],
    fontWeight: '600' as const,
  },
  barsContainer: {
    gap: 6,
  },
  barRow: {
    gap: 4,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    height: 24,
    borderRadius: 4,
    minWidth: 2,
    flexShrink: 1,
  },
  value: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    minWidth: 50,
    flexShrink: 0,
  },
  barLabel: {
    fontSize: 11,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
    marginLeft: 4,
  },
});
