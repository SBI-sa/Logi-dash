import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';
import { Card } from './Card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

export const ChartCard = React.memo(function ChartCard({ title, children, subtitle }: ChartCardProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.chartContainer}>
        {children}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
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
