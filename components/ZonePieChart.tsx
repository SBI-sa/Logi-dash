import { View, Text, StyleSheet } from 'react-native';
import { SimplePieChart } from './SimplePieChart';
import { LogiPointColors } from '@/constants/colors';

interface ZonePieChartProps {
  zone: string;
  occupied: number;
  capacity: number;
  color: string;
  emptyWH?: number;
  whName?: string;
  sqmPerWH?: number;
}

export function ZonePieChart({ zone, occupied, capacity, color, emptyWH = 0, whName = '', sqmPerWH }: ZonePieChartProps) {
  const remaining = capacity - occupied;
  const occupiedPercentage = Math.round((occupied / capacity) * 100);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <Text style={styles.zoneTitle}>{zone}</Text>
        <Text style={styles.zoneSqm}>Each WH {sqmPerWH !== undefined ? sqmPerWH : Math.round(capacity / 10)} sqm</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.chartSection}>
          <SimplePieChart
            data={[
              {
                label: `Utilized`,
                value: occupied,
                color: color,
              },
              {
                label: `Vacant`,
                value: remaining,
                color: LogiPointColors.gray[200],
              },
            ]}
            centerValue={`${occupiedPercentage}%`}
            centerLabel="Utilization"
          />
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statsTable}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Utilized</Text>
              <Text style={styles.statsValue}>{occupied.toLocaleString()}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Vacant</Text>
              <Text style={styles.statsValue}>{remaining.toLocaleString()}</Text>
            </View>
            <View style={[styles.statsRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{capacity.toLocaleString()}</Text>
            </View>
            <View style={[styles.statsRow, styles.percentRow]}>
              <Text style={styles.percentLabel}>Utilization %</Text>
              <Text style={[styles.percentValue, { color: color }]}>{occupiedPercentage}%</Text>
            </View>
            <View style={[styles.statsRow, styles.emptyRow]}>
              <Text style={styles.emptyLabel}>Current # of Empty WHs</Text>
              <Text style={styles.emptyValue}>{emptyWH}</Text>
            </View>
            {whName && (
              <View style={[styles.statsRow, styles.whNameRow]}>
                <Text style={styles.whNameLabel}>Empty WH</Text>
                <Text style={styles.whNameValue}>{whName}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: LogiPointColors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: LogiPointColors.white,
    letterSpacing: 0.5,
  },
  zoneSqm: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
    opacity: 0.95,
  },
  content: {
    flexDirection: 'row',
    padding: 20,
    gap: 24,
  },
  chartSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  statsTable: {
    gap: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: LogiPointColors.gray[50],
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: LogiPointColors.gray[700],
  },
  statsValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
  },
  totalRow: {
    backgroundColor: LogiPointColors.gray[100],
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: LogiPointColors.midnight,
  },
  percentRow: {
    backgroundColor: LogiPointColors.gray[100],
    marginTop: 2,
  },
  percentLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  percentValue: {
    fontSize: 18,
    fontWeight: '900' as const,
  },
  emptyRow: {
    backgroundColor: LogiPointColors.white,
    marginTop: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  emptyLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  emptyValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: LogiPointColors.primary,
  },
  whNameRow: {
    backgroundColor: LogiPointColors.white,
    marginTop: 2,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  whNameLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  whNameValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
});
