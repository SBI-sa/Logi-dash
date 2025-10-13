import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Edit2, Plus, Trash2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { ChartCard } from '@/components/ChartCard';
import { BulletChart } from '@/components/BulletChart';
import { SmallMultiplesChart } from '@/components/SmallMultiplesChart';
import { SimplePieChart, PieChartData } from '@/components/SimplePieChart';
import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function VASScreen() {
  const { isAdmin } = useAuth();
  const { vasData, updateVasData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[]>([]);

  const handleEditDeliveryTotal = () => {
    setEditField('delivery_total');
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Year', value: vasData.deliveryTotal.year, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Current Total', value: vasData.deliveryTotal.current.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Previous Total', value: vasData.deliveryTotal.previous.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Color (hex)', value: vasData.deliveryTotal.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditLabellingTotal = () => {
    setEditField('labelling_total');
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Year', value: vasData.labellingTotal.year, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Current Total', value: vasData.labellingTotal.current.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Previous Total', value: vasData.labellingTotal.previous.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Color (hex)', value: vasData.labellingTotal.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditClient = (index: number) => {
    setEditField(`client_${index}`);
    const client = vasData.top5Clients[index];
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Client Name', value: client.name, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Arrival Volume', value: client.year2024.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Delivery Volume', value: client.year2025.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Color (hex)', value: client.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditQuarter = (type: 'labelling' | 'delivery', quarter: 'q1' | 'q2' | 'q3' | 'q4') => {
    setEditField(`${type}_${quarter}`);
    const qData = type === 'labelling' ? vasData.labellingQuarterly[quarter] : vasData.deliveryQuarterly[quarter];
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: '2025 Value', value: qData.current.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: '2024 Value', value: qData.lastYear.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Color (hex)', value: qData.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (editFields.length > 0) {
      const updatedData = { ...vasData };
      
      if (editField === 'delivery_total') {
        const current = parseFloat(editFields[1].value) || 0;
        const previous = parseFloat(editFields[2].value) || 0;
        const percentageChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
        updatedData.deliveryTotal = {
          year: editFields[0].value,
          current,
          previous,
          percentageChange,
          color: editFields[3].value,
        };
      } else if (editField === 'labelling_total') {
        const current = parseFloat(editFields[1].value) || 0;
        const previous = parseFloat(editFields[2].value) || 0;
        const percentageChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
        updatedData.labellingTotal = {
          year: editFields[0].value,
          current,
          previous,
          percentageChange,
          color: editFields[3].value,
        };
      } else if (editField.startsWith('client_')) {
        const index = parseInt(editField.split('_')[1]);
        const newClients = [...vasData.top5Clients];
        newClients[index] = {
          name: editFields[0].value,
          year2024: parseFloat(editFields[1].value) || 0,
          year2025: parseFloat(editFields[2].value) || 0,
          color: editFields[3].value,
        };
        updatedData.top5Clients = newClients;
      } else if (editField.startsWith('labelling_') || editField.startsWith('delivery_')) {
        const [type, quarter] = editField.split('_') as ['labelling' | 'delivery', 'q1' | 'q2' | 'q3' | 'q4'];
        
        if (type === 'labelling') {
          updatedData.labellingQuarterly = {
            ...vasData.labellingQuarterly,
            [quarter]: {
              current: parseFloat(editFields[0].value) || 0,
              lastYear: parseFloat(editFields[1].value) || 0,
              color: editFields[2].value,
            },
          };
        } else {
          updatedData.deliveryQuarterly = {
            ...vasData.deliveryQuarterly,
            [quarter]: {
              current: parseFloat(editFields[0].value) || 0,
              lastYear: parseFloat(editFields[1].value) || 0,
              color: editFields[2].value,
            },
          };
        }
      }

      updateVasData(updatedData);
    }
    
    setEditModalVisible(false);
  };

  const handleDeleteClient = (index: number) => {
    const updatedData = { ...vasData };
    updatedData.top5Clients = vasData.top5Clients.filter((_, i) => i !== index);
    updateVasData(updatedData);
  };

  const handleAddClient = () => {
    const updatedData = { ...vasData };
    updatedData.top5Clients = [
      ...vasData.top5Clients,
      { name: 'New Client', year2024: 0, year2025: 0, color: '#00617f' },
    ];
    updateVasData(updatedData);
  };

  const renderQuarterlyPieCharts = (
    title: string,
    subtitle: string,
    type: 'labelling' | 'delivery',
    data: typeof vasData.labellingQuarterly
  ) => {
    const quarters: ('q1' | 'q2' | 'q3' | 'q4')[] = ['q1', 'q2', 'q3', 'q4'];
    
    return (
      <ChartCard title={title} subtitle={subtitle}>
        <View style={styles.quarterlyGrid}>
          {quarters.map((q) => {
            const qData = data[q];
            const pieData: PieChartData[] = [
              { label: '2025', value: qData.current, color: qData.color || LogiPointColors.primary },
              { label: '2024', value: qData.lastYear, color: LogiPointColors.beige },
            ];
            
            return (
              <View key={q} style={styles.quarterCard}>
                <Text style={styles.quarterTitle}>{q.toUpperCase()}</Text>
                <SimplePieChart 
                  data={pieData}
                  size={140}
                />
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.quarterEditButton}
                    onPress={() => handleEditQuarter(type, q)}
                  >
                    <Edit2 size={12} color={LogiPointColors.primary} />
                    <Text style={styles.quarterEditText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ChartCard>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'VAS',
          headerStyle: {
            backgroundColor: LogiPointColors.midnight,
          },
          headerTintColor: LogiPointColors.white,
          headerTitleStyle: {
            fontWeight: '700' as const,
          },
        }} 
      />
      
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
          <View style={styles.topCardsRow}>
            <View style={styles.topCard}>
              <ChartCard title="Delivery Total" subtitle="Year Comparison">
                <BulletChart
                  year={vasData.deliveryTotal.year}
                  current={vasData.deliveryTotal.current}
                  previous={vasData.deliveryTotal.previous}
                  percentageChange={vasData.deliveryTotal.percentageChange}
                  color={vasData.deliveryTotal.color}
                />
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditDeliveryTotal}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </ChartCard>
            </View>

            <View style={styles.topCard}>
              <ChartCard title="Labelling Total" subtitle="Year Comparison">
                <BulletChart
                  year={vasData.labellingTotal.year}
                  current={vasData.labellingTotal.current}
                  previous={vasData.labellingTotal.previous}
                  percentageChange={vasData.labellingTotal.percentageChange}
                  color={vasData.labellingTotal.color}
                />
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditLabellingTotal}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </ChartCard>
            </View>
          </View>

          {renderQuarterlyPieCharts(
            'Quarterly Labelling Comparison',
            '2025 vs 2024',
            'labelling',
            vasData.labellingQuarterly
          )}

          {renderQuarterlyPieCharts(
            'Quarterly Delivery Comparison',
            '2025 vs 2024',
            'delivery',
            vasData.deliveryQuarterly
          )}

          <ChartCard title="Top 5 Clients (Arrival vs Delivery)" subtitle="Volume Comparison">
            <SmallMultiplesChart data={vasData.top5Clients} />
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {vasData.top5Clients.map((c, index) => (
                  <View key={index} style={styles.clientEditRow}>
                    <TouchableOpacity
                      style={styles.chartEditButton}
                      onPress={() => handleEditClient(index)}
                    >
                      <Edit2 size={14} color={LogiPointColors.primary} />
                      <Text style={styles.chartEditText}>Edit {c.name}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.chartEditButton, styles.deleteButton]}
                      onPress={() => handleDeleteClient(index)}
                    >
                      <Trash2 size={14} color={LogiPointColors.chart.red} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.chartEditButton, styles.addButton]}
                  onPress={handleAddClient}
                >
                  <Plus size={14} color={LogiPointColors.chart.green} />
                  <Text style={[styles.chartEditText, { color: LogiPointColors.chart.green }]}>Add Client</Text>
                </TouchableOpacity>
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
  topCardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  topCard: {
    flex: 1,
  },
  editButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.primary,
  },
  chartEditButtons: {
    marginTop: 16,
    gap: 8,
  },
  clientEditRow: {
    flexDirection: 'row',
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
    flex: 1,
  },
  chartEditText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.primary,
  },
  deleteButton: {
    borderColor: LogiPointColors.chart.red,
    flex: 0,
    paddingHorizontal: 8,
  },
  addButton: {
    borderColor: LogiPointColors.chart.green,
  },
  quarterlyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  quarterCard: {
    width: '48%',
    padding: 12,
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
    gap: 12,
  },
  quarterTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    textAlign: 'center',
  },
  quarterEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 6,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
  },
  quarterEditText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: LogiPointColors.primary,
  },
});
