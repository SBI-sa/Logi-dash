import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Edit2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { ChartCard } from '@/components/ChartCard';
import { EditModal } from '@/components/EditModal';
import { CIYMovementChart } from '@/components/CIYMovementChart';
import { ClusteredColumnChart } from '@/components/ClusteredColumnChart';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function POScreen() {
  const { isAdmin } = useAuth();
  const { poData, updatePoData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[]>([]);
  const [fclLclFilter, setFclLclFilter] = useState<'all' | 'fcl' | 'lcl'>('all');

  const screenOptions = useMemo(() => ({
    title: 'PO',
    headerStyle: {
      backgroundColor: LogiPointColors.midnight,
    },
    headerTintColor: LogiPointColors.white,
    headerTitleStyle: {
      fontWeight: '700' as const,
    },
  }), []);

  const handleEditQuarter = (type: 'fcl' | 'lcl', quarter: 'q1' | 'q2' | 'q3' | 'q4') => {
    setEditField(`${type}_quarterly_${quarter}`);
    const qData = type === 'fcl' ? poData.fclQuarterly[quarter] : poData.lclQuarterly[quarter];
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Units', value: qData.units.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Bar Color (hex)', value: qData.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditMonth = (type: 'fcl' | 'lcl', index: number) => {
    setEditField(`${type}_monthly_${index}`);
    const monthData = type === 'fcl' ? poData.fclMonthly[index] : poData.lclMonthly[index];
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Month', value: monthData.month, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Units', value: monthData.units.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Bar Color (hex)', value: monthData.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditCIY = (year: 'thisYear' | 'lastYear', index: number) => {
    setEditField(`ciy_${year}_${index}`);
    const ciyData = poData.ciyMovement[year][index];
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Month', value: ciyData.month, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Inspections', value: ciyData.inspections.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Pick Up & Delivery', value: ciyData.pickupDelivery.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (editFields.length > 0) {
      const updatedData = { ...poData };
      
      if (editField.startsWith('fcl_quarterly_') || editField.startsWith('lcl_quarterly_')) {
        const [type, , quarter] = editField.split('_') as ['fcl' | 'lcl', string, 'q1' | 'q2' | 'q3' | 'q4'];
        
        if (type === 'fcl') {
          updatedData.fclQuarterly = {
            ...poData.fclQuarterly,
            [quarter]: {
              units: parseFloat(editFields[0].value) || 0,
              color: editFields[1].value,
            },
          };
        } else {
          updatedData.lclQuarterly = {
            ...poData.lclQuarterly,
            [quarter]: {
              units: parseFloat(editFields[0].value) || 0,
              color: editFields[1].value,
            },
          };
        }
      } else if (editField.startsWith('fcl_monthly_') || editField.startsWith('lcl_monthly_')) {
        const [type, , indexStr] = editField.split('_');
        const index = parseInt(indexStr);
        
        if (type === 'fcl') {
          const newMonthly = [...poData.fclMonthly];
          newMonthly[index] = {
            month: editFields[0].value,
            units: parseFloat(editFields[1].value) || 0,
            color: editFields[2].value,
          };
          updatedData.fclMonthly = newMonthly;
        } else {
          const newMonthly = [...poData.lclMonthly];
          newMonthly[index] = {
            month: editFields[0].value,
            units: parseFloat(editFields[1].value) || 0,
            color: editFields[2].value,
          };
          updatedData.lclMonthly = newMonthly;
        }
      } else if (editField.startsWith('ciy_')) {
        const parts = editField.split('_');
        const year = parts[1] as 'thisYear' | 'lastYear';
        const index = parseInt(parts[2]);
        
        const newCiyMovement = {
          ...poData.ciyMovement,
          [year]: [...poData.ciyMovement[year]],
        };
        newCiyMovement[year][index] = {
          month: editFields[0].value,
          inspections: parseFloat(editFields[1].value) || 0,
          pickupDelivery: parseFloat(editFields[2].value) || 0,
        };
        updatedData.ciyMovement = newCiyMovement;
      }

      updatePoData(updatedData);
    }
    
    setEditModalVisible(false);
  };

  const getTotalUnits = (type: 'fcl' | 'lcl') => {
    const quarters: ('q1' | 'q2' | 'q3' | 'q4')[] = ['q1', 'q2', 'q3', 'q4'];
    const data = type === 'fcl' ? poData.fclQuarterly : poData.lclQuarterly;
    return quarters.reduce((sum, q) => sum + data[q].units, 0);
  };

  const quarters: ('q1' | 'q2' | 'q3' | 'q4')[] = ['q1', 'q2', 'q3', 'q4'];

  const quarterlyClusterData = quarters.map((q) => ({
    label: q.toUpperCase(),
    fcl: poData.fclQuarterly[q].units,
    lcl: poData.lclQuarterly[q].units,
  }));

  const getMaxFclLclValue = () => {
    const allValues: number[] = [];
    
    poData.fclMonthly.forEach((fcl, index) => {
      const lcl = poData.lclMonthly[index];
      if (fclLclFilter === 'fcl') {
        allValues.push(fcl.units);
      } else if (fclLclFilter === 'lcl') {
        allValues.push(lcl.units);
      } else {
        allValues.push(fcl.units + lcl.units);
      }
    });
    
    return Math.max(...allValues, 1);
  };

  const getFclLclBarHeight = (value: number) => {
    const maxValue = getMaxFclLclValue();
    if (maxValue === 0) return 0;
    return (value / maxValue) * 150;
  };

  return (
    <>
      <Stack.Screen options={screenOptions} />
      
      <EditModal
        visible={editModalVisible}
        title={editField}
        value={editValue}
        onChangeText={setEditValue}
        onSave={handleSave}
        onCancel={() => setEditModalVisible(false)}
        fields={editFields.length > 0 ? editFields : undefined}
      />
      
      <View style={styles.container}>
        <View style={styles.backgroundLogo}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4i9f5ip8s1j9hyoj71h9q' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <PageHeader title="Purchase Orders (PO)" lastUpdatedKey="po" />
          <ChartCard title="CIY Movement" subtitle="Monthly Comparison">
            <CIYMovementChart 
              data={poData.ciyMovement}
              onEdit={isAdmin ? handleEditCIY : undefined}
              isAdmin={isAdmin}
            />
          </ChartCard>

          <ChartCard title={`Quarterly Movement`} subtitle="Clustered by FCL vs LCL">
            <ClusteredColumnChart data={quarterlyClusterData} />
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {quarters.map((q) => (
                  <React.Fragment key={q}>
                    <TouchableOpacity
                      style={styles.chartEditButton}
                      onPress={() => handleEditQuarter('fcl', q)}
                    >
                      <Edit2 size={14} color={LogiPointColors.primary} />
                      <Text style={styles.chartEditText}>Edit FCL {q.toUpperCase()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.chartEditButton}
                      onPress={() => handleEditQuarter('lcl', q)}
                    >
                      <Edit2 size={14} color={LogiPointColors.primary} />
                      <Text style={styles.chartEditText}>Edit LCL {q.toUpperCase()}</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>
            )}
          </ChartCard>

          <ChartCard title="FCL & LCL Movement" subtitle="Monthly Comparison">
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[styles.filterButton, fclLclFilter === 'all' && styles.filterButtonActive]}
                onPress={() => setFclLclFilter('all')}
              >
                <Text style={[styles.filterText, fclLclFilter === 'all' && styles.filterTextActive]}>
                  All Combined
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, fclLclFilter === 'fcl' && styles.filterButtonActive]}
                onPress={() => setFclLclFilter('fcl')}
              >
                <Text style={[styles.filterText, fclLclFilter === 'fcl' && styles.filterTextActive]}>
                  FCL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterButton, fclLclFilter === 'lcl' && styles.filterButtonActive]}
                onPress={() => setFclLclFilter('lcl')}
              >
                <Text style={[styles.filterText, fclLclFilter === 'lcl' && styles.filterTextActive]}>
                  LCL
                </Text>
              </TouchableOpacity>
            </View>

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
                {poData.fclMonthly.map((fcl, index) => {
                  const lcl = poData.lclMonthly[index];
                  const fclHeight = getFclLclBarHeight(fcl.units);
                  const lclHeight = getFclLclBarHeight(lcl.units);

                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        {fclLclFilter === 'all' && (
                          <View style={styles.barStack}>
                            <View style={[styles.bar, { height: fclHeight, backgroundColor: '#00617f' }]} />
                            <View style={[styles.bar, { height: lclHeight, backgroundColor: '#9b2743', marginTop: 2 }]} />
                          </View>
                        )}
                        {fclLclFilter === 'fcl' && (
                          <View style={[styles.bar, { height: fclHeight, backgroundColor: '#00617f' }]} />
                        )}
                        {fclLclFilter === 'lcl' && (
                          <View style={[styles.bar, { height: lclHeight, backgroundColor: '#9b2743' }]} />
                        )}
                        {fclLclFilter === 'all' && (
                          <Text style={styles.barValue}>{fcl.units + lcl.units}</Text>
                        )}
                        {fclLclFilter === 'fcl' && (
                          <Text style={styles.barValue}>{fcl.units}</Text>
                        )}
                        {fclLclFilter === 'lcl' && (
                          <Text style={styles.barValue}>{lcl.units}</Text>
                        )}
                      </View>
                      <Text style={styles.barLabel}>{fcl.month}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>

            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {poData.fclMonthly.map((m, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chartEditButton}
                    onPress={() => handleEditMonth('fcl', index)}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.chartEditText}>Edit FCL {m.month}</Text>
                  </TouchableOpacity>
                ))}
                {poData.lclMonthly.map((m, index) => (
                  <TouchableOpacity
                    key={`lcl-${index}`}
                    style={styles.chartEditButton}
                    onPress={() => handleEditMonth('lcl', index)}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.chartEditText}>Edit LCL {m.month}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ChartCard>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LogiPointColors.gray[50],
  },
  backgroundLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  logoImage: {
    width: 500,
    height: 500,
    opacity: 0.06,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  chartEditButtons: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chartEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
  },
  chartEditText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.primary,
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
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 13,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
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
    fontSize: 9,
    color: LogiPointColors.gray[600],
    fontWeight: '500' as const,
  },
});
