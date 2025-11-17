import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LogiPointColors } from '@/constants/colors';
import { Card } from './Card';
import { BulletGraph } from './BulletGraph';
import { LucideIcon } from 'lucide-react-native';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  color?: string;
  lastUpdated?: string;
  onLastUpdatedChange?: (value: string) => void;
  bulletGraph?: {
    actual: number;
    target: number;
  };
}

export const KPICard = React.memo(function KPICard({ title, value, subtitle, trend, icon: Icon, color = LogiPointColors.primary, lastUpdated, onLastUpdatedChange, bulletGraph }: KPICardProps) {
  return (
    <Card style={styles.container} lastUpdated={lastUpdated} onLastUpdatedChange={onLastUpdatedChange}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {Icon && <Icon size={20} color={color} />}
      </View>
      
      <Text style={[styles.value, { color }]}>{value}</Text>
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {trend && (
        <View style={styles.trendContainer}>
          <Text style={[styles.trend, { color: trend.isPositive ? LogiPointColors.success : LogiPointColors.error }]}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Text>
          <Text style={styles.trendLabel}>{trend.label || 'vs previous period'}</Text>
        </View>
      )}

      {bulletGraph && (
        <BulletGraph
          actual={bulletGraph.actual}
          target={bulletGraph.target}
          color={color}
        />
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
  },
  value: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: LogiPointColors.gray[500],
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  trend: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  trendLabel: {
    fontSize: 11,
    color: LogiPointColors.gray[500],
  },
});
