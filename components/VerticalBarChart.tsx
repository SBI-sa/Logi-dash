import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

export interface VerticalBarChartData {
  label: string;
  actual: number;
  budget: number;
  color?: string;
}

interface VerticalBarChartProps {
  data: VerticalBarChartData[];
  maxValue?: number;
}

export const VerticalBarChart = React.memo(function VerticalBarChart({ data, maxValue }: VerticalBarChartProps) {
  const max = maxValue || Math.max(...data.flatMap(d => [d.actual, d.budget]));
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };

  const chartHeight = 240;
  const actualRevenueColor = data[0]?.color || '#00617f';
  
  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          const actualHeight = (item.actual / max) * chartHeight;
          const budgetHeight = (item.budget / max) * chartHeight;
          const barColor = item.color || LogiPointColors.chart.green;
          
          return (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barsContainer}>
                <View style={styles.barPair}>
                  <View style={styles.barColumn}>
                    <Text style={styles.barValue}>{formatCurrency(item.actual)}</Text>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: actualHeight,
                          backgroundColor: barColor,
                        }
                      ]} 
                    />
                  </View>
                  <View style={styles.barColumn}>
                    <Text style={styles.barValue}>{formatCurrency(item.budget)}</Text>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          height: budgetHeight,
                          backgroundColor: LogiPointColors.beige,
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.label} numberOfLines={2}>{item.label}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: actualRevenueColor }]} />
          <Text style={styles.legendText}>Actual Revenue</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: LogiPointColors.beige }]} />
          <Text style={styles.legendText}>Budget</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 300,
    paddingTop: 40,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barsContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  barPair: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 4,
    height: '100%',
  },
  barColumn: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    textAlign: 'center',
  },
  label: {
    fontSize: 11,
    color: LogiPointColors.gray[700],
    fontWeight: '500' as const,
    textAlign: 'center',
    maxWidth: 80,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: LogiPointColors.gray[600],
  },
});
