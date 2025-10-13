import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';

export interface ClientYearData {
  name: string;
  year2024: number;
  year2025: number;
  color?: string;
}

interface SmallMultiplesChartProps {
  data: ClientYearData[];
}

export const SmallMultiplesChart = React.memo(function SmallMultiplesChart({ data }: SmallMultiplesChartProps) {
  const maxValue = Math.max(...data.flatMap(d => [d.year2024, d.year2025]));
  
  return (
    <View style={styles.container}>
      {data.map((client, index) => {
        const percentage2024 = (client.year2024 / maxValue) * 100;
        const percentage2025 = (client.year2025 / maxValue) * 100;
        const change = client.year2024 > 0 
          ? ((client.year2025 - client.year2024) / client.year2024) * 100 
          : 0;
        const changeColor = change >= 0 ? LogiPointColors.chart.green : LogiPointColors.chart.red;
        const changeSymbol = change >= 0 ? '+' : '';
        
        return (
          <View key={index} style={styles.clientContainer}>
            <View style={styles.clientHeader}>
              <Text style={styles.clientName}>{client.name}</Text>
              <Text style={[styles.changeText, { color: changeColor }]}>
                {changeSymbol}{change.toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.barsContainer}>
              <View style={styles.barRow}>
                <Text style={styles.yearLabel}>Arrival</Text>
                <View style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          width: `${percentage2024}%`,
                          backgroundColor: LogiPointColors.beige,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.value}>{client.year2024.toLocaleString()}</Text>
                </View>
              </View>
              
              <View style={styles.barRow}>
                <Text style={styles.yearLabel}>Delivery</Text>
                <View style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.bar, 
                        { 
                          width: `${percentage2025}%`,
                          backgroundColor: client.color || LogiPointColors.primary,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.value}>{client.year2025.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  clientContainer: {
    gap: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  barsContainer: {
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  yearLabel: {
    fontSize: 11,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
    width: 50,
  },
  barWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barBackground: {
    flex: 1,
    height: 20,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    minWidth: 60,
  },
});
