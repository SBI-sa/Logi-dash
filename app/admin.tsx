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
    setSalesForm({
      totalRevenue: salesData.totalRevenue.toString(),
      ytdRevenue: salesData.ytdRevenue.toString(),
      mtdRevenue: salesData.mtdRevenue.toString(),
      revenueTarget: salesData.revenueTarget.toString(),
      growthPercentage: salesData.growthPercentage.toString(),
    });
  }, [salesData]);

  useEffect(() => {
    setRiskForm({
      totalRisks: riskData.totalRisks.toString(),
      highRisks: riskData.highRisks.toString(),
      mediumRisks: riskData.mediumRisks.toString(),
      lowRisks: riskData.lowRisks.toString(),
      mitigatedPercentage: riskData.mitigatedPercentage.toString(),
    });
  }, [riskData]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      Alert.alert('Access Denied', 'You do not have admin privileges');
      router.replace('/');
    }
  }, [isLoading, isAdmin]);

  const handleSaveSales = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const updatedData = {
        ...salesData,
        totalRevenue: parseFloat(salesForm.totalRevenue),
        ytdRevenue: parseFloat(salesForm.ytdRevenue),
        mtdRevenue: parseFloat(salesForm.mtdRevenue),
        revenueTarget: parseFloat(salesForm.revenueTarget),
        growthPercentage: parseFloat(salesForm.growthPercentage),
      };
      await updateSalesData(updatedData);
      setSuccessMessage('✅ Sales data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setSalesForm({
        totalRevenue: salesData.totalRevenue.toString(),
        ytdRevenue: salesData.ytdRevenue.toString(),
        mtdRevenue: salesData.mtdRevenue.toString(),
        revenueTarget: salesData.revenueTarget.toString(),
        growthPercentage: salesData.growthPercentage.toString(),
      });
      Alert.alert('Error', 'Failed to update sales data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRisks = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    try {
      const updatedData = {
        ...riskData,
        totalRisks: parseInt(riskForm.totalRisks),
        highRisks: parseInt(riskForm.highRisks),
        mediumRisks: parseInt(riskForm.mediumRisks),
        lowRisks: parseInt(riskForm.lowRisks),
        mitigatedPercentage: parseFloat(riskForm.mitigatedPercentage),
      };
      await updateRiskData(updatedData);
      setSuccessMessage('✅ Risk data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setRiskForm({
        totalRisks: riskData.totalRisks.toString(),
        highRisks: riskData.highRisks.toString(),
        mediumRisks: riskData.mediumRisks.toString(),
        lowRisks: riskData.lowRisks.toString(),
        mitigatedPercentage: riskData.mitigatedPercentage.toString(),
      });
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
                onChangeText={(text) => setSalesForm({...salesForm, totalRevenue: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>YTD Revenue</Text>
              <TextInput
                style={styles.input}
                value={salesForm.ytdRevenue}
                onChangeText={(text) => setSalesForm({...salesForm, ytdRevenue: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>MTD Revenue</Text>
              <TextInput
                style={styles.input}
                value={salesForm.mtdRevenue}
                onChangeText={(text) => setSalesForm({...salesForm, mtdRevenue: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Revenue Target</Text>
              <TextInput
                style={styles.input}
                value={salesForm.revenueTarget}
                onChangeText={(text) => setSalesForm({...salesForm, revenueTarget: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Growth Percentage</Text>
              <TextInput
                style={styles.input}
                value={salesForm.growthPercentage}
                onChangeText={(text) => setSalesForm({...salesForm, growthPercentage: text})}
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
                onChangeText={(text) => setRiskForm({...riskForm, totalRisks: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>High Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.highRisks}
                onChangeText={(text) => setRiskForm({...riskForm, highRisks: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medium Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.mediumRisks}
                onChangeText={(text) => setRiskForm({...riskForm, mediumRisks: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Low Risks</Text>
              <TextInput
                style={styles.input}
                value={riskForm.lowRisks}
                onChangeText={(text) => setRiskForm({...riskForm, lowRisks: text})}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mitigated Percentage</Text>
              <TextInput
                style={styles.input}
                value={riskForm.mitigatedPercentage}
                onChangeText={(text) => setRiskForm({...riskForm, mitigatedPercentage: text})}
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
