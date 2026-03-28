import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Edit2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';

interface CIYMovementChartProps {
  data: {
    thisYear: { month: string; inspections: number; pickupDelivery: number }[];
    lastYear: { month: string; inspections: number; pickupDelivery: number }[];
  };
  onEdit?: (year: 'thisYear' | 'lastYear', index: number) => void;
  isAdmin?: boolean;
}

type FilterType = 'all' | 'inspections' | 'pickupDelivery';
type YearFilterType = 'thisYear' | 'lastYear' | 'comparison';

export function CIYMovementChart({ data, onEdit, isAdmin }: CIYMovementChartProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [yearFilter, setYearFilter] = useState<YearFilterType>('thisYear');

  const getMaxValue = () => {
    const allValues: number[] = [];
    
    if (yearFilter === 'comparison') {
      data.thisYear.forEach((d, i) => {
        const lastYearData = data.lastYear[i];
        if (filter === 'inspections') {
          allValues.push(d.inspections, lastYearData.inspections);
        } else if (filter === 'pickupDelivery') {
          allValues.push(d.pickupDelivery, lastYearData.pickupDelivery);
        } else {
          allValues.push(d.inspections + d.pickupDelivery, lastYearData.inspections + lastYearData.pickupDelivery);
        }
      });
    } else {
      const yearData = yearFilter === 'thisYear' ? data.thisYear : data.lastYear;
      yearData.forEach(d => {
        if (filter === 'inspections') {
          allValues.push(d.inspections);
        } else if (filter === 'pickupDelivery') {
          allValues.push(d.pickupDelivery);
        } else {
          allValues.push(d.inspections + d.pickupDelivery);
        }
      });
    }
    
    return Math.max(...allValues, 1);
  };

  const maxValue = getMaxValue();

  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 150;
  };

  const renderBar = (item: { month: string; inspections: number; pickupDelivery: number }, index: number, year: 'thisYear' | 'lastYear') => {
    const inspectionsHeight = getBarHeight(item.inspections);
    const pickupDeliveryHeight = getBarHeight(item.pickupDelivery);

    return (
      <View key={`${year}-${index}`} style={styles.barContainer}>
        <View style={styles.barWrapper}>
          {filter === 'all' && (
            <View style={styles.barStack}>
              <View style={[styles.bar, { height: inspectionsHeight, backgroundColor: '#00617f' }]} />
              <View style={[styles.bar, { height: pickupDeliveryHeight, backgroundColor: '#9b2743', marginTop: 2 }]} />
            </View>
          )}
          {filter === 'inspections' && (
            <View style={[styles.bar, { height: inspectionsHeight, backgroundColor: '#00617f' }]} />
          )}
          {filter === 'pickupDelivery' && (
            <View style={[styles.bar, { height: pickupDeliveryHeight, backgroundColor: '#9b2743' }]} />
          )}
          {filter === 'all' && (
            <Text style={styles.barValue}>{item.inspections + item.pickupDelivery}</Text>
          )}
          {filter === 'inspections' && (
            <Text style={styles.barValue}>{item.inspections}</Text>
          )}
          {filter === 'pickupDelivery' && (
            <Text style={styles.barValue}>{item.pickupDelivery}</Text>
          )}
        </View>
        <Text style={styles.barLabel}>{item.month}</Text>
        {isAdmin && onEdit && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(year, index)}
          >
            <Edit2 size={12} color={LogiPointColors.primary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderComparisonBar = (thisYearItem: { month: string; inspections: number; pickupDelivery: number }, lastYearItem: { month: string; inspections: number; pickupDelivery: number }, index: number) => {
    const thisYearInspectionsHeight = getBarHeight(thisYearItem.inspections);
    const thisYearPickupDeliveryHeight = getBarHeight(thisYearItem.pickupDelivery);
    const lastYearInspectionsHeight = getBarHeight(lastYearItem.inspections);
    const lastYearPickupDeliveryHeight = getBarHeight(lastYearItem.pickupDelivery);

    return (
      <View key={`comparison-${index}`} style={styles.comparisonContainer}>
        <View style={styles.barContainer}>
          <View style={styles.barWrapper}>
            {filter === 'all' && (
              <View style={styles.barStack}>
                <View style={[styles.bar, { height: thisYearInspectionsHeight, backgroundColor: '#00617f' }]} />
                <View style={[styles.bar, { height: thisYearPickupDeliveryHeight, backgroundColor: '#9b2743', marginTop: 2 }]} />
              </View>
            )}
            {filter === 'inspections' && (
              <View style={[styles.bar, { height: thisYearInspectionsHeight, backgroundColor: '#00617f' }]} />
            )}
            {filter === 'pickupDelivery' && (
              <View style={[styles.bar, { height: thisYearPickupDeliveryHeight, backgroundColor: '#9b2743' }]} />
            )}
            {filter === 'all' && (
              <Text style={styles.barValue}>{thisYearItem.inspections + thisYearItem.pickupDelivery}</Text>
            )}
            {filter === 'inspections' && (
              <Text style={styles.barValue}>{thisYearItem.inspections}</Text>
            )}
            {filter === 'pickupDelivery' && (
              <Text style={styles.barValue}>{thisYearItem.pickupDelivery}</Text>
            )}
          </View>
          <Text style={styles.comparisonYearLabel}>2025</Text>
        </View>
        
        <View style={styles.barContainer}>
          <View style={styles.barWrapper}>
            {filter === 'all' && (
              <View style={styles.barStack}>
                <View style={[styles.bar, { height: lastYearInspectionsHeight, backgroundColor: '#00617f', opacity: 0.5 }]} />
                <View style={[styles.bar, { height: lastYearPickupDeliveryHeight, backgroundColor: '#9b2743', opacity: 0.5, marginTop: 2 }]} />
              </View>
            )}
            {filter === 'inspections' && (
              <View style={[styles.bar, { height: lastYearInspectionsHeight, backgroundColor: '#00617f', opacity: 0.5 }]} />
            )}
            {filter === 'pickupDelivery' && (
              <View style={[styles.bar, { height: lastYearPickupDeliveryHeight, backgroundColor: '#9b2743', opacity: 0.5 }]} />
            )}
            {filter === 'all' && (
              <Text style={styles.barValue}>{lastYearItem.inspections + lastYearItem.pickupDelivery}</Text>
            )}
            {filter === 'inspections' && (
              <Text style={styles.barValue}>{lastYearItem.inspections}</Text>
            )}
            {filter === 'pickupDelivery' && (
              <Text style={styles.barValue}>{lastYearItem.pickupDelivery}</Text>
            )}
          </View>
          <Text style={styles.comparisonYearLabel}>2024</Text>
        </View>
        
        <Text style={styles.barLabel}>{thisYearItem.month}</Text>
        {isAdmin && onEdit && (
          <View style={styles.comparisonEditButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEdit('thisYear', index)}
            >
              <Edit2 size={10} color={LogiPointColors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => onEdit('lastYear', index)}
            >
              <Edit2 size={10} color={LogiPointColors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, yearFilter === 'thisYear' && styles.filterButtonActive]}
          onPress={() => setYearFilter('thisYear')}
        >
          <Text style={[styles.filterText, yearFilter === 'thisYear' && styles.filterTextActive]}>
            This Year (2025)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, yearFilter === 'lastYear' && styles.filterButtonActive]}
          onPress={() => setYearFilter('lastYear')}
        >
          <Text style={[styles.filterText, yearFilter === 'lastYear' && styles.filterTextActive]}>
            Last Year (2024)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, yearFilter === 'comparison' && styles.filterButtonActive]}
          onPress={() => setYearFilter('comparison')}
        >
          <Text style={[styles.filterText, yearFilter === 'comparison' && styles.filterTextActive]}>
            Compare Years
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All Combined
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'inspections' && styles.filterButtonActive]}
          onPress={() => setFilter('inspections')}
        >
          <Text style={[styles.filterText, filter === 'inspections' && styles.filterTextActive]}>
            Inspections
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pickupDelivery' && styles.filterButtonActive]}
          onPress={() => setFilter('pickupDelivery')}
        >
          <Text style={[styles.filterText, filter === 'pickupDelivery' && styles.filterTextActive]}>
            Pick Up & Delivery
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#00617f' }]} />
          <Text style={styles.legendText}>Shipment Inspections</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9b2743' }]} />
          <Text style={styles.legendText}>Pick Up & Delivery</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
        <View style={styles.chartContainer}>
          {yearFilter === 'comparison' ? (
            data.thisYear.map((item, index) => renderComparisonBar(item, data.lastYear[index], index))
          ) : (
            (yearFilter === 'thisYear' ? data.thisYear : data.lastYear).map((item, index) => renderBar(item, index, yearFilter))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: LogiPointColors.gray[100],
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
  },
  filterButtonActive: {
    backgroundColor: LogiPointColors.primary,
    borderColor: LogiPointColors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[600],
  },
  filterTextActive: {
    color: LogiPointColors.white,
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
  barStack: {
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  editButton: {
    padding: 4,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
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
  comparisonEditButtons: {
    flexDirection: 'row',
    gap: 4,
  },
});
