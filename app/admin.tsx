import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const {
    salesData,
    updateSalesData,
    riskData,
    updateRiskData,
    logisticsData,
    updateLogisticsData,
    warehouseData,
    updateWarehouseData,
    realEstateData,
    updateRealEstateData,
    contractData,
    updateContractData,
    vasData,
    updateVasData,
    poData,
    updatePoData,
  } = useData();
  
  const [activeTab, setActiveTab] = useState('sales');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [salesDataSnapshot, setSalesDataSnapshot] = useState(salesData);
  const [riskDataSnapshot, setRiskDataSnapshot] = useState(riskData);
  const [logisticsDataSnapshot, setLogisticsDataSnapshot] = useState(logisticsData);
  const [warehouseDataSnapshot, setWarehouseDataSnapshot] = useState(warehouseData);
  const [realEstateDataSnapshot, setRealEstateDataSnapshot] = useState(realEstateData);
  const [contractDataSnapshot, setContractDataSnapshot] = useState(contractData);
  const [vasDataSnapshot, setVasDataSnapshot] = useState(vasData);
  const [poDataSnapshot, setPoDataSnapshot] = useState(poData);
  
  const [salesDirty, setSalesDirty] = useState(false);
  const [riskDirty, setRiskDirty] = useState(false);
  const [logisticsDirty, setLogisticsDirty] = useState(false);
  const [warehouseDirty, setWarehouseDirty] = useState(false);
  const [realEstateDirty, setRealEstateDirty] = useState(false);
  const [contractDirty, setContractDirty] = useState(false);
  const [vasDirty, setVasDirty] = useState(false);
  const [poDirty, setPoDirty] = useState(false);

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

  const [logisticsForm, setLogisticsForm] = useState({
    onTimeDeliveryRate: logisticsData.onTimeDeliveryRate.toString(),
    averageDeliveryTime: logisticsData.averageDeliveryTime.toString(),
    activeShipments: logisticsData.activeShipments.toString(),
    delayedShipments: logisticsData.delayedShipments.toString(),
    trucks: logisticsData.trucks.toString(),
    drivers: logisticsData.drivers.toString(),
  });

  const [warehouseForm, setWarehouseForm] = useState({
    currentOccupancy: warehouseData.currentOccupancy.toString(),
    capacity: warehouseData.capacity.toString(),
    occupancyPercentage: warehouseData.occupancyPercentage.toString(),
    inboundShipments: warehouseData.inboundShipments.toString(),
    outboundShipments: warehouseData.outboundShipments.toString(),
    inventoryTurnover: warehouseData.inventoryTurnover.toString(),
  });

  const [realEstateForm, setRealEstateForm] = useState({
    jipTotalCapacity: realEstateData.jipTotalCapacity.toString(),
    jipOccupiedLand: realEstateData.jipOccupiedLand.toString(),
    jipOccupancyPercentage: realEstateData.jipOccupancyPercentage.toString(),
    jipAverageRate: realEstateData.jipAverageRate.toString(),
    parkingAvailableSpaces: realEstateData.parking.availableSpaces.toString(),
    parkingRentedSpaces: realEstateData.parking.rentedSpaces.toString(),
  });

  const [contractForm, setContractForm] = useState({
    expiringThisMonth: contractData.expiringThisMonth.toString(),
    expiringThisQuarter: contractData.expiringThisQuarter.toString(),
    totalContracts: contractData.totalContracts.toString(),
  });

  const [vasForm, setVasForm] = useState({
    deliveryCurrent: vasData.deliveryTotal.current.toString(),
    deliveryPrevious: vasData.deliveryTotal.previous.toString(),
    labellingCurrent: vasData.labellingTotal.current.toString(),
    labellingPrevious: vasData.labellingTotal.previous.toString(),
  });

  const [poForm, setPoForm] = useState({
    fclQ1: poData.fclQuarterly.q1.units.toString(),
    fclQ2: poData.fclQuarterly.q2.units.toString(),
    fclQ3: poData.fclQuarterly.q3.units.toString(),
    fclQ4: poData.fclQuarterly.q4.units.toString(),
    lclQ1: poData.lclQuarterly.q1.units.toString(),
    lclQ2: poData.lclQuarterly.q2.units.toString(),
    lclQ3: poData.lclQuarterly.q3.units.toString(),
    lclQ4: poData.lclQuarterly.q4.units.toString(),
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
    if (!isSaving && !logisticsDirty) {
      setLogisticsDataSnapshot(logisticsData);
      setLogisticsForm({
        onTimeDeliveryRate: logisticsData.onTimeDeliveryRate.toString(),
        averageDeliveryTime: logisticsData.averageDeliveryTime.toString(),
        activeShipments: logisticsData.activeShipments.toString(),
        delayedShipments: logisticsData.delayedShipments.toString(),
        trucks: logisticsData.trucks.toString(),
        drivers: logisticsData.drivers.toString(),
      });
    }
  }, [logisticsData, isSaving, logisticsDirty]);

  useEffect(() => {
    if (!isSaving && !warehouseDirty) {
      setWarehouseDataSnapshot(warehouseData);
      setWarehouseForm({
        currentOccupancy: warehouseData.currentOccupancy.toString(),
        capacity: warehouseData.capacity.toString(),
        occupancyPercentage: warehouseData.occupancyPercentage.toString(),
        inboundShipments: warehouseData.inboundShipments.toString(),
        outboundShipments: warehouseData.outboundShipments.toString(),
        inventoryTurnover: warehouseData.inventoryTurnover.toString(),
      });
    }
  }, [warehouseData, isSaving, warehouseDirty]);

  useEffect(() => {
    if (!isSaving && !realEstateDirty) {
      setRealEstateDataSnapshot(realEstateData);
      setRealEstateForm({
        jipTotalCapacity: realEstateData.jipTotalCapacity.toString(),
        jipOccupiedLand: realEstateData.jipOccupiedLand.toString(),
        jipOccupancyPercentage: realEstateData.jipOccupancyPercentage.toString(),
        jipAverageRate: realEstateData.jipAverageRate.toString(),
        parkingAvailableSpaces: realEstateData.parking.availableSpaces.toString(),
        parkingRentedSpaces: realEstateData.parking.rentedSpaces.toString(),
      });
    }
  }, [realEstateData, isSaving, realEstateDirty]);

  useEffect(() => {
    if (!isSaving && !contractDirty) {
      setContractDataSnapshot(contractData);
      setContractForm({
        expiringThisMonth: contractData.expiringThisMonth.toString(),
        expiringThisQuarter: contractData.expiringThisQuarter.toString(),
        totalContracts: contractData.totalContracts.toString(),
      });
    }
  }, [contractData, isSaving, contractDirty]);

  useEffect(() => {
    if (!isSaving && !vasDirty) {
      setVasDataSnapshot(vasData);
      setVasForm({
        deliveryCurrent: vasData.deliveryTotal.current.toString(),
        deliveryPrevious: vasData.deliveryTotal.previous.toString(),
        labellingCurrent: vasData.labellingTotal.current.toString(),
        labellingPrevious: vasData.labellingTotal.previous.toString(),
      });
    }
  }, [vasData, isSaving, vasDirty]);

  useEffect(() => {
    if (!isSaving && !poDirty) {
      setPoDataSnapshot(poData);
      setPoForm({
        fclQ1: poData.fclQuarterly.q1.units.toString(),
        fclQ2: poData.fclQuarterly.q2.units.toString(),
        fclQ3: poData.fclQuarterly.q3.units.toString(),
        fclQ4: poData.fclQuarterly.q4.units.toString(),
        lclQ1: poData.lclQuarterly.q1.units.toString(),
        lclQ2: poData.lclQuarterly.q2.units.toString(),
        lclQ3: poData.lclQuarterly.q3.units.toString(),
        lclQ4: poData.lclQuarterly.q4.units.toString(),
      });
    }
  }, [poData, isSaving, poDirty]);

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

  const handleLogisticsFormChange = (field: string, value: string) => {
    setLogisticsDirty(true);
    setLogisticsForm(prev => ({ ...prev, [field]: value }));
  };

  const handleWarehouseFormChange = (field: string, value: string) => {
    setWarehouseDirty(true);
    setWarehouseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRealEstateFormChange = (field: string, value: string) => {
    setRealEstateDirty(true);
    setRealEstateForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContractFormChange = (field: string, value: string) => {
    setContractDirty(true);
    setContractForm(prev => ({ ...prev, [field]: value }));
  };

  const handleVasFormChange = (field: string, value: string) => {
    setVasDirty(true);
    setVasForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePoFormChange = (field: string, value: string) => {
    setPoDirty(true);
    setPoForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSales = async () => {
    console.log('[Admin] Button clicked! YTD Revenue:', salesForm.ytdRevenue);
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...salesForm };
    try {
      console.log('[Admin] Starting sales data save...');
      const updatedData = {
        ...salesDataSnapshot,
        totalRevenue: parseFloat(prevForm.totalRevenue),
        ytdRevenue: parseFloat(prevForm.ytdRevenue),
        mtdRevenue: parseFloat(prevForm.mtdRevenue),
        revenueTarget: parseFloat(prevForm.revenueTarget),
        growthPercentage: parseFloat(prevForm.growthPercentage),
      };
      console.log('[Admin] Updated data:', updatedData);
      console.log('[Admin] About to call updateSalesData with ytdRevenue:', updatedData.ytdRevenue);
      await updateSalesData(updatedData);
      console.log('[Admin] ✅ Sales data saved successfully to Supabase!');
      setSalesDirty(false);
      setSuccessMessage('✅ Sales data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('[Admin] ❌ Failed to save sales data:', error);
      console.error('[Admin] Error message:', error?.message);
      console.error('[Admin] Error details:', error?.details);
      console.error('[Admin] Error hint:', error?.hint);
      setSalesForm(prevForm);
      const errorMsg = error?.message || 'Unknown error occurred';
      setSuccessMessage(`❌ Error: ${errorMsg}`);
      setTimeout(() => setSuccessMessage(''), 5000);
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

  const handleSaveLogistics = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...logisticsForm };
    try {
      const updatedData = {
        ...logisticsDataSnapshot,
        onTimeDeliveryRate: parseFloat(prevForm.onTimeDeliveryRate),
        averageDeliveryTime: parseFloat(prevForm.averageDeliveryTime),
        activeShipments: parseInt(prevForm.activeShipments),
        delayedShipments: parseInt(prevForm.delayedShipments),
        trucks: parseInt(prevForm.trucks),
        drivers: parseInt(prevForm.drivers),
      };
      await updateLogisticsData(updatedData);
      setLogisticsDirty(false);
      setSuccessMessage('✅ Logistics data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setLogisticsForm(prevForm);
      Alert.alert('Error', 'Failed to update logistics data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWarehouse = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...warehouseForm };
    try {
      const updatedData = {
        ...warehouseDataSnapshot,
        currentOccupancy: parseFloat(prevForm.currentOccupancy),
        capacity: parseFloat(prevForm.capacity),
        occupancyPercentage: parseFloat(prevForm.occupancyPercentage),
        inboundShipments: parseInt(prevForm.inboundShipments),
        outboundShipments: parseInt(prevForm.outboundShipments),
        inventoryTurnover: parseFloat(prevForm.inventoryTurnover),
      };
      await updateWarehouseData(updatedData);
      setWarehouseDirty(false);
      setSuccessMessage('✅ Warehouse data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setWarehouseForm(prevForm);
      Alert.alert('Error', 'Failed to update warehouse data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRealEstate = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...realEstateForm };
    try {
      const updatedData = {
        ...realEstateDataSnapshot,
        jipTotalCapacity: parseFloat(prevForm.jipTotalCapacity),
        jipOccupiedLand: parseFloat(prevForm.jipOccupiedLand),
        jipOccupancyPercentage: parseFloat(prevForm.jipOccupancyPercentage),
        jipAverageRate: parseFloat(prevForm.jipAverageRate),
        parking: {
          ...realEstateDataSnapshot.parking,
          availableSpaces: parseInt(prevForm.parkingAvailableSpaces),
          rentedSpaces: parseInt(prevForm.parkingRentedSpaces),
        },
      };
      await updateRealEstateData(updatedData);
      setRealEstateDirty(false);
      setSuccessMessage('✅ Real Estate data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setRealEstateForm(prevForm);
      Alert.alert('Error', 'Failed to update real estate data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContracts = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...contractForm };
    try {
      const updatedData = {
        ...contractDataSnapshot,
        expiringThisMonth: parseInt(prevForm.expiringThisMonth),
        expiringThisQuarter: parseInt(prevForm.expiringThisQuarter),
        totalContracts: parseInt(prevForm.totalContracts),
      };
      await updateContractData(updatedData);
      setContractDirty(false);
      setSuccessMessage('✅ Contract data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setContractForm(prevForm);
      Alert.alert('Error', 'Failed to update contract data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVas = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...vasForm };
    try {
      const updatedData = {
        ...vasDataSnapshot,
        deliveryTotal: {
          ...vasDataSnapshot.deliveryTotal,
          current: parseFloat(prevForm.deliveryCurrent),
          previous: parseFloat(prevForm.deliveryPrevious),
        },
        labellingTotal: {
          ...vasDataSnapshot.labellingTotal,
          current: parseFloat(prevForm.labellingCurrent),
          previous: parseFloat(prevForm.labellingPrevious),
        },
      };
      await updateVasData(updatedData);
      setVasDirty(false);
      setSuccessMessage('✅ VAS data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setVasForm(prevForm);
      Alert.alert('Error', 'Failed to update VAS data. Changes have been reverted.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePo = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    const prevForm = { ...poForm };
    try {
      const updatedData = {
        ...poDataSnapshot,
        fclQuarterly: {
          q1: { ...poDataSnapshot.fclQuarterly.q1, units: parseInt(prevForm.fclQ1) },
          q2: { ...poDataSnapshot.fclQuarterly.q2, units: parseInt(prevForm.fclQ2) },
          q3: { ...poDataSnapshot.fclQuarterly.q3, units: parseInt(prevForm.fclQ3) },
          q4: { ...poDataSnapshot.fclQuarterly.q4, units: parseInt(prevForm.fclQ4) },
        },
        lclQuarterly: {
          q1: { ...poDataSnapshot.lclQuarterly.q1, units: parseInt(prevForm.lclQ1) },
          q2: { ...poDataSnapshot.lclQuarterly.q2, units: parseInt(prevForm.lclQ2) },
          q3: { ...poDataSnapshot.lclQuarterly.q3, units: parseInt(prevForm.lclQ3) },
          q4: { ...poDataSnapshot.lclQuarterly.q4, units: parseInt(prevForm.lclQ4) },
        },
      };
      await updatePoData(updatedData);
      setPoDirty(false);
      setSuccessMessage('✅ PO data updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setPoForm(prevForm);
      Alert.alert('Error', 'Failed to update PO data. Changes have been reverted.');
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
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
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'logistics' && styles.activeTab]}
          onPress={() => setActiveTab('logistics')}
        >
          <Text style={[styles.tabText, activeTab === 'logistics' && styles.activeTabText]}>Logistics</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'warehouse' && styles.activeTab]}
          onPress={() => setActiveTab('warehouse')}
        >
          <Text style={[styles.tabText, activeTab === 'warehouse' && styles.activeTabText]}>Warehouse</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'realEstate' && styles.activeTab]}
          onPress={() => setActiveTab('realEstate')}
        >
          <Text style={[styles.tabText, activeTab === 'realEstate' && styles.activeTabText]}>Real Estate</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'contracts' && styles.activeTab]}
          onPress={() => setActiveTab('contracts')}
        >
          <Text style={[styles.tabText, activeTab === 'contracts' && styles.activeTabText]}>Contracts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'vas' && styles.activeTab]}
          onPress={() => setActiveTab('vas')}
        >
          <Text style={[styles.tabText, activeTab === 'vas' && styles.activeTabText]}>VAS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'po' && styles.activeTab]}
          onPress={() => setActiveTab('po')}
        >
          <Text style={[styles.tabText, activeTab === 'po' && styles.activeTabText]}>PO</Text>
        </TouchableOpacity>
      </ScrollView>

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

        {activeTab === 'logistics' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Logistics Data</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>On-Time Delivery Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={logisticsForm.onTimeDeliveryRate}
                onChangeText={(text) => handleLogisticsFormChange('onTimeDeliveryRate', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Average Delivery Time (days)</Text>
              <TextInput
                style={styles.input}
                value={logisticsForm.averageDeliveryTime}
                onChangeText={(text) => handleLogisticsFormChange('averageDeliveryTime', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Active Shipments</Text>
              <TextInput
                style={styles.input}
                value={logisticsForm.activeShipments}
                onChangeText={(text) => handleLogisticsFormChange('activeShipments', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Delayed Shipments</Text>
              <TextInput
                style={styles.input}
                value={logisticsForm.delayedShipments}
                onChangeText={(text) => handleLogisticsFormChange('delayedShipments', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Trucks</Text>
              <TextInput
                style={styles.input}
                value={logisticsForm.trucks}
                onChangeText={(text) => handleLogisticsFormChange('trucks', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Drivers</Text>
              <TextInput
                style={styles.input}
                value={logisticsForm.drivers}
                onChangeText={(text) => handleLogisticsFormChange('drivers', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveLogistics}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Logistics Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'warehouse' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Warehouse Data</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Occupancy (sqm)</Text>
              <TextInput
                style={styles.input}
                value={warehouseForm.currentOccupancy}
                onChangeText={(text) => handleWarehouseFormChange('currentOccupancy', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Capacity (sqm)</Text>
              <TextInput
                style={styles.input}
                value={warehouseForm.capacity}
                onChangeText={(text) => handleWarehouseFormChange('capacity', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Occupancy Percentage (%)</Text>
              <TextInput
                style={styles.input}
                value={warehouseForm.occupancyPercentage}
                onChangeText={(text) => handleWarehouseFormChange('occupancyPercentage', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Inbound Shipments</Text>
              <TextInput
                style={styles.input}
                value={warehouseForm.inboundShipments}
                onChangeText={(text) => handleWarehouseFormChange('inboundShipments', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Outbound Shipments</Text>
              <TextInput
                style={styles.input}
                value={warehouseForm.outboundShipments}
                onChangeText={(text) => handleWarehouseFormChange('outboundShipments', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Inventory Turnover</Text>
              <TextInput
                style={styles.input}
                value={warehouseForm.inventoryTurnover}
                onChangeText={(text) => handleWarehouseFormChange('inventoryTurnover', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveWarehouse}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Warehouse Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'realEstate' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Real Estate Data</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>JIP Total Capacity (sqm)</Text>
              <TextInput
                style={styles.input}
                value={realEstateForm.jipTotalCapacity}
                onChangeText={(text) => handleRealEstateFormChange('jipTotalCapacity', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>JIP Occupied Land (sqm)</Text>
              <TextInput
                style={styles.input}
                value={realEstateForm.jipOccupiedLand}
                onChangeText={(text) => handleRealEstateFormChange('jipOccupiedLand', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>JIP Occupancy Percentage (%)</Text>
              <TextInput
                style={styles.input}
                value={realEstateForm.jipOccupancyPercentage}
                onChangeText={(text) => handleRealEstateFormChange('jipOccupancyPercentage', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>JIP Average Rate (SAR/sqm)</Text>
              <TextInput
                style={styles.input}
                value={realEstateForm.jipAverageRate}
                onChangeText={(text) => handleRealEstateFormChange('jipAverageRate', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.sectionSubtitle}>Parking</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Available Spaces</Text>
              <TextInput
                style={styles.input}
                value={realEstateForm.parkingAvailableSpaces}
                onChangeText={(text) => handleRealEstateFormChange('parkingAvailableSpaces', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rented Spaces</Text>
              <TextInput
                style={styles.input}
                value={realEstateForm.parkingRentedSpaces}
                onChangeText={(text) => handleRealEstateFormChange('parkingRentedSpaces', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveRealEstate}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Real Estate Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'contracts' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Contract Data</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiring This Month</Text>
              <TextInput
                style={styles.input}
                value={contractForm.expiringThisMonth}
                onChangeText={(text) => handleContractFormChange('expiringThisMonth', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expiring This Quarter</Text>
              <TextInput
                style={styles.input}
                value={contractForm.expiringThisQuarter}
                onChangeText={(text) => handleContractFormChange('expiringThisQuarter', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Contracts</Text>
              <TextInput
                style={styles.input}
                value={contractForm.totalContracts}
                onChangeText={(text) => handleContractFormChange('totalContracts', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveContracts}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Contract Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'vas' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>VAS (Value-Added Services)</Text>
            
            <Text style={styles.sectionSubtitle}>Delivery</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Year</Text>
              <TextInput
                style={styles.input}
                value={vasForm.deliveryCurrent}
                onChangeText={(text) => handleVasFormChange('deliveryCurrent', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Previous Year</Text>
              <TextInput
                style={styles.input}
                value={vasForm.deliveryPrevious}
                onChangeText={(text) => handleVasFormChange('deliveryPrevious', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.sectionSubtitle}>Labelling</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Year</Text>
              <TextInput
                style={styles.input}
                value={vasForm.labellingCurrent}
                onChangeText={(text) => handleVasFormChange('labellingCurrent', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Previous Year</Text>
              <TextInput
                style={styles.input}
                value={vasForm.labellingPrevious}
                onChangeText={(text) => handleVasFormChange('labellingPrevious', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSaveVas}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save VAS Data'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'po' && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Purchase Order Data</Text>
            
            <Text style={styles.sectionSubtitle}>FCL (Full Container Load) Quarterly</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q1 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.fclQ1}
                onChangeText={(text) => handlePoFormChange('fclQ1', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q2 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.fclQ2}
                onChangeText={(text) => handlePoFormChange('fclQ2', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q3 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.fclQ3}
                onChangeText={(text) => handlePoFormChange('fclQ3', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q4 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.fclQ4}
                onChangeText={(text) => handlePoFormChange('fclQ4', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.sectionSubtitle}>LCL (Less than Container Load) Quarterly</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q1 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.lclQ1}
                onChangeText={(text) => handlePoFormChange('lclQ1', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q2 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.lclQ2}
                onChangeText={(text) => handlePoFormChange('lclQ2', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q3 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.lclQ3}
                onChangeText={(text) => handlePoFormChange('lclQ3', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Q4 Units</Text>
              <TextInput
                style={styles.input}
                value={poForm.lclQ4}
                onChangeText={(text) => handlePoFormChange('lclQ4', text)}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSavePo}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save PO Data'}
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
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00617f',
    marginTop: 16,
    marginBottom: 12,
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
