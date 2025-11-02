import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const { salesData, updateSalesData, riskData, updateRiskData } = useData();
  
  const [activeTab, setActiveTab] = useState('sales');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [salesDataSnapshot, setSalesDataSnapshot] = useState(salesData);
  const [riskDataSnapshot, setRiskDataSnapshot] = useState(riskData);
  const [salesDirty, setSalesDirty] = useState(false);
  const [riskDirty, setRiskDirty] = useState(false);

  const [salesForm, setSalesForm] = useState({
    totalRevenue: salesData.totalRevenue.toString(),
    ytdRevenue: salesData.ytdRevenue.toString(),
    mtdRevenue: salesData.mtdRevenue.toString(),
    revenueTarget: salesData.revenueTarget.toString(),
    growthPercentage: salesData.growthPercentage.toString(),
  });

  const [riskForm, setRiskForm] = useState({
    totalRisks: riskData.totalRisks.toString(),
    highRisks: riskData.highRisks.toString(),
    mediumRisks: riskData.mediumRisks.toString(),
    lowRisks: riskData.lowRisks.toString(),
    mitigatedPercentage: riskData.mitigatedPercentage.toString(),
  });

  useEffect(() => {
    if (!isSaving && !salesDirty) {
      setSalesDataSnapshot(salesData);
      setSalesForm({
        totalRevenue: salesData.totalRevenue.toString(),
        ytdRevenue: salesData.ytdRevenue.toString(),
        mtdRevenue: salesData.mtdRevenue.toString(),
        revenueTarget: salesData.revenueTarget.toString(),
        growthPercentage: salesData.growthPercentage.toString(),
      });
    }
  }, [salesData, isSaving, salesDirty]);

  useEffect(() => {
    if (!isSaving && !riskDirty) {
      setRiskDataSnapshot(riskData);
      setRiskForm({
        totalRisks: riskData.totalRisks.toString(),
        highRisks: riskData.highRisks.toString(),
        mediumRisks: riskData.mediumRisks.toString(),
        lowRisks: riskData.lowRisks.toString(),
        mitigatedPercentage: riskData.mitigatedPercentage.toString(),
      });
    }
  }, [riskData, isSaving, riskDirty]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      Alert.alert('Access Denied', 'You do not have admin privileges');
      router.replace('/');
    }
  }, [isLoading, isAdmin]);

  const handleSalesFormChange = (field: string, value: string) => {
    setSalesDirty(true);
    setSalesForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskFormChange = (field: string, value: string) => {
    setRiskDirty(true);
    setRiskForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSales = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...salesForm };
    try {
      const updatedData = {
        ...salesDataSnapshot,
        totalRevenue: parseFloat(prevForm.totalRevenue),
        ytdRevenue: parseFloat(prevForm.ytdRevenue),
        mtdRevenue: parseFloat(prevForm.mtdRevenue),
        revenueTarget: parseFloat(prevForm.revenueTarget),
        growthPercentage: parseFloat(prevForm.growthPercentage),
      };
      await updateSalesData(updatedData);
      setSalesDirty(false);
      setSuccessMessage('✅ Sales data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setSalesForm(prevForm);
      Alert.alert('Error', 'Failed to update sales data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRisks = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...riskForm };
    try {
      const updatedData = {
        ...riskDataSnapshot,
        totalRisks: parseInt(prevForm.totalRisks),
        highRisks: parseInt(prevForm.highRisks),
        mediumRisks: parseInt(prevForm.mediumRisks),
        lowRisks: parseInt(prevForm.lowRisks),
        mitigatedPercentage: parseFloat(prevForm.mitigatedPercentage),
      };
      await updateRiskData(updatedData);
      setRiskDirty(false);
      setSuccessMessage('✅ Risk data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setRiskForm(prevForm);
      Alert.alert('Error', 'Failed to update risk data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user?.name}</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'sales' && styles.activeTab]}
          onPress={() => setActiveTab('sales')}
        >
          <Text style={[styles.tabText, activeTab === 'sales' && styles.activeTabText]}>Sales</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'risks' && styles.activeTab]}
          onPress={() => setActiveTab('risks')}
        >
          <Text style={[styles.tabText, activeTab === 'risks' && styles.activeTabText]}>Risks</Text>
        </TouchableOpacity>
      </View>

      {successMessage ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      <ScrollView style={styles.scrollView}>
        {activeTab === 'sales' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Sales Data</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Revenue</Text>
              <TextInput
                style={styles.input}
                value={salesForm.totalRevenue}
                onChangeText={(text) => handleSalesFormChange('totalRevenue', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>YTD Revenue</Text>
              <TextInput
                style={styles.input}
                value={salesForm.ytdRevenue}
                onChangeText={(text) => handleSalesFormChange('ytdRevenue', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>MTD Revenue</Text>
              <TextInput
                style={styles.input}
                value={salesForm.mtdRevenue}
                onChangeText={(text) => handleSalesFormChange('mtdRevenue', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Revenue Target</Text>
              <TextInput
                style={styles.input}
                value={salesForm.revenueTarget}
                onChangeText={(text) => handleSalesFormChange('revenueTarget', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Growth Percentage</Text>
              <TextInput
                style={styles.input}
                value={salesForm.growthPercentage}
                onChangeText={(text) => handleSalesFormChange('growthPercentage', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveSales}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Sales Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'risks' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Risk Data (KRI)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.totalRisks}
                onChangeText={(text) => handleRiskFormChange('totalRisks', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>High Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.highRisks}
                onChangeText={(text) => handleRiskFormChange('highRisks', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medium Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.mediumRisks}
                onChangeText={(text) => handleRiskFormChange('mediumRisks', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Low Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.lowRisks}
                onChangeText={(text) => handleRiskFormChange('lowRisks', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mitigated Percentage</Text>
              <TextInput
                style={styles.input}
                value={riskForm.mitigatedPercentage}
                onChangeText={(text) => handleRiskFormChange('mitigatedPercentage', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveRisks}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Risk Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1929',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e3a5f',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a0aec0',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1e3a5f',
  },
  activeTab: {
    backgroundColor: '#00617f',
  },
  tabText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  successBanner: {
    backgroundColor: '#10b981',
    padding: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 8,
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#a0aec0',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#00617f',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
