import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, Alert } from 'react-native';
import { Truck, Clock, Package, Edit2, Plus, Users, TrendingUp, MapPin, Trash2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { KPICard } from '@/components/KPICard';
import { ChartCard } from '@/components/ChartCard';
import { GroupedBarChart } from '@/components/GroupedBarChart';
import { LineChart } from '@/components/LineChart';
import { SimplePieChart } from '@/components/SimplePieChart';
import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function LogisticsScreen() {
  const { isAdmin } = useAuth();
  const { logisticsData, updateLogisticsData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[]>([]);
  const [editModalTitle, setEditModalTitle] = useState<string>('');
  const [tripCategoryFilter, setTripCategoryFilter] = useState<'total' | string>('total');
  const [currentDeleteHandler, setCurrentDeleteHandler] = useState<(() => void) | null>(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleEdit = (field: string, currentValue: number, title?: string) => {
    setEditField(field);
    setEditValue(currentValue?.toString() || '0');
    setEditFields([]);
    setEditModalTitle(title || field);
    setCurrentDeleteHandler(null);
    setEditModalVisible(true);
  };

  const handleEditArray = (field: string, index: number) => {
    setEditField(`${field}_${index}`);
    
    if (field === 'deliveryPerformance') {
      const item = logisticsData.deliveryPerformance[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
        { label: 'Month', value: item.month, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'On-Time Rate (%)', value: item.onTimeRate.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
      ];
      setEditFields(tempFields);
      setEditModalTitle(`Edit ${item.month}`);
      setCurrentDeleteHandler(() => handleDeleteDeliveryPerformance(index));
    } else if (field === 'delaysByRoute') {
      const item = logisticsData.delaysByRoute[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
        { label: 'Route Name', value: item.route, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Delays', value: item.delays.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
        { label: 'Trips', value: item.trips.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
      ];
      setEditFields(tempFields);
      setEditModalTitle(`Edit ${item.route}`);
      setCurrentDeleteHandler(() => handleDeleteRoute(index));
    }
    
    setEditModalVisible(true);
  };

  const handleAddRoute = () => {
    setEditField('addRoute');
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Route Name', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Delays', value: '0', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Trips', value: '0', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalTitle('Add Route');
    setCurrentDeleteHandler(null);
    setEditModalVisible(true);
  };

  const handleEditTripCategory = (index: number, isMonthly: boolean, month?: string) => {
    if (isMonthly && month) {
      const item = logisticsData.tripCategoriesMonthly[month][index];
      setEditField(`tripCategoryMonthly_${month}_${index}`);
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
        { label: 'Category Name', value: item.name, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Value', value: item.value.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
      ];
      setEditFields(tempFields);
      setEditModalTitle(`Edit ${item.name} - ${month}`);
      setCurrentDeleteHandler(() => handleDeleteTripCategory(index, true, month));
    } else {
      const item = logisticsData.tripCategories[index];
      setEditField(`tripCategory_${index}`);
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
        { label: 'Category Name', value: item.name, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Value', value: item.value.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
      ];
      setEditFields(tempFields);
      setEditModalTitle(`Edit ${item.name}`);
      setCurrentDeleteHandler(() => handleDeleteTripCategory(index, false, undefined));
    }
    setEditModalVisible(true);
  };

  const handleAddTripCategory = () => {
    setEditField('addTripCategory');
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Category Name', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Value', value: '0', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalTitle('Add Trip Category');
    setCurrentDeleteHandler(null);
    setEditModalVisible(true);
  };

  const handleEditThresholds = () => {
    setEditField('thresholds');
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Green Threshold (%)', value: logisticsData.thresholds.green.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Yellow Threshold (%)', value: logisticsData.thresholds.yellow.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalTitle('Edit Thresholds');
    setCurrentDeleteHandler(null);
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (editFields.length > 0) {
      if (editField === 'addRoute') {
        const updatedData = { ...logisticsData };
        updatedData.delaysByRoute = [
          ...logisticsData.delaysByRoute,
          {
            route: editFields[0].value,
            delays: parseInt(editFields[1].value) || 0,
            trips: parseInt(editFields[2].value) || 0,
          },
        ];
        updateLogisticsData(updatedData);
      } else if (editField === 'addTripCategory') {
        const updatedData = { ...logisticsData };
        const newCategory = {
          name: editFields[0].value,
          value: parseInt(editFields[1].value) || 0,
        };
        updatedData.tripCategories = [...logisticsData.tripCategories, newCategory];
        Object.keys(updatedData.tripCategoriesMonthly).forEach(month => {
          updatedData.tripCategoriesMonthly[month] = [
            ...updatedData.tripCategoriesMonthly[month],
            { name: editFields[0].value, value: 0 },
          ];
        });
        updateLogisticsData(updatedData);
      } else if (editField === 'thresholds') {
        const updatedData = { ...logisticsData };
        updatedData.thresholds = {
          green: parseFloat(editFields[0].value) || 90,
          yellow: parseFloat(editFields[1].value) || 80,
        };
        updateLogisticsData(updatedData);
      } else {
        const parts = editField.split('_');
        const fieldName = parts[0];
        
        const updatedData = { ...logisticsData };
        
        if (fieldName === 'deliveryPerformance') {
          const index = parseInt(parts[1]);
          const newPerformance = [...logisticsData.deliveryPerformance];
          newPerformance[index] = {
            month: editFields[0].value,
            onTimeRate: parseFloat(editFields[1].value) || 0,
          };
          updatedData.deliveryPerformance = newPerformance;
        } else if (fieldName === 'delaysByRoute') {
          const index = parseInt(parts[1]);
          const newDelays = [...logisticsData.delaysByRoute];
          newDelays[index] = {
            route: editFields[0].value,
            delays: parseInt(editFields[1].value) || 0,
            trips: parseInt(editFields[2].value) || 0,
          };
          updatedData.delaysByRoute = newDelays;
        } else if (fieldName === 'tripCategory') {
          const index = parseInt(parts[1]);
          const newCategories = [...logisticsData.tripCategories];
          const oldName = newCategories[index].name;
          newCategories[index] = {
            name: editFields[0].value,
            value: parseInt(editFields[1].value) || 0,
          };
          updatedData.tripCategories = newCategories;
          Object.keys(updatedData.tripCategoriesMonthly).forEach(month => {
            const monthIndex = updatedData.tripCategoriesMonthly[month].findIndex(c => c.name === oldName);
            if (monthIndex !== -1) {
              updatedData.tripCategoriesMonthly[month][monthIndex].name = editFields[0].value;
            }
          });
        } else if (fieldName === 'tripCategoryMonthly') {
          const month = parts[1];
          const index = parseInt(parts[2]);
          const newMonthlyCategories = [...logisticsData.tripCategoriesMonthly[month]];
          newMonthlyCategories[index] = {
            name: editFields[0].value,
            value: parseInt(editFields[1].value) || 0,
          };
          updatedData.tripCategoriesMonthly[month] = newMonthlyCategories;
        }
        
        updateLogisticsData(updatedData);
      }
    } else {
      const numValue = parseFloat(editValue);
      if (isNaN(numValue)) return;

      const updatedData = { ...logisticsData };
      
      switch (editField) {
        case 'trucks':
          updatedData.trucks = Math.round(numValue);
          break;
        case 'drivers':
          updatedData.drivers = Math.round(numValue);
          break;
        case 'tripsInProgress':
          updatedData.tripsInProgress = Math.round(numValue);
          break;
        case 'tripsCompleted':
          updatedData.tripsCompleted = Math.round(numValue);
          break;
        case 'tripsPending':
          updatedData.tripsPending = Math.round(numValue);
          break;
        case 'tripsTransporters':
          updatedData.tripsTransporters = Math.round(numValue);
          break;
        case 'fleetUtilization':
          updatedData.fleetUtilization = Math.round(numValue);
          break;
      }

      updateLogisticsData(updatedData);
    }
    
    setEditModalVisible(false);
  };

  const handleDeleteTripCategory = (index: number, isMonthly: boolean, month?: string) => {
    if (isMonthly && month) {
      const item = logisticsData.tripCategoriesMonthly[month][index];
      Alert.alert(
        'Delete Trip Category',
        `Are you sure you want to delete "${item.name}" from ${month}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedData = { ...logisticsData };
              const newMonthlyCategories = [...logisticsData.tripCategoriesMonthly[month]];
              newMonthlyCategories.splice(index, 1);
              updatedData.tripCategoriesMonthly[month] = newMonthlyCategories;
              updateLogisticsData(updatedData);
              setEditModalVisible(false);
            },
          },
        ]
      );
    } else {
      const item = logisticsData.tripCategories[index];
      Alert.alert(
        'Delete Trip Category',
        `Are you sure you want to delete "${item.name}" from all months?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const updatedData = { ...logisticsData };
              const categoryName = logisticsData.tripCategories[index].name;
              const newCategories = [...logisticsData.tripCategories];
              newCategories.splice(index, 1);
              updatedData.tripCategories = newCategories;
              Object.keys(updatedData.tripCategoriesMonthly).forEach(monthKey => {
                updatedData.tripCategoriesMonthly[monthKey] = updatedData.tripCategoriesMonthly[monthKey].filter(
                  c => c.name !== categoryName
                );
              });
              updateLogisticsData(updatedData);
              setEditModalVisible(false);
            },
          },
        ]
      );
    }
  };

  const handleDeleteDeliveryPerformance = (index: number) => {
    const item = logisticsData.deliveryPerformance[index];
    Alert.alert(
      'Delete Delivery Performance Entry',
      `Are you sure you want to delete "${item.month}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedData = { ...logisticsData };
            const newPerformance = [...logisticsData.deliveryPerformance];
            newPerformance.splice(index, 1);
            updatedData.deliveryPerformance = newPerformance;
            updateLogisticsData(updatedData);
            setEditModalVisible(false);
          },
        },
      ]
    );
  };

  const handleDeleteRoute = (index: number) => {
    const item = logisticsData.delaysByRoute[index];
    Alert.alert(
      'Delete Route',
      `Are you sure you want to delete "${item.route}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedData = { ...logisticsData };
            const newRoutes = [...logisticsData.delaysByRoute];
            newRoutes.splice(index, 1);
            updatedData.delaysByRoute = newRoutes;
            updateLogisticsData(updatedData);
            setEditModalVisible(false);
          },
        },
      ]
    );
  };

  return (
    <>
      <EditModal
        visible={editModalVisible}
        title={editModalTitle}
        value={editValue}
        onChangeText={setEditValue}
        onSave={handleSave}
        onCancel={() => setEditModalVisible(false)}
        onDelete={currentDeleteHandler || undefined}
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
                title="Fleet Utilization"
                value={`${logisticsData.fleetUtilization}%`}
                subtitle="Efficiency Rate"
                icon={Truck}
                color={LogiPointColors.chart.green}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('fleetUtilization', logisticsData.fleetUtilization)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Trucks"
                value={logisticsData.trucks}
                subtitle="Total Fleet"
                icon={Truck}
                color={LogiPointColors.primary}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('trucks', logisticsData.trucks)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Drivers"
                value={logisticsData.drivers}
                subtitle="Total Drivers"
                icon={Users}
                color={LogiPointColors.chart.purple}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('drivers', logisticsData.drivers)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Trips in Progress"
                value={logisticsData.tripsInProgress}
                subtitle="Active"
                icon={TrendingUp}
                color={LogiPointColors.warning}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('tripsInProgress', logisticsData.tripsInProgress)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Trips Completed"
                value={logisticsData.tripsCompleted}
                subtitle="Total"
                icon={Package}
                color={LogiPointColors.success}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('tripsCompleted', logisticsData.tripsCompleted)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Trips Pending"
                value={logisticsData.tripsPending}
                subtitle="Awaiting"
                icon={Clock}
                color={LogiPointColors.accent}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('tripsPending', logisticsData.tripsPending)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.kpiSpacer} />
            <View>
              <KPICard
                title="Trips Transporters"
                value={logisticsData.tripsTransporters}
                subtitle="Partners"
                icon={Truck}
                color={LogiPointColors.chart.blue}
              />
              {isAdmin && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit('tripsTransporters', logisticsData.tripsTransporters)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>

          <ChartCard title="Trip Categories" subtitle="Distribution by location and status">
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                <TouchableOpacity
                  style={[styles.filterButton, tripCategoryFilter === 'total' && styles.filterButtonActive]}
                  onPress={() => setTripCategoryFilter('total')}
                >
                  <Text style={[styles.filterButtonText, tripCategoryFilter === 'total' && styles.filterButtonTextActive]}>Total</Text>
                </TouchableOpacity>
                {months.map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[styles.filterButton, tripCategoryFilter === month && styles.filterButtonActive]}
                    onPress={() => setTripCategoryFilter(month)}
                  >
                    <Text style={[styles.filterButtonText, tripCategoryFilter === month && styles.filterButtonTextActive]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.tripCategoriesGrid}>
              {(() => {
                let displayCategories;
                
                if (tripCategoryFilter === 'total') {
                  displayCategories = logisticsData.tripCategories.map((category) => {
                    let calculatedValue = 0;
                    months.forEach((month) => {
                      const monthlyCategory = logisticsData.tripCategoriesMonthly[month]?.find(
                        (c) => c.name === category.name
                      );
                      if (monthlyCategory) {
                        calculatedValue += monthlyCategory.value;
                      }
                    });
                    return { ...category, value: calculatedValue };
                  });
                } else {
                  const categories = logisticsData.tripCategoriesMonthly[tripCategoryFilter] || [];
                  displayCategories = categories.map((category, idx) => {
                    if (category.name === 'Total Trips') {
                      const otherCategories = categories.filter((c, i) => i !== idx && c.name !== 'Total Trips');
                      const calculatedTotal = otherCategories.reduce((sum, c) => sum + c.value, 0);
                      return { ...category, value: calculatedTotal };
                    }
                    return category;
                  });
                }
                
                return displayCategories.map((category, index) => (
                  <View key={index} style={styles.tripCategoryItem}>
                    <View style={styles.tripCategoryHeader}>
                      <MapPin size={20} color={LogiPointColors.primary} />
                      <Text style={styles.tripCategoryName}>{category.name}</Text>
                    </View>
                    <Text style={styles.tripCategoryValue}>{category.value.toLocaleString()}</Text>
                    {isAdmin && category.name !== 'Total Trips' && tripCategoryFilter === 'total' && (
                      <View style={styles.tripCategoryButtonGroup}>
                        <TouchableOpacity
                          style={styles.tripCategoryActionButton}
                          onPress={() => handleDeleteTripCategory(index, false, undefined)}
                        >
                          <Trash2 size={14} color={LogiPointColors.error} />
                        </TouchableOpacity>
                      </View>
                    )}
                    {isAdmin && category.name !== 'Total Trips' && tripCategoryFilter !== 'total' && (
                      <View style={styles.tripCategoryButtonGroup}>
                        <TouchableOpacity
                          style={styles.tripCategoryActionButton}
                          onPress={() => handleEditTripCategory(index, tripCategoryFilter !== 'total', tripCategoryFilter !== 'total' ? tripCategoryFilter : undefined)}
                        >
                          <Edit2 size={14} color={LogiPointColors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.tripCategoryActionButton}
                          onPress={() => handleDeleteTripCategory(index, tripCategoryFilter !== 'total', tripCategoryFilter !== 'total' ? tripCategoryFilter : undefined)}
                        >
                          <Trash2 size={14} color={LogiPointColors.error} />
                        </TouchableOpacity>
                      </View>
                    )}
                    {isAdmin && category.name === 'Total Trips' && tripCategoryFilter !== 'total' && (
                      <View style={styles.tripCategoryEditButton}>
                        <Text style={styles.autoCalculatedText}>Auto</Text>
                      </View>
                    )}
                  </View>
                ));
              })()}
            </View>
            {isAdmin && tripCategoryFilter !== 'total' && (
              <TouchableOpacity
                style={[styles.chartEditButton, styles.addButton, { marginTop: 16 }]}
                onPress={handleAddTripCategory}
              >
                <Plus size={14} color={LogiPointColors.white} />
                <Text style={styles.addButtonText}>Add Category</Text>
              </TouchableOpacity>
            )}
            <View style={styles.chartDivider} />
            <SimplePieChart
              data={(() => {
                let displayCategories;
                
                if (tripCategoryFilter === 'total') {
                  displayCategories = logisticsData.tripCategories.map((category) => {
                    let calculatedValue = 0;
                    months.forEach((month) => {
                      const monthlyCategory = logisticsData.tripCategoriesMonthly[month]?.find(
                        (c) => c.name === category.name
                      );
                      if (monthlyCategory) {
                        calculatedValue += monthlyCategory.value;
                      }
                    });
                    return { ...category, value: calculatedValue };
                  });
                } else {
                  const categories = logisticsData.tripCategoriesMonthly[tripCategoryFilter] || [];
                  displayCategories = categories.map((category, idx) => {
                    if (category.name === 'Total Trips') {
                      const otherCategories = categories.filter((c, i) => i !== idx && c.name !== 'Total Trips');
                      const calculatedTotal = otherCategories.reduce((sum, c) => sum + c.value, 0);
                      return { ...category, value: calculatedTotal };
                    }
                    return category;
                  });
                }
                
                return displayCategories.filter((category) => category.name !== 'Total Trips').map((category) => ({
                  label: category.name,
                  value: category.value,
                  color: category.name === 'Transit' ? LogiPointColors.chart.blue :
                         category.name === 'Inside Port' ? LogiPointColors.chart.green :
                         category.name === 'Jeddah' ? LogiPointColors.chart.purple :
                         category.name === 'Outside Jeddah' ? LogiPointColors.warning :
                         category.name === 'Outside KSA' ? LogiPointColors.error :
                         LogiPointColors.accent,
                }));
              })()}
              size={200}
            />
          </ChartCard>

          <ChartCard title="Delivery Performance Trend" subtitle="On-time delivery rate by month">
            <LineChart 
              data={logisticsData.deliveryPerformance.filter(d => d.onTimeRate > 0).map(d => ({
                label: d.month,
                value: d.onTimeRate,
                color: d.onTimeRate >= logisticsData.thresholds.green ? LogiPointColors.success : d.onTimeRate >= logisticsData.thresholds.yellow ? LogiPointColors.warning : LogiPointColors.error,
              }))}
              maxValue={100}
              thresholds={logisticsData.thresholds}
            />
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {logisticsData.deliveryPerformance.map((perf, index) => (
                  <View key={index} style={styles.chartButtonGroup}>
                    <TouchableOpacity
                      style={styles.chartEditButton}
                      onPress={() => handleEditArray('deliveryPerformance', index)}
                    >
                      <Edit2 size={14} color={LogiPointColors.primary} />
                      <Text style={styles.chartEditText}>Edit {perf.month}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.chartDeleteButton}
                      onPress={() => handleDeleteDeliveryPerformance(index)}
                    >
                      <Trash2 size={14} color={LogiPointColors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.chartEditButton, styles.thresholdButton]}
                  onPress={handleEditThresholds}
                >
                  <Edit2 size={14} color={LogiPointColors.chart.blue} />
                  <Text style={styles.thresholdButtonText}>Edit Thresholds</Text>
                </TouchableOpacity>
              </View>
            )}
          </ChartCard>

          <ChartCard title="Delays by Route" subtitle="Number of delayed shipments and total trips">
            <GroupedBarChart 
              data={logisticsData.delaysByRoute.map(d => ({
                label: d.route,
                values: [
                  {
                    label: 'Delays',
                    value: d.delays,
                    color: LogiPointColors.error,
                  },
                  {
                    label: 'Trips',
                    value: d.trips,
                    color: LogiPointColors.primary,
                  },
                ],
              }))}
            />
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {logisticsData.delaysByRoute.map((route, index) => (
                  <View key={index} style={styles.chartButtonGroup}>
                    <TouchableOpacity
                      style={styles.chartEditButton}
                      onPress={() => handleEditArray('delaysByRoute', index)}
                    >
                      <Edit2 size={14} color={LogiPointColors.primary} />
                      <Text style={styles.chartEditText}>Edit {route.route}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.chartDeleteButton}
                      onPress={() => handleDeleteRoute(index)}
                    >
                      <Trash2 size={14} color={LogiPointColors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.chartEditButton, styles.addButton]}
                  onPress={handleAddRoute}
                >
                  <Plus size={14} color={LogiPointColors.white} />
                  <Text style={styles.addButtonText}>Add Route</Text>
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
  kpiRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  kpiSpacer: {
    width: 12,
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
    borderColor: LogiPointColors.primary,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  thresholdButton: {
    backgroundColor: LogiPointColors.chart.blue,
    borderColor: LogiPointColors.chart.blue,
  },
  thresholdButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
  },
  filterButtonActive: {
    backgroundColor: LogiPointColors.primary,
    borderColor: LogiPointColors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[600],
  },
  filterButtonTextActive: {
    color: LogiPointColors.white,
  },
  tripCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tripCategoryItem: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
    minWidth: '47%',
    position: 'relative',
  },
  tripCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tripCategoryName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    flex: 1,
  },
  tripCategoryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  tripCategoryEditButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  tripCategoryButtonGroup: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
  },
  tripCategoryActionButton: {
    padding: 4,
  },
  autoCalculatedText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[500],
  },
  chartDivider: {
    height: 1,
    backgroundColor: LogiPointColors.gray[200],
    marginVertical: 24,
  },
  chartButtonGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  chartDeleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LogiPointColors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
