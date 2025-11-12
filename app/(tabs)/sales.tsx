import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { DollarSign, Edit2, TrendingUp, Plus, Trash2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { KPICard } from '@/components/KPICard';
import { ChartCard } from '@/components/ChartCard';

import { VerticalBarChart } from '@/components/VerticalBarChart';
import { YearOverYearChart } from '@/components/YearOverYearChart';
import { ComboChart } from '@/components/ComboChart';


import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/supabaseClient';
import { saveSalesData } from '@/lib/adminSave';

export default function SalesScreen() {
  const { isAdmin } = useAuth();
  const { salesData, updateSalesData, getLastUpdated, updateLastUpdated } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedCustomerMonth] = useState<string>('All');
  const [selectedTop10Month, setSelectedTop10Month] = useState<string>('Total');
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);

  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthsOnly = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthsWithTotal = ['Total', ...monthsOnly];

  const displayedSegments = useMemo(() => {
    if (selectedMonth === 'All') {
      const segmentTotals = new Map<string, { revenue: number; budget: number; lastYearRevenue: number; color?: string }>();
      
      Object.values(salesData.revenueBySegmentMonthly).forEach(monthSegments => {
        monthSegments.forEach(segment => {
          const existing = segmentTotals.get(segment.segment);
          if (existing) {
            existing.revenue += segment.revenue;
            existing.budget += segment.budget || 0;
            existing.lastYearRevenue += segment.lastYearRevenue || 0;
          } else {
            segmentTotals.set(segment.segment, {
              revenue: segment.revenue,
              budget: segment.budget || 0,
              lastYearRevenue: segment.lastYearRevenue || 0,
              color: segment.color,
            });
          }
        });
      });
      
      return Array.from(segmentTotals.entries()).map(([segment, data]) => ({
        segment,
        revenue: data.revenue,
        budget: data.budget,
        lastYearRevenue: data.lastYearRevenue,
        color: data.color,
      }));
    }
    return salesData.revenueBySegmentMonthly[selectedMonth] || [];
  }, [selectedMonth, salesData.revenueBySegmentMonthly]);

  const top10Customers = useMemo(() => {
    if (selectedTop10Month === 'Total') {
      const totals = new Map<string, { sales: number; color: string }>();
      Object.values(salesData.topCustomersMonthly).forEach(monthCustomers => {
        monthCustomers.forEach(customer => {
          const existing = totals.get(customer.name);
          if (existing) {
            existing.sales += customer.sales;
          } else {
            totals.set(customer.name, { sales: customer.sales, color: customer.color });
          }
        });
      });
      return Array.from(totals.entries())
        .map(([name, data]) => ({ name, sales: data.sales, color: data.color }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10);
    }
    const customers = salesData.topCustomersMonthly[selectedTop10Month] || [];
    return customers.slice(0, 10);
  }, [selectedTop10Month, salesData.topCustomersMonthly]);

  const top10Total = useMemo(() => {
    return top10Customers.reduce((sum, customer) => sum + customer.sales, 0);
  }, [top10Customers]);

  const displayedCustomers = useMemo(() => {
    if (selectedCustomerMonth === 'All') {
      const totals = new Map<string, { sales: number; color: string }>();
      Object.entries(salesData.topCustomersMonthly).forEach(([, arr]) => {
        arr.forEach((c) => {
          const prev = totals.get(c.name);
          if (prev) {
            prev.sales += c.sales;
          } else {
            totals.set(c.name, { sales: c.sales, color: c.color });
          }
        });
      });
      const result = Array.from(totals.entries())
        .map(([name, v]) => ({ name, sales: v.sales, color: v.color }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      return result;
    }
    const monthResult = salesData.topCustomersMonthly[selectedCustomerMonth] || [];
    return monthResult;
  }, [selectedCustomerMonth, salesData.topCustomersMonthly]);

  const handleEdit = (field: string, currentValue: number) => {
    setEditField(field);
    setEditValue(currentValue.toString());
    setEditFields([]);
    setEditModalVisible(true);
  };



  const handleEditArray = (field: string, index: number) => {
    setEditField(`${field}_${index}`);
    setCurrentEditIndex(index);
    
    if (field === 'quarterlyLabelling') {
      const quarter = (['q1', 'q2', 'q3', 'q4'][index]) as 'q1' | 'q2' | 'q3' | 'q4';
      const item = salesData.quarterlyLabelling[quarter];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: '2025 Value', value: item.current.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: '2024 Value', value: item.lastYear.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Budget', value: (item.budget || item.current * 0.95).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Color (hex)', value: item.color || '#00617f', onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    } else if (field === 'topCustomers') {
      const customers = selectedCustomerMonth === 'All' ? salesData.topCustomers : (salesData.topCustomersMonthly[selectedCustomerMonth] || []);
      const item = customers[index];
      if (!item) {
        return;
      }
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: 'Customer Name', value: item.name, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Sales', value: item.sales.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Bar Color (hex)', value: item.color, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    } else if (field === 'revenueBySegment') {
      const segments = selectedMonth === 'All' ? displayedSegments : (salesData.revenueBySegmentMonthly[selectedMonth] || []);
      const item = segments[index];
      if (!item) {
        return;
      }
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: 'Segment Name', value: item.segment, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Revenue', value: item.revenue.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Budget', value: (item.budget || 0).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Last Year Revenue', value: (item.lastYearRevenue || 0).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Bar Color (hex)', value: item.color || LogiPointColors.primary, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 4 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    } else if (field === 'monthlyRevenue') {
      const item = salesData.monthlyRevenue[index];
      if (!item) {
        return;
      }
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: 'Month', value: item.month, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Revenue', value: item.revenue.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Budget', value: item.budget.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Last Year Revenue', value: (item.lastYearRevenue || 0).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Revenue Bar Color (hex)', value: item.revenueColor || LogiPointColors.primary, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 4 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Budget Line Color (hex)', value: item.budgetColor || LogiPointColors.accent, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 5 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Last Year Bar Color (hex)', value: item.lastYearColor || LogiPointColors.beige, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 6 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    } else if (field === 'top10Customers') {
      const customers = salesData.topCustomersMonthly[selectedTop10Month] || [];
      const item = customers[index];
      if (!item) {
        return;
      }
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: 'Customer Name', value: item.name, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Revenue', value: item.sales.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Color (hex)', value: item.color, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    } else if (field === 'accountManagers') {
      const item = salesData.accountManagers[index];
      if (!item) {
        return;
      }
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: 'Manager Name', value: item.name, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Revenue Generated', value: item.revenue.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Budget', value: item.budget.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Bar Color (hex)', value: item.color || LogiPointColors.chart.green, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    }
    
    setEditModalVisible(true);
  };

  const ytdBudgetVariance = ((salesData.ytdRevenue - salesData.ytdBudget) / salesData.ytdBudget * 100).toFixed(1);
  const ytdGrowthPercentage = salesData.lastYearYtdRevenue > 0 
    ? ((salesData.totalRevenue - salesData.lastYearYtdRevenue) / salesData.lastYearYtdRevenue * 100).toFixed(1)
    : '0.0';

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString();
  };


  const handleDeleteSegment = async (index: number) => {
    try {
      const updatedData = { ...salesData };
      const segments = selectedMonth === 'All' ? displayedSegments : (salesData.revenueBySegmentMonthly[selectedMonth] || []);
      const target = segments[index];
      if (!target) {
        return;
      }
      const name = target.segment;

      updatedData.revenueBySegment = (updatedData.revenueBySegment || []).filter(s => s.segment !== name);

      const monthsList = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const newMonthly = { ...updatedData.revenueBySegmentMonthly } as typeof updatedData.revenueBySegmentMonthly;
      monthsList.forEach(m => {
        const arr = newMonthly[m] || [];
        newMonthly[m] = arr.filter(s => s.segment !== name);
      });
      updatedData.revenueBySegmentMonthly = newMonthly;

      await saveSalesData(updatedData);
    } catch (e) {
      console.error('Failed to delete segment:', e);
    }
  };

  const handleSave = async () => {
    if (editFields.length > 0) {
      const [fieldName, indexStr] = editField.split('_');
      const index = parseInt(indexStr);
      
      const updatedData = { ...salesData };
      
      if (fieldName === 'quarterlyLabelling') {
        const quarter = (['q1', 'q2', 'q3', 'q4'][parseInt(indexStr)]) as 'q1' | 'q2' | 'q3' | 'q4';
        updatedData.quarterlyLabelling = {
          ...salesData.quarterlyLabelling,
          [quarter]: {
            current: parseFloat(editFields[0].value) || 0,
            lastYear: parseFloat(editFields[1].value) || 0,
            budget: parseFloat(editFields[2].value) || 0,
            color: editFields[3].value,
          },
        };
      } else if (fieldName === 'quarterlyTargets') {
        const quarter = (indexStr as 'q1' | 'q2' | 'q3' | 'q4');
        updatedData.quarterlyTargets = {
          ...salesData.quarterlyTargets,
          [quarter]: {
            current: parseFloat(editFields[0].value) || 0,
            target: parseFloat(editFields[1].value) || 0,
            lastYear: parseFloat(editFields[2].value) || 0,
            color: editFields[3].value,
          },
        };
      } else if (fieldName === 'topCustomers') {
        if (selectedCustomerMonth === 'All') {
          const oldCustomerName = displayedCustomers[index]?.name;
          const newCustomerName = editFields[0].value;
          const newSales = parseFloat(editFields[1].value) || 0;
          const newColor = editFields[2].value;
          
          const newMonthlyCustomers = { ...salesData.topCustomersMonthly };
          const monthsList = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          
          if (oldCustomerName) {
            monthsList.forEach((month) => {
              const monthCustomers = newMonthlyCustomers[month] || [];
              const idx = monthCustomers.findIndex(c => c.name === oldCustomerName);
              if (idx >= 0) {
                monthCustomers[idx] = {
                  name: newCustomerName,
                  sales: newSales / monthsList.length,
                  color: newColor,
                };
                newMonthlyCustomers[month] = [...monthCustomers];
              }
            });
          }
          
          updatedData.topCustomersMonthly = newMonthlyCustomers;
        } else {
          const newMonthlyCustomers = { ...salesData.topCustomersMonthly };
          const monthCustomers = [...(newMonthlyCustomers[selectedCustomerMonth] || [])];
          monthCustomers[index] = {
            name: editFields[0].value,
            sales: parseFloat(editFields[1].value) || 0,
            color: editFields[2].value,
          };
          newMonthlyCustomers[selectedCustomerMonth] = monthCustomers;
          updatedData.topCustomersMonthly = newMonthlyCustomers;
        }
      } else if (fieldName === 'revenueBySegment') {
        const oldSegmentName = (selectedMonth === 'All' ? displayedSegments : (salesData.revenueBySegmentMonthly[selectedMonth] || []))[index]?.segment;
        const newSegmentName = editFields[0].value;
        const newSegmentData = {
          segment: newSegmentName,
          revenue: parseFloat(editFields[1].value) || 0,
          budget: parseFloat(editFields[2].value) || 0,
          lastYearRevenue: parseFloat(editFields[3].value) || 0,
          color: editFields[4].value,
        };

        if (selectedMonth === 'All') {
          const newSegments = [...salesData.revenueBySegment];
          const targetIdx = oldSegmentName ? newSegments.findIndex(s => s.segment === oldSegmentName) : index;
          if (targetIdx >= 0 && targetIdx < newSegments.length) {
            newSegments[targetIdx] = newSegmentData;
          } else {
            newSegments.push(newSegmentData);
          }
          updatedData.revenueBySegment = newSegments;
        } else {
          const newMonthlySegments = { ...salesData.revenueBySegmentMonthly };
          const monthSegments = [...(newMonthlySegments[selectedMonth] || [])];
          monthSegments[index] = newSegmentData;
          newMonthlySegments[selectedMonth] = monthSegments;

          if (oldSegmentName && oldSegmentName !== newSegmentName) {
            const monthsList = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            monthsList.forEach((m) => {
              if (m !== selectedMonth && newMonthlySegments[m]) {
                newMonthlySegments[m] = newMonthlySegments[m].map(s => 
                  s.segment === oldSegmentName ? { ...s, segment: newSegmentName } : s
                );
              }
            });

            if (updatedData.revenueBySegment) {
              updatedData.revenueBySegment = updatedData.revenueBySegment.map(s => 
                s.segment === oldSegmentName ? { ...s, segment: newSegmentName } : s
              );
            }
          }

          updatedData.revenueBySegmentMonthly = newMonthlySegments;
        }
      } else if (fieldName === 'monthlyRevenue') {
        const newMonthly = [...salesData.monthlyRevenue];
        newMonthly[index] = {
          month: editFields[0].value,
          revenue: parseFloat(editFields[1].value) || 0,
          budget: parseFloat(editFields[2].value) || 0,
          lastYearRevenue: parseFloat(editFields[3].value) || 0,
          revenueColor: editFields[4].value,
          budgetColor: editFields[5].value,
          lastYearColor: editFields[6].value,
        };
        updatedData.monthlyRevenue = newMonthly;
      } else if (fieldName === 'top10Customers') {
        const newMonthlyCustomers = { ...salesData.topCustomersMonthly };
        const monthCustomers = [...(newMonthlyCustomers[selectedTop10Month] || [])];
        monthCustomers[index] = {
          name: editFields[0].value,
          sales: parseFloat(editFields[1].value) || 0,
          color: editFields[2].value,
        };
        newMonthlyCustomers[selectedTop10Month] = monthCustomers;
        updatedData.topCustomersMonthly = newMonthlyCustomers;
      } else if (fieldName === 'accountManagers') {
        const newManagers = [...salesData.accountManagers];
        newManagers[index] = {
          name: editFields[0].value,
          revenue: parseFloat(editFields[1].value) || 0,
          budget: parseFloat(editFields[2].value) || 0,
          color: editFields[3].value,
        };
        updatedData.accountManagers = newManagers;
      }
      
      await saveSalesData(updatedData);
    } else {
      const numValue = parseFloat(editValue);
      if (isNaN(numValue)) return;

      const updatedData = { ...salesData };
      
      if (editField.startsWith('quarterlyTargets_')) {
        const quarter = editField.split('_')[1] as 'q1' | 'q2' | 'q3' | 'q4';
        updatedData.quarterlyTargets = {
          ...salesData.quarterlyTargets,
          [quarter]: {
            current: parseFloat(editFields[0].value) || 0,
            target: parseFloat(editFields[1].value) || 0,
            lastYear: parseFloat(editFields[2].value) || 0,
            color: editFields[3].value,
          },
        };
      } else {
        switch (editField) {
            case 'totalRevenue':
              updatedData.totalRevenue = numValue;
              break;
            case 'lastYearYtdRevenue':
              updatedData.lastYearYtdRevenue = numValue;
              break;
            case 'mtdRevenue':
              updatedData.mtdRevenue = numValue;
              break;
            case 'ytdRevenue':
              updatedData.ytdRevenue = numValue;
              break;
            case 'mtdBudget':
              updatedData.mtdBudget = numValue;
              break;
            case 'ytdBudget':
              updatedData.ytdBudget = numValue;
              break;
            case 'totalRevenueColor':
              updatedData.totalRevenueColor = editFields[0].value;
              break;
          }
      }

      await saveSalesData(updatedData);
    }
    
    setEditModalVisible(false);
  };



  return (
    <>
      <EditModal
        visible={editModalVisible}
        title={editField}
        value={editValue}
        onChangeText={setEditValue}
        onSave={handleSave}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentEditIndex(null);
        }}
        onDelete={editField.startsWith('revenueBySegment_') ? () => {
          if (currentEditIndex !== null) {
            handleDeleteSegment(currentEditIndex);
            setEditModalVisible(false);
            setCurrentEditIndex(null);
          }
        } : undefined}
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
            <View style={styles.kpiCardWrapper}>
              <View style={styles.budgetCard}>
                <KPICard
                  title="YTD Revenue vs Budget"
                  value={`${(salesData.ytdRevenue / 1000000).toFixed(2)}M`}
                  subtitle={`Budget: ${(salesData.ytdBudget / 1000000).toFixed(2)}M`}
                  trend={{ 
                    value: parseFloat(ytdBudgetVariance), 
                    isPositive: parseFloat(ytdBudgetVariance) >= 0,
                    label: 'vs Budget'
                  }}
                  icon={TrendingUp}
                  color={parseFloat(ytdBudgetVariance) >= 0 ? LogiPointColors.chart.green : LogiPointColors.accent}
                  lastUpdated={getLastUpdated('sales-ytd-revenue')}
                  onLastUpdatedChange={(value) => updateLastUpdated('sales-ytd-revenue', value)}
                />
                {isAdmin && (
                  <View style={styles.budgetEditButtons}>
                    <TouchableOpacity
                      style={[styles.editButton, styles.editButtonTop]}
                      onPress={() => handleEdit('ytdRevenue', salesData.ytdRevenue)}
                    >
                      <Edit2 size={16} color={LogiPointColors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.editButton, styles.editButtonBottom]}
                      onPress={() => handleEdit('ytdBudget', salesData.ytdBudget)}
                    >
                      <Edit2 size={16} color={LogiPointColors.white} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.kpiSpacer} />
            <View style={styles.kpiCardWrapper}>
              <KPICard
                title="Total Revenue"
                value={`${(salesData.totalRevenue / 1000000).toFixed(2)}M`}
                subtitle={`Last Year YTD: ${(salesData.lastYearYtdRevenue / 1000000).toFixed(2)}M`}
                trend={{ value: parseFloat(ytdGrowthPercentage), isPositive: parseFloat(ytdGrowthPercentage) >= 0 }}
                icon={DollarSign}
                color={salesData.totalRevenueColor || LogiPointColors.primary}
                lastUpdated={getLastUpdated('sales-total-revenue')}
                onLastUpdatedChange={(value) => updateLastUpdated('sales-total-revenue', value)}
              />
              {isAdmin && (
                <View style={styles.kpiEditButtons}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEdit('totalRevenue', salesData.totalRevenue)}
                  >
                    <Edit2 size={16} color={LogiPointColors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editButton, { top: 48 }]}
                    onPress={() => handleEdit('lastYearYtdRevenue', salesData.lastYearYtdRevenue)}
                  >
                    <Edit2 size={16} color={LogiPointColors.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.editButton, { top: 88 }]}
                    onPress={() => {
                      setEditField('totalRevenueColor');
                      setEditFields([{ 
                        label: 'Card Color (hex)', 
                        value: salesData.totalRevenueColor || LogiPointColors.primary, 
                        onChange: (text) => {
                          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
                        },
                        keyboardType: 'default'
                      }]);
                      setEditModalVisible(true);
                    }}
                  >
                    <Edit2 size={16} color={LogiPointColors.white} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

          </ScrollView>

          <ChartCard 
            title="Monthly Revenue Performance" 
            subtitle="Actual vs Budget vs Last Year Revenue"
            lastUpdated={getLastUpdated('sales-monthly-revenue')}
            onLastUpdatedChange={(value) => updateLastUpdated('sales-monthly-revenue', value)}
          >
            <ComboChart 
              data={salesData.monthlyRevenue.map(m => ({
                label: m.month,
                actual: m.revenue,
                budget: m.budget,
                lastYear: m.lastYearRevenue,
                barColor: m.revenueColor || LogiPointColors.primary,
                lineColor: m.budgetColor || LogiPointColors.accent,
                lastYearColor: m.lastYearColor || LogiPointColors.beige,
              }))}
            />
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: salesData.monthlyRevenue[0]?.revenueColor || LogiPointColors.primary }]} />
                <Text style={styles.legendText}>Actual Revenue</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: salesData.monthlyRevenue[0]?.lastYearColor || LogiPointColors.beige }]} />
                <Text style={styles.legendText}>Last Year Revenue</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: salesData.monthlyRevenue[0]?.budgetColor || LogiPointColors.accent, borderRadius: 8 }]} />
                <Text style={styles.legendText}>Budget Revenue (Line)</Text>
              </View>
            </View>
            <View style={styles.varianceTable}>
              <Text style={styles.varianceTitle}>Variance Analysis</Text>
              {salesData.monthlyRevenue.map((m, index) => {
                const variance = m.revenue - m.budget;
                const variancePercent = m.budget > 0 ? ((variance / m.budget) * 100).toFixed(1) : '0.0';
                const isPositive = variance >= 0;
                
                const lastYearGrowth = m.lastYearRevenue && m.lastYearRevenue > 0 
                  ? ((m.revenue - m.lastYearRevenue) / m.lastYearRevenue * 100).toFixed(1)
                  : null;
                const isGrowthPositive = lastYearGrowth ? parseFloat(lastYearGrowth) >= 0 : false;
                
                return (
                  <View key={index} style={styles.varianceRow}>
                    <Text style={styles.varianceMonth}>{m.month}</Text>
                    <View style={styles.varianceValues}>
                      <Text style={styles.varianceValue}>Actual: {formatCurrency(m.revenue)}</Text>
                      <Text style={styles.varianceValue}>Budget: {formatCurrency(m.budget)}</Text>
                      {m.lastYearRevenue && m.lastYearRevenue > 0 && (
                        <Text style={styles.varianceValue}>Last Year: {formatCurrency(m.lastYearRevenue)}</Text>
                      )}
                      <Text style={[styles.variancePercent, isPositive ? styles.variancePositive : styles.varianceNegative]}>
                        Var: {isPositive ? '+' : ''}{variancePercent}%
                      </Text>
                      {lastYearGrowth && (
                        <Text style={[styles.variancePercent, isGrowthPositive ? styles.variancePositive : styles.varianceNegative]}>
                          YoY: {isGrowthPositive ? '+' : ''}{lastYearGrowth}%
                        </Text>
                      )}
                    </View>
                    {isAdmin && (
                      <TouchableOpacity
                        style={styles.varianceEditButton}
                        onPress={() => handleEditArray('monthlyRevenue', index)}
                      >
                        <Edit2 size={12} color={LogiPointColors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </ChartCard>

          <ChartCard 
            title="Revenue by Segment" 
            subtitle={selectedMonth === 'All' ? 'Year-over-Year Comparison' : `${selectedMonth} Year-over-Year Comparison`}
            lastUpdated={getLastUpdated('sales-revenue-by-segment')}
            onLastUpdatedChange={(value) => updateLastUpdated('sales-revenue-by-segment', value)}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthFilter}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthButton,
                    selectedMonth === month && styles.monthButtonActive,
                  ]}
                  onPress={() => setSelectedMonth(month)}
                >
                  <Text style={[
                    styles.monthButtonText,
                    selectedMonth === month && styles.monthButtonTextActive,
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <YearOverYearChart 
              data={displayedSegments.map((s, i) => ({
                label: s.segment,
                thisYear: s.revenue,
                lastYear: s.lastYearRevenue || 0,
                color: s.color || [LogiPointColors.primary, LogiPointColors.accent, LogiPointColors.chart.green][i % 3],
              }))}
            />
            {displayedSegments.some(s => s.lastYearRevenue) && (
              <View style={styles.comparisonSection}>
                <Text style={styles.comparisonTitle}>Year-over-Year Comparison</Text>
                {displayedSegments.map((s, i) => {
                  if (!s.lastYearRevenue) return null;
                  const growth = ((s.revenue - s.lastYearRevenue) / s.lastYearRevenue * 100).toFixed(1);
                  const isPositive = parseFloat(growth) >= 0;
                  const budget = s.budget || 0;
                  const variance = budget > 0 ? ((s.revenue - budget) / budget * 100).toFixed(1) : '0.0';
                  const isVariancePositive = parseFloat(variance) >= 0;
                  return (
                    <View key={i} style={styles.comparisonRow}>
                      <Text style={styles.comparisonSegment}>{s.segment}</Text>
                      <View style={styles.comparisonValues}>
                        <Text style={styles.comparisonValue}>This Year: {s.revenue.toLocaleString()}</Text>
                        {budget > 0 && (
                          <Text style={styles.comparisonValue}>Budget: {budget.toLocaleString()}</Text>
                        )}
                        <Text style={styles.comparisonValue}>Last Year: {s.lastYearRevenue.toLocaleString()}</Text>
                        <Text style={[styles.comparisonGrowth, isPositive ? styles.growthPositive : styles.growthNegative]}>
                          YoY: {isPositive ? '+' : ''}{growth}%
                        </Text>
                        {budget > 0 && (
                          <Text style={[styles.comparisonGrowth, isVariancePositive ? styles.growthPositive : styles.growthNegative]}>
                            Var: {isVariancePositive ? '+' : ''}{variance}%
                          </Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {displayedSegments.map((s, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      testID={`edit-segment-${s.segment}`}
                      style={styles.chartEditButton}
                      onPress={() => handleEditArray('revenueBySegment', index)}
                    >
                      <Edit2 size={14} color={LogiPointColors.primary} />
                      <Text style={styles.chartEditText}>Edit {s.segment}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      testID={`delete-segment-${s.segment}`}
                      style={[styles.chartEditButton, styles.deleteButton]}
                      onPress={() => handleDeleteSegment(index)}
                    >
                      <Trash2 size={14} color={LogiPointColors.accent} />
                      <Text style={[styles.chartEditText, { color: LogiPointColors.accent }]}>Delete</Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
                <TouchableOpacity
                  style={[styles.chartEditButton, styles.addButton]}
                  onPress={() => {
                    const updatedData = { ...salesData };
                    const newSegment = {
                      segment: 'New Segment',
                      revenue: 0,
                      budget: 0,
                      lastYearRevenue: 0,
                      color: LogiPointColors.chart.blue,
                    } as { segment: string; revenue: number; budget?: number; lastYearRevenue?: number; color?: string };

                    const monthsList = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                    const newMonthlySegments = { ...salesData.revenueBySegmentMonthly } as typeof salesData.revenueBySegmentMonthly;

                    monthsList.forEach((m) => {
                      if (!newMonthlySegments[m]) {
                        newMonthlySegments[m] = [];
                      }
                    });

                    const ensureInMonth = (month: string) => {
                      const arr = newMonthlySegments[month] || [];
                      const exists = arr.some((s) => s.segment === newSegment.segment);
                      if (!exists) {
                        newMonthlySegments[month] = [...arr, { ...newSegment }];
                      }
                    };

                    if (selectedMonth === 'All') {
                      monthsList.forEach((m) => ensureInMonth(m));
                      if (!updatedData.revenueBySegment.some((s) => s.segment === newSegment.segment)) {
                        updatedData.revenueBySegment = [...updatedData.revenueBySegment, { ...newSegment }];
                      }
                    } else {
                      const arr = newMonthlySegments[selectedMonth] || [];
                      newMonthlySegments[selectedMonth] = [...arr, { ...newSegment }];
                      monthsList
                        .filter((m) => m !== selectedMonth)
                        .forEach((m) => ensureInMonth(m));
                      if (!updatedData.revenueBySegment.some((s) => s.segment === newSegment.segment)) {
                        updatedData.revenueBySegment = [...updatedData.revenueBySegment, { ...newSegment }];
                      }
                    }

                    updatedData.revenueBySegmentMonthly = newMonthlySegments;

                    saveSalesData(updatedData);
                  }}
                >
                  <Plus size={14} color={LogiPointColors.chart.green} />
                  <Text style={[styles.chartEditText, { color: LogiPointColors.chart.green }]}>Add Segment</Text>
                </TouchableOpacity>
              </View>
            )}
          </ChartCard>

          <ChartCard 
            title="Quarterly Revenue Comparison" 
            subtitle="Actual vs Budget vs Last Year Revenue"
            lastUpdated={getLastUpdated('sales-quarterly-revenue')}
            onLastUpdatedChange={(value) => updateLastUpdated('sales-quarterly-revenue', value)}
          >
            <ComboChart
              data={(['q1', 'q2', 'q3', 'q4'] as const).map((quarter, idx) => {
                const q = salesData.quarterlyLabelling[quarter];
                const budget = q.budget || q.current * 0.95;
                return {
                  label: `Q${idx + 1}`,
                  actual: q.current,
                  budget: budget,
                  lastYear: q.lastYear,
                  barColor: q.color || LogiPointColors.primary,
                  lineColor: LogiPointColors.accent,
                  lastYearColor: LogiPointColors.beige,
                };
              })}
            />
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: salesData.quarterlyLabelling.q1.color || LogiPointColors.primary }]} />
                <Text style={styles.legendText}>Actual Revenue</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: LogiPointColors.beige }]} />
                <Text style={styles.legendText}>Last Year Revenue</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: LogiPointColors.accent, borderRadius: 8 }]} />
                <Text style={styles.legendText}>Budget Revenue (Line)</Text>
              </View>
            </View>
            <View style={styles.varianceTable}>
              <Text style={styles.varianceTitle}>Variance Analysis</Text>
              {(['q1', 'q2', 'q3', 'q4'] as const).map((quarter, index) => {
                const data = salesData.quarterlyLabelling[quarter];
                const budget = data.budget || data.current * 0.95;
                const variance = data.current - budget;
                const variancePercent = budget > 0 ? ((variance / budget) * 100).toFixed(1) : '0.0';
                const isPositive = variance >= 0;
                
                const yoyGrowth = data.lastYear && data.lastYear > 0 
                  ? ((data.current - data.lastYear) / data.lastYear * 100).toFixed(1)
                  : null;
                const isGrowthPositive = yoyGrowth ? parseFloat(yoyGrowth) >= 0 : false;
                
                return (
                  <View key={quarter} style={styles.varianceRow}>
                    <Text style={styles.varianceMonth}>Q{index + 1}</Text>
                    <View style={styles.varianceValues}>
                      <Text style={styles.varianceValue}>Actual: {formatCurrency(data.current)}</Text>
                      <Text style={styles.varianceValue}>Budget: {formatCurrency(budget)}</Text>
                      {data.lastYear && data.lastYear > 0 && (
                        <Text style={styles.varianceValue}>Last Year: {formatCurrency(data.lastYear)}</Text>
                      )}
                      <Text style={[styles.variancePercent, isPositive ? styles.variancePositive : styles.varianceNegative]}>
                        Var: {isPositive ? '+' : ''}{variancePercent}%
                      </Text>
                      {yoyGrowth && (
                        <Text style={[styles.variancePercent, isGrowthPositive ? styles.variancePositive : styles.varianceNegative]}>
                          YoY: {isGrowthPositive ? '+' : ''}{yoyGrowth}%
                        </Text>
                      )}
                    </View>
                    {isAdmin && (
                      <TouchableOpacity
                        style={styles.varianceEditButton}
                        onPress={() => handleEditArray('quarterlyLabelling', index)}
                      >
                        <Edit2 size={12} color={LogiPointColors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </ChartCard>

          <ChartCard 
            title="Account Manager Performance" 
            subtitle="Revenue vs Budget"
            lastUpdated={getLastUpdated('sales-account-manager')}
            onLastUpdatedChange={(value) => updateLastUpdated('sales-account-manager', value)}
          >
            <VerticalBarChart 
              data={salesData.accountManagers.map((am, i) => ({
                label: am.name,
                actual: am.revenue,
                budget: am.budget,
                color: am.color || [LogiPointColors.chart.green, LogiPointColors.primary, LogiPointColors.accent, LogiPointColors.chart.blue, LogiPointColors.chart.purple][i % 5],
              }))}
            />
            <View style={styles.varianceTable}>
              <Text style={styles.varianceTitle}>Performance Analysis</Text>
              {salesData.accountManagers.map((am, index) => {
                const variance = am.revenue - am.budget;
                const variancePercent = am.budget > 0 ? ((variance / am.budget) * 100).toFixed(1) : '0.0';
                const isPositive = variance >= 0;
                const achievement = am.budget > 0 ? ((am.revenue / am.budget) * 100).toFixed(1) : '0.0';
                
                return (
                  <View key={index} style={styles.varianceRow}>
                    <Text style={styles.varianceMonth}>{am.name}</Text>
                    <View style={styles.varianceValues}>
                      <Text style={styles.varianceValue}>Revenue: {formatCurrency(am.revenue)}</Text>
                      <Text style={styles.varianceValue}>Budget: {formatCurrency(am.budget)}</Text>
                      <Text style={[styles.variancePercent, isPositive ? styles.variancePositive : styles.varianceNegative]}>
                        Var: {isPositive ? '+' : ''}{variancePercent}%
                      </Text>
                      <Text style={styles.varianceValue}>Achievement: {achievement}%</Text>
                    </View>
                    {isAdmin && (
                      <TouchableOpacity
                        style={styles.varianceEditButton}
                        onPress={() => handleEditArray('accountManagers', index)}
                      >
                        <Edit2 size={12} color={LogiPointColors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
            {isAdmin && (
              <TouchableOpacity
                style={[styles.chartEditButton, styles.addButton, { marginTop: 16 }]}
                onPress={() => {
                  const updatedData = { ...salesData };
                  const newManager = {
                    name: 'New Manager',
                    revenue: 0,
                    budget: 0,
                    color: LogiPointColors.chart.green,
                  };
                  updatedData.accountManagers = [...salesData.accountManagers, newManager];
                  saveSalesData(updatedData);
                }}
              >
                <Plus size={14} color={LogiPointColors.chart.green} />
                <Text style={[styles.chartEditText, { color: LogiPointColors.chart.green }]}>Add Manager</Text>
              </TouchableOpacity>
            )}
          </ChartCard>

          <ChartCard 
            title="Top 10 Customers by Revenue" 
            subtitle={`${selectedTop10Month} - Total: ${formatCurrency(top10Total)}`}
            lastUpdated={getLastUpdated('sales-top-10-customers')}
            onLastUpdatedChange={(value) => updateLastUpdated('sales-top-10-customers', value)}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthFilter}>
              {monthsWithTotal.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthButton,
                    selectedTop10Month === month && styles.monthButtonActive,
                  ]}
                  onPress={() => setSelectedTop10Month(month)}
                >
                  <Text style={[
                    styles.monthButtonText,
                    selectedTop10Month === month && styles.monthButtonTextActive,
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.customersTable}>
              <View style={styles.customersTableHeader}>
                <Text style={[styles.customersTableHeaderText, { flex: 1 }]}>Customer Name</Text>
                <Text style={[styles.customersTableHeaderText, { width: 120, textAlign: 'right' }]}>Revenue</Text>
                {isAdmin && <View style={{ width: 40 }} />}
              </View>
              {top10Customers.map((customer, displayIndex) => {
                const customers = salesData.topCustomersMonthly[selectedTop10Month] || [];
                const actualIndex = customers.findIndex(c => c.name === customer.name && c.sales === customer.sales);
                
                return (
                  <View key={displayIndex} style={styles.customersTableRow}>
                    <Text style={[styles.customersTableCell, { flex: 1 }]}>{customer.name}</Text>
                    <Text style={[styles.customersTableCell, { width: 120, textAlign: 'right', fontWeight: '700' }]}>
                      {formatCurrency(customer.sales)}
                    </Text>
                    {isAdmin && (
                      <TouchableOpacity
                        style={styles.customersTableEditButton}
                        onPress={() => handleEditArray('top10Customers', actualIndex >= 0 ? actualIndex : displayIndex)}
                      >
                        <Edit2 size={14} color={LogiPointColors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
              <View style={styles.customersTotalRow}>
                <Text style={[styles.customersTotalText, { flex: 1 }]}>Total</Text>
                <Text style={[styles.customersTotalText, { width: 120, textAlign: 'right' }]}>
                  {formatCurrency(top10Total)}
                </Text>
                {isAdmin && <View style={{ width: 40 }} />}
              </View>
            </View>
            {isAdmin && (
              <TouchableOpacity
                style={[styles.chartEditButton, styles.addButton, { marginTop: 16 }]}
                onPress={() => {
                  const updatedData = { ...salesData };
                  const newCustomer = {
                    name: 'New Customer',
                    sales: 0,
                    color: LogiPointColors.primary,
                  };
                  const newMonthlyCustomers = { ...salesData.topCustomersMonthly };
                  const monthCustomers = [...(newMonthlyCustomers[selectedTop10Month] || [])];
                  monthCustomers.unshift(newCustomer);
                  newMonthlyCustomers[selectedTop10Month] = monthCustomers;
                  updatedData.topCustomersMonthly = newMonthlyCustomers;
                  updateSalesData(updatedData);
                }}
              >
                <Plus size={14} color={LogiPointColors.chart.green} />
                <Text style={[styles.chartEditText, { color: LogiPointColors.chart.green }]}>Add Customer</Text>
              </TouchableOpacity>
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
  kpiCardWrapper: {
    flex: 1,
    minWidth: 280,
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
  budgetCard: {
    position: 'relative',
  },
  kpiEditButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    gap: 4,
  },
  budgetEditButtons: {
    position: 'absolute',
    right: 8,
    flexDirection: 'column',
    gap: 4,
  },
  editButtonTop: {
    top: 8,
  },
  editButtonBottom: {
    top: 48,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: LogiPointColors.gray[600],
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
  targetEditButtons: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  monthFilter: {
    marginBottom: 16,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: LogiPointColors.gray[100],
    borderWidth: 1,
    borderColor: LogiPointColors.gray[300],
  },
  monthButtonActive: {
    backgroundColor: LogiPointColors.primary,
    borderColor: LogiPointColors.primary,
  },
  monthButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  monthButtonTextActive: {
    color: LogiPointColors.white,
  },
  comparisonSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  comparisonRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
  },
  comparisonSegment: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    marginBottom: 6,
  },
  comparisonValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  comparisonValue: {
    fontSize: 13,
    color: LogiPointColors.gray[600],
  },
  comparisonGrowth: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  growthPositive: {
    color: LogiPointColors.chart.green,
  },
  growthNegative: {
    color: LogiPointColors.accent,
  },
  addButton: {
    borderColor: LogiPointColors.chart.green,
  },
  deleteButton: {
    borderColor: LogiPointColors.accent,
    backgroundColor: LogiPointColors.gray[50],
  },
  varianceTable: {
    marginTop: 20,
    padding: 16,
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  varianceTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  varianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
  },
  varianceMonth: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    width: 130,
    marginRight: 16,
  },
  varianceValues: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 12,
  },
  varianceValue: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
  },
  variancePercent: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
  variancePositive: {
    color: LogiPointColors.chart.green,
  },
  varianceNegative: {
    color: LogiPointColors.accent,
  },
  varianceEditButton: {
    padding: 6,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
  },
  quarterlyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  quarterCard: {
    width: '48%',
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
    position: 'relative',
  },
  quarterTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  quarterLegend: {
    marginTop: 12,
    width: '100%',
    gap: 8,
  },
  quarterLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quarterLegendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  quarterLegendLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as const,
    color: LogiPointColors.gray[700],
  },
  quarterLegendValue: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  quarterEditButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: LogiPointColors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quarterEditText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: LogiPointColors.white,
  },
  quarterlyTable: {
    marginTop: 20,
    backgroundColor: LogiPointColors.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  quarterlyTableTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: LogiPointColors.gray[300],
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
  },
  tableCell: {
    fontSize: 13,
    color: LogiPointColors.gray[700],
  },
  tableQuarterCol: {
    width: '15%',
    fontWeight: '600' as const,
  },
  tableValueCol: {
    width: '18%',
    textAlign: 'right' as const,
  },
  tableChangeCol: {
    width: '16%',
    textAlign: 'right' as const,
    fontWeight: '700' as const,
  },
  changePositive: {
    color: LogiPointColors.chart.green,
  },
  changeNegative: {
    color: LogiPointColors.accent,
  },
  customersTable: {
    marginTop: 16,
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  customersTableHeader: {
    flexDirection: 'row',
    backgroundColor: LogiPointColors.gray[100],
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: LogiPointColors.gray[300],
  },
  customersTableHeaderText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
  customersTableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
    alignItems: 'center',
  },
  customersTableCell: {
    fontSize: 14,
    color: LogiPointColors.gray[700],
  },
  customersTableEditButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: LogiPointColors.gray[100],
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LogiPointColors.primary,
  },
  customersTotalRow: {
    flexDirection: 'row',
    backgroundColor: LogiPointColors.gray[50],
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: LogiPointColors.primary,
  },
  customersTotalText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
  },
});
