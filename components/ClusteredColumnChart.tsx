import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

export interface ClusteredColumnData {
  label: string;
  fcl: number;
  lcl: number;
  color?: string;
}

interface ClusteredColumnChartProps {
  data: ClusteredColumnData[];
}

export const ClusteredColumnChart = React.memo(function ClusteredColumnChart({ data }: ClusteredColumnChartProps) {
  const allValues = data.flatMap(d => [d.fcl, d.lcl]);
  const maxValue = Math.max(...allValues, 1);
  
  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 150;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00617f' }]} />
          <Text style={styles.legendText}>FCL</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9b2743' }]} />
          <Text style={styles.legendText}>LCL</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {data.map((item, index) => {
            const fclHeight = getBarHeight(item.fcl);
            const lclHeight = getBarHeight(item.lcl);
            
            return (
              <View key={index} style={styles.comparisonContainer}>
                <View style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: fclHeight, backgroundColor: '#00617f' }]} />
                    <Text style={styles.barValue}>{item.fcl}</Text>
                  </View>
                  <Text style={styles.comparisonYearLabel}>FCL</Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: lclHeight, backgroundColor: '#9b2743' }]} />
                    <Text style={styles.barValue}>{item.lcl}</Text>
                  </View>
                  <Text style={styles.comparisonYearLabel}>LCL</Text>
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
    fontSize: 10,
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
    fontSize: 7,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    marginTop: 4,
  },
  barLabel: {
    fontSize: 9,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
  },
  comparisonContainer: {
    alignItems: 'center',
    gap: 8,
  },
  comparisonYearLabel: {
    fontSize: 5,
    color: LogiPointColors.gray[500],
    fontWeight: '500' as const,
  },
});
