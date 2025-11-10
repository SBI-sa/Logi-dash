import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image } from 'react-native';
import { AlertTriangle, Edit2, Plus, X, Trash2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { KPICard } from '@/components/KPICard';
import { ChartCard } from '@/components/ChartCard';

import { Card } from '@/components/Card';
import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function RisksScreen() {
  const { isAdmin } = useAuth();
  const { riskData, updateRiskData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[]>([]);
  const [addRiskModalVisible, setAddRiskModalVisible] = useState(false);
  const [newRiskName, setNewRiskName] = useState('');
  const [newRiskTotalRisks, setNewRiskTotalRisks] = useState('');
  const [newRiskHighRisk, setNewRiskHighRisk] = useState('');
  const [newRisksClosed, setNewRisksClosed] = useState('');

  const handleEdit = (field: string, currentValue: number | string | undefined) => {
    setEditField(field);
    setEditValue(currentValue?.toString() ?? '');
    setEditFields([]);
    setEditModalVisible(true);
  };

  const handleEditArray = (field: string, index: number) => {
    setEditField(`${field}_${index}`);
    
    if (field === 'riskHeatmap') {
      const item = riskData.riskHeatmap[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
        { label: 'Risk Name', value: item.name, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Total Risks', value: item.probability.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
        { label: 'High Risk', value: item.impact.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
        { label: 'Risks Addressed', value: (item.risksClosed ?? 0).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
      ];
      setEditFields(tempFields);
    }
    
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (editFields.length > 0) {
      const [fieldName, indexStr] = editField.split('_');
      const index = parseInt(indexStr);
      
      const updatedData = { ...riskData };
      
      if (fieldName === 'riskHeatmap') {
        const newHeatmap = [...riskData.riskHeatmap];
        const probability = parseInt(editFields[1].value) || 1;
        const impact = parseInt(editFields[2].value) || 1;
        const risksClosed = parseInt(editFields[3].value) || 0;
        const score = probability * impact;
        
        let level: 'high' | 'medium' | 'low' = 'low';
        if (score >= 12) level = 'high';
        else if (score >= 6) level = 'medium';
        
        newHeatmap[index] = {
          name: editFields[0].value,
          probability,
          impact,
          level,
          risksClosed,
        };
        updatedData.riskHeatmap = newHeatmap;
      }
      
      updateRiskData(updatedData);
    } else {
      const updatedData = { ...riskData };
      
      if (editField === 'risksAddressedDate') {
        updatedData.risksAddressedDate = editValue;
        updateRiskData(updatedData);
      } else {
        const numValue = parseFloat(editValue);
        if (isNaN(numValue)) return;
        
        switch (editField) {
          case 'totalRisks':
            updatedData.totalRisks = Math.round(numValue);
            break;
          case 'highRisks':
            updatedData.highRisks = Math.round(numValue);
            break;
          case 'mediumRisks':
            updatedData.mediumRisks = Math.round(numValue);
            break;
          case 'lowRisks':
            updatedData.lowRisks = Math.round(numValue);
            break;
          case 'mitigatedPercentage':
            updatedData.mitigatedPercentage = numValue;
            break;
          case 'mitigatedRisksCount':
            updatedData.mitigatedRisksCount = Math.round(numValue);
            updatedData.mitigatedPercentage = updatedData.totalRisksForMitigation > 0 
              ? Math.round((Math.round(numValue) / updatedData.totalRisksForMitigation) * 100) 
              : 0;
            break;
          case 'totalRisksForMitigation':
            updatedData.totalRisksForMitigation = Math.round(numValue);
            updatedData.mitigatedPercentage = Math.round(numValue) > 0 
              ? Math.round((updatedData.mitigatedRisksCount / Math.round(numValue)) * 100) 
              : 0;
            break;
        }

        updateRiskData(updatedData);
      }
    }
    
    setEditModalVisible(false);
  };

  const handleAddRisk = () => {
    if (!newRiskName.trim()) return;
    
    const probability = parseInt(newRiskTotalRisks) || 1;
    const impact = parseInt(newRiskHighRisk) || 1;
    const risksClosed = parseInt(newRisksClosed) || 0;
    const score = probability * impact;
    
    let level: 'high' | 'medium' | 'low' = 'low';
    if (score >= 12) level = 'high';
    else if (score >= 6) level = 'medium';
    
    const updatedData = { ...riskData };
    updatedData.riskHeatmap = [
      ...riskData.riskHeatmap,
      {
        name: newRiskName.trim(),
        probability,
        impact,
        level,
        risksClosed,
      },
    ];
    
    updateRiskData(updatedData);
    setAddRiskModalVisible(false);
    setNewRiskName('');
    setNewRiskTotalRisks('');
    setNewRiskHighRisk('');
    setNewRisksClosed('');
  };

  const handleRemoveRisk = (index: number) => {
    const updatedData = { ...riskData };
    updatedData.riskHeatmap = riskData.riskHeatmap.filter((_, i) => i !== index);
    updateRiskData(updatedData);
  };

  return (
    <>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiRow}>
            <View>
              <KPICard
                title="Total Risks"
                value={riskData.totalRisks}
                subtitle="Active Risks"
                icon={AlertTriangle}
                color={LogiPointColors.accent}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('totalRisks', riskData.totalRisks)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="High Priority"
                value={riskData.highRisks}
                subtitle="Requires Attention"
                icon={AlertTriangle}
                color={LogiPointColors.error}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('highRisks', riskData.highRisks)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Medium Priority"
                value={riskData.mediumRisks}
                subtitle="Monitor Closely"
                icon={AlertTriangle}
                color={LogiPointColors.warning}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('mediumRisks', riskData.mediumRisks)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Low Priority"
                value={riskData.lowRisks}
                subtitle="Under Control"
                icon={AlertTriangle}
                color={LogiPointColors.success}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('lowRisks', riskData.lowRisks)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Risk Mitigation Progress</Text>
            <Text style={styles.summaryValue}>{riskData.mitigatedPercentage}%</Text>
            <Text style={styles.summarySubtitle}>
              {riskData.mitigatedRisksCount} of {riskData.totalRisksForMitigation} risks mitigated
            </Text>
            {isAdmin && (
              <View style={styles.mitigationEditButtons}>
                <TouchableOpacity
                  style={styles.smallEditButton}
                  onPress={() => handleEdit('mitigatedRisksCount', riskData.mitigatedRisksCount)}
                >
                  <Edit2 size={12} color={LogiPointColors.white} />
                  <Text style={styles.smallEditText}>Edit Mitigated</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.smallEditButton}
                  onPress={() => handleEdit('totalRisksForMitigation', riskData.totalRisksForMitigation)}
                >
                  <Edit2 size={12} color={LogiPointColors.white} />
                  <Text style={styles.smallEditText}>Edit Total</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>

          <ChartCard 
            title="Risks Addressed" 
            subtitle={`As of ${riskData.risksAddressedDate}`}
          >
            {isAdmin && (
              <View style={styles.headerEditButtons}>
                <TouchableOpacity
                  style={[styles.editButton, { position: 'relative', top: 0, right: 0 }]}
                  onPress={() => handleEdit('risksAddressedDate', riskData.risksAddressedDate)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.heatmapContainer}>
              {riskData.riskHeatmap.map((risk, index) => (
                <Card key={index} style={styles.riskCard}>
                  <View style={styles.riskHeader}>
                    <Text style={styles.riskName}>{risk.name}</Text>
                  </View>
                  <View style={styles.riskMetrics}>
                    <View style={styles.riskMetric}>
                      <Text style={styles.metricLabel}>Total Risks</Text>
                      <Text style={styles.metricValue}>{risk.probability}</Text>
                    </View>
                    <View style={styles.riskMetric}>
                      <Text style={styles.metricLabel}>High Risk</Text>
                      <Text style={styles.metricValue}>{risk.impact}</Text>
                    </View>
                    <View style={styles.riskMetric}>
                      <Text style={styles.metricLabel}>Risks Addressed</Text>
                      <Text style={styles.metricValue}>{risk.risksClosed ?? 0}</Text>
                    </View>
                  </View>
                  {isAdmin && (
                    <View style={styles.riskCardButtons}>
                      <TouchableOpacity
                        style={[styles.editButton, { position: 'relative', top: 0, right: 0, marginRight: 8 }]}
                        onPress={() => handleEditArray('riskHeatmap', index)}
                      >
                        <Edit2 size={16} color={LogiPointColors.white} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.removeButton, { position: 'relative', top: 0, right: 0 }]}
                        onPress={() => handleRemoveRisk(index)}
                      >
                        <Trash2 size={16} color={LogiPointColors.white} />
                      </TouchableOpacity>
                    </View>
                  )}
                </Card>
              ))}
              {isAdmin && (
                <TouchableOpacity
                  style={styles.addRiskButton}
                  onPress={() => setAddRiskModalVisible(true)}
                >
                  <Plus size={16} color={LogiPointColors.white} />
                  <Text style={styles.addRiskButtonText}>Add Risk Addressed</Text>
                </TouchableOpacity>
              )}
            </View>
          </ChartCard>
        </ScrollView>
      </View>

      <Modal
        visible={addRiskModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddRiskModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addDepartmentModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Risk Addressed</Text>
              <TouchableOpacity onPress={() => setAddRiskModalVisible(false)}>
                <X size={24} color={LogiPointColors.gray[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Risk Name</Text>
              <TextInput
                style={styles.input}
                value={newRiskName}
                onChangeText={setNewRiskName}
                placeholder="e.g., Supply Chain Disruption"
                placeholderTextColor={LogiPointColors.gray[400]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Total Risks</Text>
              <TextInput
                style={styles.input}
                value={newRiskTotalRisks}
                onChangeText={setNewRiskTotalRisks}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={LogiPointColors.gray[400]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>High Risk</Text>
              <TextInput
                style={styles.input}
                value={newRiskHighRisk}
                onChangeText={setNewRiskHighRisk}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={LogiPointColors.gray[400]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Risks Addressed</Text>
              <TextInput
                style={styles.input}
                value={newRisksClosed}
                onChangeText={setNewRisksClosed}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={LogiPointColors.gray[400]}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddRiskModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddRisk}
              >
                <Text style={styles.saveButtonText}>Add Risk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  kpiRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  kpiSpacer: {
    width: 12,
  },
  heatmapContainer: {
    gap: 12,
  },
  riskCard: {
    padding: 16,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: LogiPointColors.white,
  },
  riskMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  riskMetric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: LogiPointColors.gray[600],
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  summaryCard: {
    alignItems: 'center',
    padding: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: LogiPointColors.success,
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: LogiPointColors.gray[600],
    textAlign: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: LogiPointColors.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  addButton: {
    backgroundColor: LogiPointColors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addDepartmentModal: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: LogiPointColors.midnight,
    backgroundColor: LogiPointColors.white,
  },
  colorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: LogiPointColors.gray[200],
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  saveButton: {
    backgroundColor: LogiPointColors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  mitigationEditButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    justifyContent: 'center',
  },
  smallEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: LogiPointColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  smallEditText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  editButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeButton: {
    backgroundColor: LogiPointColors.error,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerEditButtons: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  riskCardButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addRiskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: LogiPointColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addRiskButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
});
