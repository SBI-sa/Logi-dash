import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, Modal, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { Building2, TrendingUp, MapPin, Edit2, Plus, Calendar, Car, Upload, X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { LogiPointColors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function RealEstateScreen() {
  const { isAdmin } = useAuth();
  const { realEstateData, updateRealEstateData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric'; type?: 'text' | 'dropdown'; options?: string[] }[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newImageLabel, setNewImageLabel] = useState('');
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [fullscreenImageUri, setFullscreenImageUri] = useState<string | null>(null);

  const screenOptions = useMemo(() => ({
    title: 'Real Estate',
    headerStyle: {
      backgroundColor: LogiPointColors.midnight,
    },
    headerTintColor: LogiPointColors.white,
    headerTitleStyle: {
      fontWeight: '700' as const,
    },
  }), []);

  const handleEdit = (field: string, currentValue: number | string) => {
    setEditField(field);
    setEditValue(currentValue.toString());
    setEditFields([]);
    setIsAddingNew(false);
    setEditModalVisible(true);
  };

  const handleEditLand = (index: number) => {
    setIsAddingNew(false);
    setEditField(`land_${index}`);
    const land = realEstateData.lands[index];
    
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric'; type?: 'text' | 'dropdown'; options?: string[] }[] = [
      { label: 'Client Name', value: land.clientName, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Current Rate (SAR/sqm)', value: land.currentRate.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Next Escalation Date (YYYY-MM-DD)', value: land.nextEscalationDate, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Escalation Percentage (%)', value: land.escalationPercentage.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Land Size (sqm)', value: land.landSize.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 4 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Contract End Year', value: land.contractEndYear.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 5 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Average Rate (SAR/sqm)', value: land.averageRate.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 6 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Bonded Status (Bonded/Non-Bonded)', value: land.bonded || 'Non-Bonded', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 7 ? { ...f, value: text } : f));
      }, keyboardType: 'default', type: 'dropdown', options: ['Bonded', 'Non-Bonded'] },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleAddNewLand = () => {
    setIsAddingNew(true);
    setEditField('new_land');
    
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric'; type?: 'text' | 'dropdown'; options?: string[] }[] = [
      { label: 'Land ID', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Client Name', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Current Rate (SAR/sqm)', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Next Escalation Date (YYYY-MM-DD)', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Escalation Percentage (%)', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 4 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Land Size (sqm)', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 5 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Contract End Year', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 6 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Average Rate (SAR/sqm)', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 7 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: 'Bonded Status (Bonded/Non-Bonded)', value: 'Non-Bonded', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 8 ? { ...f, value: text } : f));
      }, keyboardType: 'default', type: 'dropdown', options: ['Bonded', 'Non-Bonded'] },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (editFields.length > 0) {
      const [fieldName, indexStr] = editField.split('_');
      
      const updatedData = { ...realEstateData };
      
      if (isAddingNew && fieldName === 'new') {
        const bondedValue = editFields[8].value as 'Bonded' | 'Non-Bonded';
        const newLand = {
          id: editFields[0].value || `L${String(realEstateData.lands.length + 1).padStart(3, '0')}`,
          clientName: editFields[1].value,
          currentRate: parseFloat(editFields[2].value) || 0,
          nextEscalationDate: editFields[3].value,
          escalationPercentage: parseFloat(editFields[4].value) || 0,
          landSize: parseFloat(editFields[5].value) || 0,
          contractEndYear: parseInt(editFields[6].value) || new Date().getFullYear(),
          averageRate: parseFloat(editFields[7].value) || 0,
          bonded: bondedValue,
        };
        
        const newLands = [...realEstateData.lands, newLand];
        updatedData.lands = newLands;
        
        const totalOccupied = newLands.reduce((sum, l) => sum + l.landSize, 0);
        updatedData.jipOccupiedLand = totalOccupied;
        updatedData.jipOccupancyPercentage = Math.round((totalOccupied / updatedData.jipTotalCapacity) * 100);
        
        const avgRate = newLands.reduce((sum, l) => sum + l.averageRate, 0) / newLands.length;
        updatedData.jipAverageRate = Math.round(avgRate);
      } else if (fieldName === 'land') {
        const index = parseInt(indexStr);
        const newLands = [...realEstateData.lands];
        
        const bondedValue = editFields[7].value as 'Bonded' | 'Non-Bonded';
        newLands[index] = {
          ...newLands[index],
          clientName: editFields[0].value,
          currentRate: parseFloat(editFields[1].value) || 0,
          nextEscalationDate: editFields[2].value,
          escalationPercentage: parseFloat(editFields[3].value) || 0,
          landSize: parseFloat(editFields[4].value) || 0,
          contractEndYear: parseInt(editFields[5].value) || new Date().getFullYear(),
          averageRate: parseFloat(editFields[6].value) || 0,
          bonded: bondedValue,
        };
        updatedData.lands = newLands;
        
        const totalOccupied = newLands.reduce((sum, l) => sum + l.landSize, 0);
        updatedData.jipOccupiedLand = totalOccupied;
        updatedData.jipOccupancyPercentage = Math.round((totalOccupied / updatedData.jipTotalCapacity) * 100);
        
        const avgRate = newLands.reduce((sum, l) => sum + l.averageRate, 0) / newLands.length;
        updatedData.jipAverageRate = Math.round(avgRate);
      }
      
      updateRealEstateData(updatedData);
    } else {
      const numValue = parseFloat(editValue);
      if (isNaN(numValue)) return;

      const updatedData = { ...realEstateData };
      
      switch (editField) {
        case 'jipTotalCapacity':
          updatedData.jipTotalCapacity = Math.round(numValue);
          updatedData.jipOccupancyPercentage = Math.round((updatedData.jipOccupiedLand / numValue) * 100);
          break;
        case 'jipOccupiedLand':
          updatedData.jipOccupiedLand = Math.round(numValue);
          updatedData.jipOccupancyPercentage = Math.round((numValue / updatedData.jipTotalCapacity) * 100);
          break;
        case 'jipAverageRate':
          updatedData.jipAverageRate = Math.round(numValue);
          break;
        case 'parkingAvailableSpaces':
          if (!updatedData.parking) {
            updatedData.parking = {
              availableSpaces: 0,
              rentedSpaces: 0,
              occupancyRate: 0,
              averageRate: 0,
              lastRate: 0,
              nextEndingContract: '',
              nextEndingContractSpaces: 0,
            };
          }
          updatedData.parking.availableSpaces = Math.round(numValue);
          const totalSpaces = updatedData.parking.availableSpaces + updatedData.parking.rentedSpaces;
          updatedData.parking.occupancyRate = Math.round((updatedData.parking.rentedSpaces / totalSpaces) * 100);
          break;
        case 'parkingRentedSpaces':
          if (!updatedData.parking) {
            updatedData.parking = {
              availableSpaces: 0,
              rentedSpaces: 0,
              occupancyRate: 0,
              averageRate: 0,
              lastRate: 0,
              nextEndingContract: '',
              nextEndingContractSpaces: 0,
            };
          }
          updatedData.parking.rentedSpaces = Math.round(numValue);
          const totalSpaces2 = updatedData.parking.availableSpaces + updatedData.parking.rentedSpaces;
          updatedData.parking.occupancyRate = Math.round((updatedData.parking.rentedSpaces / totalSpaces2) * 100);
          break;
        case 'parkingAverageRate':
          if (!updatedData.parking) {
            updatedData.parking = {
              availableSpaces: 0,
              rentedSpaces: 0,
              occupancyRate: 0,
              averageRate: 0,
              lastRate: 0,
              nextEndingContract: '',
              nextEndingContractSpaces: 0,
            };
          }
          updatedData.parking.averageRate = Math.round(numValue);
          break;
        case 'parkingLastRate':
          if (!updatedData.parking) {
            updatedData.parking = {
              availableSpaces: 0,
              rentedSpaces: 0,
              occupancyRate: 0,
              averageRate: 0,
              lastRate: 0,
              nextEndingContract: '',
              nextEndingContractSpaces: 0,
            };
          }
          updatedData.parking.lastRate = Math.round(numValue);
          break;
        case 'parkingNextEndingContractSpaces':
          if (!updatedData.parking) {
            updatedData.parking = {
              availableSpaces: 0,
              rentedSpaces: 0,
              occupancyRate: 0,
              averageRate: 0,
              lastRate: 0,
              nextEndingContract: '',
              nextEndingContractSpaces: 0,
            };
          }
          updatedData.parking.nextEndingContractSpaces = Math.round(numValue);
          break;
        case 'parkingNextEndingContract':
          if (!updatedData.parking) {
            updatedData.parking = {
              availableSpaces: 0,
              rentedSpaces: 0,
              occupancyRate: 0,
              averageRate: 0,
              lastRate: 0,
              nextEndingContract: '',
              nextEndingContractSpaces: 0,
            };
          }
          updatedData.parking.nextEndingContract = editValue;
          break;
      }

      updateRealEstateData(updatedData);
    }
    
    setEditModalVisible(false);
  };

  const compressImage = async (uri: string): Promise<string> => {
    if (Platform.OS === 'web') {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 600;
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Failed to create blob'));
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            }, 'image/jpeg', 0.15);
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(blob);
        });
      } catch (webError) {
        console.error('Web image compression error:', webError);
        return uri;
      }
    }

    try {
      const manipResult = await manipulateAsync(
        uri,
        [{ resize: { width: 600 } }],
        { compress: 0.15, format: SaveFormat.JPEG }
      );

      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri;
    }
  };

  const handleUploadLandImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.2,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          console.log('Compressing land image...');
          const compressedUri = await compressImage(result.assets[0].uri);
          console.log('Land image compressed, URI length:', compressedUri.length);
          const updatedData = { ...realEstateData, landImageUri: compressedUri };
          await updateRealEstateData(updatedData);
          console.log('Land image saved successfully');
        } catch (storageError: any) {
          console.error('Storage error:', storageError);
          if (storageError?.message?.includes('quota') || storageError?.message?.includes('Storage quota exceeded')) {
            Alert.alert(
              'Storage Full',
              'The image is too large to save. Please try a smaller image or remove some existing images first.',
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert('Error', 'Failed to save image');
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleUploadJLHImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.2,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          console.log('Compressing JLH image...');
          const compressedUri = await compressImage(result.assets[0].uri);
          console.log('JLH image compressed, URI length:', compressedUri.length);
          const updatedData = { ...realEstateData, jlhImageUri: compressedUri };
          await updateRealEstateData(updatedData);
          console.log('JLH image saved successfully');
        } catch (storageError: any) {
          console.error('Storage error:', storageError);
          if (storageError?.message?.includes('quota') || storageError?.message?.includes('Storage quota exceeded')) {
            Alert.alert(
              'Storage Full',
              'The image is too large to save. Please try a smaller image or remove some existing images first.',
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert('Error', 'Failed to save image');
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleAddAdditionalImage = async () => {
    if (!newImageLabel.trim()) {
      Alert.alert('Label Required', 'Please enter a label for the image');
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.2,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          console.log('Compressing additional image...');
          const compressedUri = await compressImage(result.assets[0].uri);
          console.log('Additional image compressed, URI length:', compressedUri.length);
          const newImage = {
            id: `IMG${Date.now()}`,
            uri: compressedUri,
            label: newImageLabel,
          };
          const updatedData = {
            ...realEstateData,
            additionalImages: [...(realEstateData.additionalImages || []), newImage],
          };
          await updateRealEstateData(updatedData);
          console.log('Additional image saved successfully');
          setNewImageLabel('');
          setShowAddImageModal(false);
        } catch (storageError: any) {
          console.error('Storage error:', storageError);
          if (storageError?.message?.includes('quota') || storageError?.message?.includes('Storage quota exceeded')) {
            Alert.alert(
              'Storage Full',
              'The image is too large to save. Please try a smaller image or remove some existing images first.',
              [{ text: 'OK' }]
            );
          } else {
            Alert.alert('Error', 'Failed to save image');
          }
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const handleRemoveLandImage = async () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove the land image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedData = { ...realEstateData };
              delete updatedData.landImageUri;
              await updateRealEstateData(updatedData);
              console.log('Land image removed successfully');
            } catch (error) {
              console.error('Error removing land image:', error);
              Alert.alert('Error', 'Failed to remove image');
            }
          },
        },
      ]
    );
  };

  const handleRemoveJLHImage = async () => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove the JLH image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedData = { ...realEstateData };
              delete updatedData.jlhImageUri;
              await updateRealEstateData(updatedData);
              console.log('JLH image removed successfully');
            } catch (error) {
              console.error('Error removing JLH image:', error);
              Alert.alert('Error', 'Failed to remove image');
            }
          },
        },
      ]
    );
  };

  const handleRemoveAdditionalImage = (imageId: string) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedData = {
                ...realEstateData,
                additionalImages: (realEstateData.additionalImages || []).filter(img => img.id !== imageId),
              };
              await updateRealEstateData(updatedData);
              console.log('Additional image removed successfully');
            } catch (error) {
              console.error('Error removing additional image:', error);
              Alert.alert('Error', 'Failed to remove image');
            }
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
      
      <View style={styles.container}>
        <View style={styles.backgroundLogo}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/4i9f5ip8s1j9hyoj71h9q' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>JLH Parking</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Car size={24} color={LogiPointColors.primary} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}># of Available Parking Spaces</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.availableSpaces ?? 0}</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('parkingAvailableSpaces', realEstateData.parking?.availableSpaces ?? 0)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Car size={24} color={LogiPointColors.success} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}># of Rented Spaces</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.rentedSpaces ?? 0}</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('parkingRentedSpaces', realEstateData.parking?.rentedSpaces ?? 0)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <TrendingUp size={24} color={LogiPointColors.warning} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Occupancy Rate %</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.occupancyRate ?? 0}%</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <TrendingUp size={24} color={LogiPointColors.midnight} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Average Rate</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.averageRate ?? 0} SAR</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('parkingAverageRate', realEstateData.parking?.averageRate ?? 0)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <TrendingUp size={24} color={LogiPointColors.error} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Last Rate</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.lastRate ?? 0} SAR</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('parkingLastRate', realEstateData.parking?.lastRate ?? 0)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Calendar size={24} color={LogiPointColors.primary} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Next Ending Contract</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.nextEndingContract ?? 'N/A'}</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('parkingNextEndingContract', realEstateData.parking?.nextEndingContract ?? '')}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Car size={24} color={LogiPointColors.warning} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}># of Spaces (Next Ending)</Text>
                  <Text style={styles.summaryValue}>{realEstateData.parking?.nextEndingContractSpaces ?? 0}</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('parkingNextEndingContractSpaces', realEstateData.parking?.nextEndingContractSpaces ?? 0)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Card>

          <Card style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>JIP Land Overview</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <MapPin size={24} color={LogiPointColors.primary} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Total Capacity</Text>
                  <Text style={styles.summaryValue}>{realEstateData.jipTotalCapacity.toLocaleString()} sqm</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('jipTotalCapacity', realEstateData.jipTotalCapacity)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Building2 size={24} color={LogiPointColors.success} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Occupied Land</Text>
                  <Text style={styles.summaryValue}>{realEstateData.jipOccupiedLand.toLocaleString()} sqm</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('jipOccupiedLand', realEstateData.jipOccupiedLand)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <TrendingUp size={24} color={LogiPointColors.warning} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Occupancy Rate</Text>
                  <Text style={styles.summaryValue}>{realEstateData.jipOccupancyPercentage}%</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <TrendingUp size={24} color={LogiPointColors.midnight} />
                </View>
                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>Average Rate</Text>
                  <Text style={styles.summaryValue}>{realEstateData.jipAverageRate} SAR/sqm</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.inlineEditButton}
                      onPress={() => handleEdit('jipAverageRate', realEstateData.jipAverageRate)}
                    >
                      <Edit2 size={12} color={LogiPointColors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </Card>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Land Rentals</Text>
              {isAdmin && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddNewLand}
                >
                  <Plus size={20} color={LogiPointColors.white} />
                  <Text style={styles.addButtonText}>Add Land</Text>
                </TouchableOpacity>
              )}
            </View>
            {realEstateData.lands.map((land, index) => (
              <Card key={land.id} style={styles.landCard}>
                <View style={styles.landHeader}>
                  <View style={styles.landInfo}>
                    <Text style={styles.landClient}>{land.clientName}</Text>
                    <Text style={styles.landId}>ID: {land.id}</Text>
                  </View>
                  <View style={styles.landSizeBadge}>
                    <MapPin size={14} color={LogiPointColors.white} />
                    <Text style={styles.landSizeText}>{land.landSize.toLocaleString()} sqm</Text>
                  </View>
                </View>

                <View style={styles.landDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Current Rate</Text>
                    <Text style={styles.detailValue}>{land.currentRate} SAR/sqm</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Average Rate</Text>
                    <Text style={styles.detailValue}>{land.averageRate} SAR/sqm</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Next Escalation</Text>
                    <View style={styles.escalationInfo}>
                      <Calendar size={14} color={LogiPointColors.gray[600]} />
                      <Text style={styles.detailValue}>{land.nextEscalationDate}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Escalation Rate</Text>
                    <Text style={[styles.detailValue, { color: LogiPointColors.success }]}>
                      +{land.escalationPercentage}%
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contract End Year</Text>
                    <Text style={styles.detailValue}>{land.contractEndYear}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bonded Status</Text>
                    <View style={[
                      styles.bondedBadge,
                      land.bonded === 'Bonded' ? styles.bondedBadgeActive : styles.bondedBadgeInactive
                    ]}>
                      <Text style={[
                        styles.bondedBadgeText,
                        land.bonded === 'Bonded' ? styles.bondedBadgeTextActive : styles.bondedBadgeTextInactive
                      ]}>
                        {land.bonded || 'Non-Bonded'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {isAdmin && (
                  <TouchableOpacity
                    style={[styles.editButton, { top: 12, right: 12 }]}
                    onPress={() => handleEditLand(index)}
                  >
                    <Edit2 size={16} color={LogiPointColors.white} />
                  </TouchableOpacity>
                )}
              </Card>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Images</Text>
            
            <Card style={styles.imageCard}>
              <Text style={styles.imageCardTitle}>Land Image</Text>
              {realEstateData.landImageUri ? (
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => setFullscreenImageUri(realEstateData.landImageUri!)}>
                    <Image
                      source={{ uri: realEstateData.landImageUri }}
                      style={styles.propertyImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {isAdmin && (
                    <View style={styles.imageActions}>
                      <TouchableOpacity
                        style={styles.imageActionButton}
                        onPress={handleUploadLandImage}
                      >
                        <Upload size={16} color={LogiPointColors.white} />
                        <Text style={styles.imageActionText}>Replace</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.imageActionButton, styles.removeButton]}
                        onPress={handleRemoveLandImage}
                      >
                        <X size={16} color={LogiPointColors.white} />
                        <Text style={styles.imageActionText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.emptyImageContainer}>
                  <ImageIcon size={48} color={LogiPointColors.gray[400]} />
                  <Text style={styles.emptyImageText}>No land image uploaded</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleUploadLandImage}
                    >
                      <Upload size={20} color={LogiPointColors.white} />
                      <Text style={styles.uploadButtonText}>Upload Image</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Card>

            <Card style={styles.imageCard}>
              <Text style={styles.imageCardTitle}>JLH Image</Text>
              {realEstateData.jlhImageUri ? (
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={() => setFullscreenImageUri(realEstateData.jlhImageUri!)}>
                    <Image
                      source={{ uri: realEstateData.jlhImageUri }}
                      style={styles.propertyImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {isAdmin && (
                    <View style={styles.imageActions}>
                      <TouchableOpacity
                        style={styles.imageActionButton}
                        onPress={handleUploadJLHImage}
                      >
                        <Upload size={16} color={LogiPointColors.white} />
                        <Text style={styles.imageActionText}>Replace</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.imageActionButton, styles.removeButton]}
                        onPress={handleRemoveJLHImage}
                      >
                        <X size={16} color={LogiPointColors.white} />
                        <Text style={styles.imageActionText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.emptyImageContainer}>
                  <ImageIcon size={48} color={LogiPointColors.gray[400]} />
                  <Text style={styles.emptyImageText}>No JLH image uploaded</Text>
                  {isAdmin && (
                    <TouchableOpacity
                      style={styles.uploadButton}
                      onPress={handleUploadJLHImage}
                    >
                      <Upload size={20} color={LogiPointColors.white} />
                      <Text style={styles.uploadButtonText}>Upload Image</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Card>

            <Card style={styles.imageCard}>
              <View style={styles.additionalImagesHeader}>
                <Text style={styles.imageCardTitle}>Additional Images</Text>
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={() => setShowAddImageModal(true)}
                  >
                    <Plus size={18} color={LogiPointColors.white} />
                    <Text style={styles.addImageButtonText}>Add Image</Text>
                  </TouchableOpacity>
                )}
              </View>
              {realEstateData.additionalImages && realEstateData.additionalImages.length > 0 ? (
                <View style={styles.additionalImagesGrid}>
                  {realEstateData.additionalImages.map((img) => (
                    <View key={img.id} style={styles.additionalImageItem}>
                      <Text style={styles.additionalImageLabel}>{img.label}</Text>
                      <TouchableOpacity onPress={() => setFullscreenImageUri(img.uri)}>
                        <Image
                          source={{ uri: img.uri }}
                          style={styles.additionalImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      {isAdmin && (
                        <TouchableOpacity
                          style={styles.removeAdditionalImageButton}
                          onPress={() => handleRemoveAdditionalImage(img.id)}
                        >
                          <X size={16} color={LogiPointColors.white} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyImageContainer}>
                  <ImageIcon size={48} color={LogiPointColors.gray[400]} />
                  <Text style={styles.emptyImageText}>No additional images</Text>
                </View>
              )}
            </Card>
          </View>
        </ScrollView>

        {showAddImageModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Image</Text>
              <Text style={styles.modalLabel}>Image Label</Text>
              <TextInput
                style={styles.modalInput}
                value={newImageLabel}
                onChangeText={setNewImageLabel}
                placeholder="Enter image label"
                placeholderTextColor={LogiPointColors.gray[400]}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => {
                    setShowAddImageModal(false);
                    setNewImageLabel('');
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleAddAdditionalImage}
                >
                  <Text style={styles.modalSaveButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <Modal
          visible={fullscreenImageUri !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFullscreenImageUri(null)}
        >
          <View style={styles.fullscreenModalOverlay}>
            <TouchableOpacity 
              style={styles.fullscreenCloseButton}
              onPress={() => setFullscreenImageUri(null)}
            >
              <X size={28} color={LogiPointColors.white} />
            </TouchableOpacity>
            {fullscreenImageUri && (
              <Image
                source={{ uri: fullscreenImageUri }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
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
  summaryCard: {
    marginBottom: 16,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 20,
  },
  summaryGrid: {
    gap: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: LogiPointColors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: LogiPointColors.gray[600],
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  inlineEditButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: LogiPointColors.gray[100],
  },
  section: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LogiPointColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  landCard: {
    marginBottom: 12,
    padding: 16,
  },
  landHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  landInfo: {
    flex: 1,
  },
  landClient: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 4,
  },
  landId: {
    fontSize: 13,
    color: LogiPointColors.gray[600],
  },
  landSizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: LogiPointColors.primary,
  },
  landSizeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  landDetails: {
    gap: 12,
  },
  escalationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: LogiPointColors.gray[600],
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
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
  bondedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  bondedBadgeActive: {
    backgroundColor: LogiPointColors.success,
    borderColor: LogiPointColors.success,
  },
  bondedBadgeInactive: {
    backgroundColor: LogiPointColors.gray[200],
    borderColor: LogiPointColors.gray[400],
  },
  bondedBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  bondedBadgeTextActive: {
    color: LogiPointColors.white,
  },
  bondedBadgeTextInactive: {
    color: LogiPointColors.gray[700],
  },
  imageCard: {
    marginBottom: 16,
    padding: 16,
  },
  imageCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
  },
  propertyImage: {
    width: '100%',
    height: 300,
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
  additionalImagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: LogiPointColors.primary,
    borderRadius: 6,
  },
  addImageButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  additionalImagesGrid: {
    gap: 12,
  },
  additionalImageItem: {
    position: 'relative',
    marginBottom: 8,
  },
  additionalImageLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    marginBottom: 8,
  },
  additionalImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeAdditionalImageButton: {
    position: 'absolute',
    top: 32,
    right: 8,
    backgroundColor: LogiPointColors.error,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: LogiPointColors.midnight,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: LogiPointColors.gray[200],
  },
  modalSaveButton: {
    backgroundColor: LogiPointColors.primary,
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  modalSaveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  fullscreenModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});
