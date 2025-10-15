import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { Stack } from 'expo-router';
import { DollarSign, Edit2, TrendingUp, Plus } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { KPICard } from '@/components/KPICard';
import { ChartCard } from '@/components/ChartCard';
import { SimpleBarChart } from '@/components/SimpleBarChart';
import { VerticalBarChart } from '@/components/VerticalBarChart';
import { YearOverYearChart } from '@/components/YearOverYearChart';
import { ComboChart } from '@/components/ComboChart';
import { SimplePieChart, PieChartData } from '@/components/SimplePieChart';

import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

export default function SalesScreen() {
  const { isAdmin } = useAuth();
  const { salesData, updateSalesData } = useData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'default' | 'decimal-pad' | 'email-address' }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [selectedCustomerMonth, setSelectedCustomerMonth] = useState<string>('All');

  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const displayedSegments = useMemo(() => {
    if (selectedMonth === 'All') {
      const segmentTotals = new Map<string, { revenue: number; lastYearRevenue: number; color?: string }>();
      
      Object.values(salesData.revenueBySegmentMonthly).forEach(monthSegments => {
        monthSegments.forEach(segment => {
          const existing = segmentTotals.get(segment.segment);
          if (existing) {
            existing.revenue += segment.revenue;
            existing.lastYearRevenue += segment.lastYearRevenue || 0;
          } else {
            segmentTotals.set(segment.segment, {
              revenue: segment.revenue,
              lastYearRevenue: segment.lastYearRevenue || 0,
              color: segment.color,
            });
          }
        });
      });
      
      return Array.from(segmentTotals.entries()).map(([segment, data]) => ({
        segment,
        revenue: data.revenue,
        lastYearRevenue: data.lastYearRevenue,
        color: data.color,
      }));
    }
    return salesData.revenueBySegmentMonthly[selectedMonth] || [];
  }, [selectedMonth, salesData.revenueBySegmentMonthly]);

  const displayedCustomers = useMemo(() => {
    if (selectedCustomerMonth === 'All') {
      return salesData.topCustomers;
    }
    return salesData.topCustomersMonthly[selectedCustomerMonth] || [];
  }, [selectedCustomerMonth, salesData.topCustomers, salesData.topCustomersMonthly]);

  const handleEdit = (field: string, currentValue: number) => {
    setEditField(field);
    setEditValue(currentValue.toString());
    setEditFields([]);
    setEditModalVisible(true);
  };



  const handleEditArray = (field: string, index: number) => {
    setEditField(`${field}_${index}`);
    
    if (field === 'topCustomers') {
      const customers = selectedCustomerMonth === 'All' ? salesData.topCustomers : salesData.topCustomersMonthly[selectedCustomerMonth];
      const item = customers[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'default' | 'decimal-pad' | 'email-address' }[] = [
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
      const segments = selectedMonth === 'All' ? salesData.revenueBySegment : salesData.revenueBySegmentMonthly[selectedMonth];
      const item = segments[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'default' | 'decimal-pad' | 'email-address' }[] = [
        { label: 'Segment Name', value: item.segment, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Revenue', value: item.revenue.toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Last Year Revenue', value: (item.lastYearRevenue || 0).toString(), onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
        { label: 'Bar Color (hex)', value: item.color || LogiPointColors.primary, onChange: (text) => {
          setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
        }, keyboardType: 'default' },
      ];
      setEditFields(tempFields);
    } else if (field === 'monthlyRevenue') {
      const item = salesData.monthlyRevenue[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'default' | 'decimal-pad' | 'email-address' }[] = [
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
    } else if (field === 'accountManagers') {
      const item = salesData.accountManagers[index];
      const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'default' | 'decimal-pad' | 'email-address' }[] = [
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

  const handleSave = () => {
    if (editFields.length > 0) {
      const [fieldName, indexStr] = editField.split('_');
      const index = parseInt(indexStr);
      
      const updatedData = { ...salesData };
      
      if (fieldName === 'quarterlyTargets') {
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
          const newCustomers = [...salesData.topCustomers];
          newCustomers[index] = {
            name: editFields[0].value,
            sales: parseFloat(editFields[1].value) || 0,
            color: editFields[2].value,
          };
          updatedData.topCustomers = newCustomers;
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
        if (selectedMonth === 'All') {
          const newSegments = [...salesData.revenueBySegment];
          newSegments[index] = {
            segment: editFields[0].value,
            revenue: parseFloat(editFields[1].value) || 0,
            lastYearRevenue: parseFloat(editFields[2].value) || 0,
            color: editFields[3].value,
          };
          updatedData.revenueBySegment = newSegments;
        } else {
          const newMonthlySegments = { ...salesData.revenueBySegmentMonthly };
          const monthSegments = [...(newMonthlySegments[selectedMonth] || [])];
          monthSegments[index] = {
            segment: editFields[0].value,
            revenue: parseFloat(editFields[1].value) || 0,
            lastYearRevenue: parseFloat(editFields[2].value) || 0,
            color: editFields[3].value,
          };
          newMonthlySegments[selectedMonth] = monthSegments;
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
      
      updateSalesData(updatedData);
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

      updateSalesData(updatedData);
    }
    
    setEditModalVisible(false);
  };

  const handleEditQuarter = (quarter: 'q1' | 'q2' | 'q3' | 'q4') => {
    setEditField(`quarterlyTargets_${quarter}`);
    const qData = salesData.quarterlyTargets[quarter];
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'default' | 'decimal-pad' | 'email-address' }[] = [
      { label: '2025 Value', value: qData.current.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Budget (Target)', value: qData.target.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: '2024 Value', value: (qData.lastYear ?? 0).toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Color (hex)', value: qData.color || LogiPointColors.primary, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const renderQuarterlyRevenueComparison = () => {
    const quarters: ('q1' | 'q2' | 'q3' | 'q4')[] = ['q1', 'q2', 'q3', 'q4'];
    return (
      <ChartCard title="Quarterly Revenue Comparison" subtitle="2025 vs 2024">
        <View style={styles.quarterlyGrid} testID="quarterly-revenue-grid">
          {quarters.map((q) => {
            const qData = salesData.quarterlyTargets[q];
            const pieData: PieChartData[] = [
              { label: '2025', value: qData.current, color: qData.color || LogiPointColors.primary },
              { label: '2024', value: qData.lastYear ?? 0, color: LogiPointColors.beige },
            ];
            return (
              <View key={q} style={styles.quarterCard} testID={`quarter-card-${q}`}>
                <Text style={styles.quarterTitle}>{q.toUpperCase()}</Text>
                <SimplePieChart data={pieData} size={140} />
                {isAdmin && (
                  <TouchableOpacity
                    style={styles.quarterEditButton}
                    onPress={() => handleEditQuarter(q)}
                    testID={`edit-quarter-${q}`}
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
          title: 'Sales Revenue',
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


          {renderQuarterlyRevenueComparison()}

          <View style={styles.quarterlyTable}>
            <Text style={styles.quarterlyTableTitle}>Quarterly Revenue Details</Text>
            {(['q1', 'q2', 'q3', 'q4'] as const).map((q) => {
              const qData = salesData.quarterlyTargets[q];
              const lastYearValue = qData.lastYear ?? 0;
              const growth = lastYearValue > 0 
                ? ((qData.current - lastYearValue) / lastYearValue * 100).toFixed(1)
                : '0.0';
              const isPositive = parseFloat(growth) >= 0;
              const budgetVariance = qData.target > 0
                ? ((qData.current - qData.target) / qData.target * 100).toFixed(1)
                : '0.0';
              const isBudgetPositive = parseFloat(budgetVariance) >= 0;
              
              return (
                <View key={q} style={styles.quarterlyTableRow}>
                  <Text style={styles.quarterlyTableQuarter}>{q.toUpperCase()}</Text>
                  <View style={styles.quarterlyTableValues}>
                    <Text style={styles.quarterlyTableValue}>2025: {formatCurrency(qData.current)}</Text>
                    <Text style={styles.quarterlyTableValue}>Budget: {formatCurrency(qData.target)}</Text>
                    <Text style={styles.quarterlyTableValue}>2024: {formatCurrency(qData.lastYear ?? 0)}</Text>
                    <Text style={[styles.quarterlyTableGrowth, isBudgetPositive ? styles.growthPositive : styles.growthNegative]}>
                      vs Budget: {isBudgetPositive ? '+' : ''}{budgetVariance}%
                    </Text>
                    <Text style={[styles.quarterlyTableGrowth, isPositive ? styles.growthPositive : styles.growthNegative]}>
                      YoY: {isPositive ? '+' : ''}{growth}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          <ChartCard title="Revenue by Segment" subtitle={selectedMonth === 'All' ? 'Year-over-Year Comparison' : `${selectedMonth} Year-over-Year Comparison`}>
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
                  return (
                    <View key={i} style={styles.comparisonRow}>
                      <Text style={styles.comparisonSegment}>{s.segment}</Text>
                      <View style={styles.comparisonValues}>
                        <Text style={styles.comparisonValue}>This Year: {s.revenue.toLocaleString()}</Text>
                        <Text style={styles.comparisonValue}>Last Year: {s.lastYearRevenue.toLocaleString()}</Text>
                        <Text style={[styles.comparisonGrowth, isPositive ? styles.growthPositive : styles.growthNegative]}>
                          {isPositive ? '+' : ''}{growth}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {displayedSegments.map((s, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chartEditButton}
                    onPress={() => handleEditArray('revenueBySegment', index)}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.chartEditText}>Edit {s.segment}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.chartEditButton, styles.addButton]}
                  onPress={() => {
                    const updatedData = { ...salesData };
                    const newSegment = {
                      segment: 'New Segment',
                      revenue: 0,
                      lastYearRevenue: 0,
                      color: LogiPointColors.chart.blue,
                    };
                    
                    if (selectedMonth === 'All') {
                      updatedData.revenueBySegment = [...salesData.revenueBySegment, newSegment];
                    } else {
                      const newMonthlySegments = { ...salesData.revenueBySegmentMonthly };
                      newMonthlySegments[selectedMonth] = [...(newMonthlySegments[selectedMonth] || []), newSegment];
                      updatedData.revenueBySegmentMonthly = newMonthlySegments;
                    }
                    
                    updateSalesData(updatedData);
                  }}
                >
                  <Plus size={14} color={LogiPointColors.chart.green} />
                  <Text style={[styles.chartEditText, { color: LogiPointColors.chart.green }]}>Add Segment</Text>
                </TouchableOpacity>
              </View>
            )}
          </ChartCard>

          <ChartCard title="Monthly Revenue Performance" subtitle="Actual vs Budget vs Last Year Revenue">
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

          <ChartCard title="Account Manager Performance" subtitle="Revenue vs Budget in SAR">
            <VerticalBarChart 
              data={salesData.accountManagers.map(am => ({
                label: am.name,
                actual: am.revenue,
                budget: am.budget,
                color: am.color || LogiPointColors.chart.green,
              }))}
            />
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {salesData.accountManagers.map((am, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chartEditButton}
                    onPress={() => handleEditArray('accountManagers', index)}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.chartEditText}>Edit {am.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ChartCard>

          <ChartCard title="Top 5 Customers by Sales" subtitle={selectedCustomerMonth === 'All' ? 'Total revenue in SAR' : `${selectedCustomerMonth} revenue in SAR`}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthFilter}>
              {months.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthButton,
                    selectedCustomerMonth === month && styles.monthButtonActive,
                  ]}
                  onPress={() => setSelectedCustomerMonth(month)}
                >
                  <Text style={[
                    styles.monthButtonText,
                    selectedCustomerMonth === month && styles.monthButtonTextActive,
                  ]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <SimpleBarChart 
              data={displayedCustomers.map(c => ({
                label: c.name,
                value: c.sales,
                color: c.color,
              }))}
            />
            {isAdmin && (
              <View style={styles.chartEditButtons}>
                {displayedCustomers.map((c, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chartEditButton}
                    onPress={() => handleEditArray('topCustomers', index)}
                  >
                    <Edit2 size={14} color={LogiPointColors.primary} />
                    <Text style={styles.chartEditText}>Edit {c.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.chartEditButton, styles.addButton]}
                  onPress={() => {
                    const updatedData = { ...salesData };
                    const newCustomer = {
                      name: 'New Customer',
                      sales: 0,
                      color: '#00617f',
                    };
                    
                    if (selectedCustomerMonth === 'All') {
                      updatedData.topCustomers = [...salesData.topCustomers, newCustomer];
                    } else {
                      const newMonthlyCustomers = { ...salesData.topCustomersMonthly };
                      newMonthlyCustomers[selectedCustomerMonth] = [...(newMonthlyCustomers[selectedCustomerMonth] || []), newCustomer];
                      updatedData.topCustomersMonthly = newMonthlyCustomers;
                    }
                    
                    updateSalesData(updatedData);
                  }}
                >
                  <Plus size={14} color={LogiPointColors.chart.green} />
                  <Text style={[styles.chartEditText, { color: LogiPointColors.chart.green }]}>Add Customer</Text>
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
    width: 50,
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
  quarterlyTable: {
    marginTop: 20,
    padding: 16,
    backgroundColor: LogiPointColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LogiPointColors.gray[200],
  },
  quarterlyTableTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: LogiPointColors.midnight,
    marginBottom: 12,
  },
  quarterlyTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[200],
  },
  quarterlyTableQuarter: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: LogiPointColors.midnight,
    width: 50,
  },
  quarterlyTableValues: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 12,
  },
  quarterlyTableValue: {
    fontSize: 12,
    color: LogiPointColors.gray[600],
  },
  quarterlyTableGrowth: {
    fontSize: 13,
    fontWeight: '700' as const,
  },
});
