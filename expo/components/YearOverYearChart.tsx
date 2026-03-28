import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

export interface YearOverYearData {
  label: string;
  thisYear: number;
  lastYear: number;
  color?: string;
}

interface YearOverYearChartProps {
  data: YearOverYearData[];
}

export const YearOverYearChart = React.memo(function YearOverYearChart({ data }: YearOverYearChartProps) {
  const allValues = data.flatMap(d => [d.thisYear, d.lastYear]);
  const maxValue = Math.max(...allValues, 1);
  
  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 150;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: LogiPointColors.primary }]} />
          <Text style={styles.legendText}>This Year (2025)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: LogiPointColors.primary, opacity: 0.5 }]} />
          <Text style={styles.legendText}>Last Year (2024)</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {data.map((item, index) => {
            const thisYearHeight = getBarHeight(item.thisYear);
            const lastYearHeight = getBarHeight(item.lastYear);
            const barColor = item.color || LogiPointColors.primary;
            
            return (
              <View key={index} style={styles.comparisonContainer}>
                <View style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: thisYearHeight, backgroundColor: barColor }]} />
                    <Text style={styles.barValue}>{item.thisYear.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.comparisonYearLabel}>2025</Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: lastYearHeight, backgroundColor: barColor, opacity: 0.5 }]} />
                    <Text style={styles.barValue}>{item.lastYear.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.comparisonYearLabel}>2024</Text>
                </View>
                
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
  },
  chartScroll: {
    marginHorizontal: -8,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    paddingHorizontal: 8,
    paddingVertical: 16,
    minHeight: 200,
  },
  barContainer: {
    alignItems: 'center',
    gap: 8,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 150,
  },
  bar: {
    width: 40,
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    marginTop: 4,
  },
  barLabel: {
    fontSize: 11,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
  },
  comparisonContainer: {
    alignItems: 'center',
    gap: 8,
  },
  comparisonYearLabel: {
    fontSize: 7,
    color: LogiPointColors.gray[500],
    fontWeight: '500' as const,
  },
});
