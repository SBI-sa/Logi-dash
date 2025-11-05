import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Warehouse as WarehouseIcon, Edit2, Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LogiPointColors } from '@/constants/colors';
import { KPICard } from '@/components/KPICard';
import { ChartCard } from '@/components/ChartCard';
import { ZonePieChart } from '@/components/ZonePieChart';
import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { uploadDashboardImage, supabase } from '@/supabaseClient';

export default function WarehouseScreen() {
  const insets = useSafeAreaInsets();
  const { isAdmin } = useAuth();
  const { warehouseData, updateWarehouseData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[]>([]);

  const screenOptions = useMemo(() => ({
    title: 'Warehouse Management',
    headerStyle: {
      backgroundColor: LogiPointColors.midnight,
    },
    headerTintColor: LogiPointColors.white,
    headerTitleStyle: {
      fontWeight: '700' as const,
    },
  }), []);

  const handleEdit = (field: string, currentValue: number) => {
    setEditField(field);
    setEditValue(currentValue.toString());
    setEditFields([]);
    setEditModalVisible(true);
  };

  const handleEditArray = (field: string, index: number) => {
    setEditField(`${field}_${index}`);
    
    if (field === 'occupancyByZone') {
      const item = warehouseData.occupancyByZone[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
        { label: 'Zone Name', value: item.zone, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Occupied', value: item.occupancy.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
        { label: 'Total Capacity', value: item.capacity.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
        { label: 'Color', value: item.color || '#00617f', onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Current Empty WH', value: (item.emptyWH || 0).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 4 ? { ...f, value: text } : f));
        }, keyboardType: 'numeric' },
        { label: 'WH Name', value: item.whName || '', onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 5 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Each WH Sqm', value: (item.sqmPerWH || Math.round(item.capacity / 10)).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 6 ? { ...f, value: text } : f));
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
      
      const updatedData = { ...warehouseData };
      
      if (fieldName === 'occupancyByZone') {
        const newZones = [...warehouseData.occupancyByZone];
        newZones[index] = {
          zone: editFields[0].value,
          occupancy: parseInt(editFields[1].value) || 0,
          capacity: parseInt(editFields[2].value) || 1,
          color: editFields[3].value || '#00617f',
          emptyWH: parseInt(editFields[4].value) || 0,
          whName: editFields[5].value || '',
          sqmPerWH: parseInt(editFields[6].value) || undefined,
        };
        updatedData.occupancyByZone = newZones;
      }
      
      updateWarehouseData(updatedData);
    } else {
      const numValue = parseFloat(editValue);
      if (isNaN(numValue)) return;

      const updatedData = { ...warehouseData };
      
      switch (editField) {
        case 'currentOccupancy':
          updatedData.currentOccupancy = Math.round(numValue);
          updatedData.occupancyPercentage = Math.round((updatedData.currentOccupancy / updatedData.capacity) * 100);
          break;
        case 'capacity':
          updatedData.capacity = Math.round(numValue);
          updatedData.occupancyPercentage = Math.round((updatedData.currentOccupancy / updatedData.capacity) * 100);
          break;
      }

      updateWarehouseData(updatedData);
    }
    
    setEditModalVisible(false);
  };

  const handleUploadImage = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          if (file) {
            const uploadResult = await uploadDashboardImage(file, "warehouse", "allocation.jpg");
            
            if (uploadResult.success) {
              const { data } = supabase.storage.from("dashboard-images").getPublicUrl(uploadResult.filePath);
              const updatedData = { ...warehouseData, allocationImageUri: data.publicUrl };
              updateWarehouseData(updatedData);
              Alert.alert('Success', 'Image uploaded successfully to Supabase Storage!');
            } else {
              Alert.alert('Upload Failed', 'Failed to upload image to Supabase Storage');
            }
          }
        };
        input.click();
        return;
      }

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], "allocation.jpg", { type: blob.type });
        
        const uploadResult = await uploadDashboardImage(file, "warehouse", "allocation.jpg");
        
        if (uploadResult.success) {
          const { data } = supabase.storage.from("dashboard-images").getPublicUrl(uploadResult.filePath);
          const updatedData = { ...warehouseData, allocationImageUri: data.publicUrl };
          updateWarehouseData(updatedData);
          Alert.alert('Success', 'Image uploaded successfully to Supabase Storage!');
        } else {
          Alert.alert('Upload Failed', 'Failed to upload image to Supabase Storage');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleRemoveImage = () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove the warehouse allocation image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedData = { ...warehouseData, allocationImageUri: undefined };
            updateWarehouseData(updatedData);
          },
        },
      ]
    );
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
      
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.backgroundLogo}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4i9f5ip8s1j9hyoj71h9q' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View>
            <KPICard
              title="Total Occupancy"
              value={`${warehouseData.occupancyPercentage}%`}
              subtitle={`${warehouseData.currentOccupancy.toLocaleString()} / ${warehouseData.capacity.toLocaleString()}`}
              icon={WarehouseIcon}
              color={warehouseData.occupancyPercentage >= 90 ? LogiPointColors.error : warehouseData.occupancyPercentage >= 75 ? LogiPointColors.warning : LogiPointColors.primary}
            />
            {isAdmin && (
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.editButton, styles.editButtonTop]}
                  onPress={() => handleEdit('currentOccupancy', warehouseData.currentOccupancy)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, styles.editButtonBottom]}
                  onPress={() => handleEdit('capacity', warehouseData.capacity)}
                >
                  <Edit2 size={16} color={LogiPointColors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ChartCard title="Occupancy by Zone" subtitle="Current utilization and remaining space">
            {warehouseData.occupancyByZone.map((zone, index) => (
              <View key={index} style={styles.zoneContainer}>
                <ZonePieChart
                  zone={zone.zone}
                  occupied={zone.occupancy}
                  capacity={zone.capacity}
                  color={zone.color || '#00617f'}
                  emptyWH={zone.emptyWH}
                  whName={zone.whName}
                  sqmPerWH={zone.sqmPerWH}
                />
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.zoneEditButton}
                    onPress={() => handleEditArray('occupancyByZone', index)}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.chartEditText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ChartCard>

          <ChartCard title="Warehouse Allocations" subtitle="Latest warehouse allocation map">
            {warehouseData.allocationImageUri ? (
              <View style={styles.allocationImageContainer}>
                <Image
                  source={{ uri: warehouseData.allocationImageUri }}
                  style={styles.allocationImage}
                  resizeMode="contain"
                />
                {isAdmin && (
                  <View style={styles.imageActions}>
                    <TouchableOpacity
                      style={styles.imageActionButton}
                      onPress={handleUploadImage}
                    >
                      <Upload size={16} color={LogiPointColors.white} />
                      <Text style={styles.imageActionText}>Replace</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.imageActionButton, styles.removeButton]}
                      onPress={handleRemoveImage}
                    >
                      <X size={16} color={LogiPointColors.white} />
                      <Text style={styles.imageActionText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.emptyImageContainer}>
                <Upload size={48} color={LogiPointColors.gray[400]} />
                <Text style={styles.emptyImageText}>No allocation image uploaded</Text>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUploadImage}
                  >
                    <Upload size={20} color={LogiPointColors.white} />
                    <Text style={styles.uploadButtonText}>Upload Image</Text>
                  </TouchableOpacity>
                )}
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

  zoneContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  zoneEditButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
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
    color: LogiPointColors.primary,
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: LogiPointColors.gray[600],
    textAlign: 'center',
  },
  editButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    gap: 4,
  },
  editButton: {
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
  editButtonTop: {
    // No additional styles needed
  },
  editButtonBottom: {
    // No additional styles needed
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
  allocationImageContainer: {
    width: '100%',
    minHeight: 300,
  },
  allocationImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  imageActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: LogiPointColors.primary,
    borderRadius: 8,
  },
  removeButton: {
    backgroundColor: LogiPointColors.error,
  },
  imageActionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  emptyImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyImageText: {
    fontSize: 16,
    color: LogiPointColors.gray[600],
    marginTop: 12,
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: LogiPointColors.primary,
    borderRadius: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
});