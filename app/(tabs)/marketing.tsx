import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Edit2, TrendingUp, Users, DollarSign, Target, BarChart3, ChevronDown, Plus, Trash2 } from 'lucide-react-native';
import { LogiPointColors } from '@/constants/colors';
import { ChartCard } from '@/components/ChartCard';
import { EditModal } from '@/components/EditModal';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { MARKETING_CHANNELS, ChannelMetrics, MarketingChannel, Campaign, createEmptyChannelMetrics } from '@/mocks/dashboardData';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';

const CHANNEL_LABELS: Record<MarketingChannel, string> = {
  website: 'Website',
  linkedinOrganic: 'LinkedIn (Organic)',
  linkedinPaid: 'LinkedIn (Paid)',
  instagramOrganic: 'Instagram (Organic)',
  instagramPaid: 'Instagram (Paid)',
  facebookOrganic: 'Facebook (Organic)',
  facebookPaid: 'Facebook (Paid)',
  email: 'Email',
  referral: 'Referral',
};

const CHANNEL_COLORS: Record<MarketingChannel, string> = {
  website: LogiPointColors.primary,
  linkedinOrganic: '#0077B5',
  linkedinPaid: '#004182',
  instagramOrganic: '#E4405F',
  instagramPaid: '#C13584',
  email: '#FF9800',
  referral: '#4CAF50',
  facebookOrganic: '#1877F2',
  facebookPaid: '#0D5BB5',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M SAR`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K SAR`;
  }
  return `${value.toFixed(0)} SAR`;
};

const formatNumber = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
};

const safeDiv = (a: number, b: number): number => {
  if (b === 0) return 0;
  return a / b;
};

export default function MarketingScreen() {
  const { isAdmin } = useAuth();
  const { marketingData, updateMarketingData } = useData();
  
  const currentYear = new Date().getFullYear().toString();
  const availableYears = Object.keys(marketingData.years).sort().reverse();
  const [selectedYear, setSelectedYear] = useState(availableYears.includes(currentYear) ? currentYear : availableYears[0] || currentYear);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  
  const currentMonth = new Date().getMonth();
  
  const yearData = marketingData.years[selectedYear] || { monthly: [], campaigns: [], campaignMonthly: {} };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>('');
  const [editFields, setEditFields] = useState<{ label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[]>([]);

  const handleEditMonthChannel = (monthIdx: number, channel: MarketingChannel) => {
    setEditField(`month_${monthIdx}_${channel}`);
    const monthData = yearData.monthly[monthIdx];
    const leads = monthData?.leadsByChannel[channel] || 0;
    const spend = monthData?.spendByChannelSar[channel] || 0;
    
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: `${MONTH_SHORT[monthIdx]} - ${CHANNEL_LABELS[channel]} Leads`, value: leads.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: `${MONTH_SHORT[monthIdx]} - ${CHANNEL_LABELS[channel]} Spend (SAR)`, value: spend.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditMonthConversions = (monthIdx: number) => {
    setEditField(`month_${monthIdx}_conversions`);
    const monthData = yearData.monthly[monthIdx];
    
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: `${MONTH_SHORT[monthIdx]} - Converted Leads`, value: (monthData?.convertedLeads || 0).toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
      { label: `${MONTH_SHORT[monthIdx]} - Attributed Revenue (SAR)`, value: (monthData?.attributedRevenueSar || 0).toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleEditCampaign = (campaignIdx: number) => {
    setEditField(`campaign_${campaignIdx}`);
    const campaign = yearData.campaigns[campaignIdx];
    
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Campaign Name', value: campaign.name, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Start Date (YYYY-MM-DD)', value: campaign.startDate, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'End Date (YYYY-MM-DD)', value: campaign.endDate, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Budget (SAR)', value: campaign.budgetSar.toString(), onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleAddCampaign = () => {
    setEditField('new_campaign');
    const nextId = `campaign_${Date.now()}`;
    
    const tempFields: { label: string; value: string; onChange: (text: string) => void; keyboardType?: 'default' | 'numeric' }[] = [
      { label: 'Campaign Name', value: '', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 0 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Start Date (YYYY-MM-DD)', value: `${selectedYear}-01-01`, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 1 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'End Date (YYYY-MM-DD)', value: `${selectedYear}-12-31`, onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 2 ? { ...f, value: text } : f));
      }, keyboardType: 'default' },
      { label: 'Budget (SAR)', value: '50000', onChange: (text) => {
        setEditFields(prev => prev.map((f, i) => i === 3 ? { ...f, value: text } : f));
      }, keyboardType: 'numeric' },
    ];
    setEditFields(tempFields);
    setEditModalVisible(true);
  };

  const handleDeleteCampaign = (campaignIdx: number) => {
    const updatedData = { ...marketingData };
    const campaignId = yearData.campaigns[campaignIdx].id;
    updatedData.years = {
      ...updatedData.years,
      [selectedYear]: {
        ...yearData,
        campaigns: yearData.campaigns.filter((_, i) => i !== campaignIdx),
        campaignMonthly: Object.fromEntries(
          Object.entries(yearData.campaignMonthly).filter(([id]) => id !== campaignId)
        ),
      },
    };
    updateMarketingData(updatedData);
  };

  const handleSave = () => {
    if (editFields.length === 0) {
      setEditModalVisible(false);
      return;
    }

    const updatedData = { ...marketingData };
    const updatedYearData = { ...yearData, monthly: [...yearData.monthly], campaigns: [...yearData.campaigns], campaignMonthly: { ...yearData.campaignMonthly } };

    if (editField.startsWith('month_') && editField.includes('_conversions')) {
      const monthIdx = parseInt(editField.split('_')[1]);
      updatedYearData.monthly[monthIdx] = {
        ...updatedYearData.monthly[monthIdx],
        convertedLeads: parseFloat(editFields[0].value) || 0,
        attributedRevenueSar: parseFloat(editFields[1].value) || 0,
      };
    } else if (editField.startsWith('month_')) {
      const parts = editField.split('_');
      const monthIdx = parseInt(parts[1]);
      const channel = parts.slice(2).join('_') as MarketingChannel;
      
      updatedYearData.monthly[monthIdx] = {
        ...updatedYearData.monthly[monthIdx],
        leadsByChannel: {
          ...updatedYearData.monthly[monthIdx].leadsByChannel,
          [channel]: parseFloat(editFields[0].value) || 0,
        },
        spendByChannelSar: {
          ...updatedYearData.monthly[monthIdx].spendByChannelSar,
          [channel]: parseFloat(editFields[1].value) || 0,
        },
      };
    } else if (editField.startsWith('campaign_')) {
      const campaignIdx = parseInt(editField.split('_')[1]);
      updatedYearData.campaigns[campaignIdx] = {
        ...updatedYearData.campaigns[campaignIdx],
        name: editFields[0].value,
        startDate: editFields[1].value,
        endDate: editFields[2].value,
        budgetSar: parseFloat(editFields[3].value) || 0,
      };
    } else if (editField === 'new_campaign') {
      const newCampaign: Campaign = {
        id: `campaign_${Date.now()}`,
        name: editFields[0].value || 'New Campaign',
        startDate: editFields[1].value,
        endDate: editFields[2].value,
        budgetSar: parseFloat(editFields[3].value) || 50000,
        channels: ['website'],
      };
      updatedYearData.campaigns.push(newCampaign);
      updatedYearData.campaignMonthly[newCampaign.id] = [];
    }

    updatedData.years = {
      ...updatedData.years,
      [selectedYear]: updatedYearData,
    };

    updateMarketingData(updatedData);
    setEditModalVisible(false);
  };

  const kpis = useMemo(() => {
    const monthly = yearData.monthly || [];
    
    const currentMonthData = monthly[currentMonth];
    const mtdLeads = currentMonthData ? 
      Object.values(currentMonthData.leadsByChannel).reduce((sum, v) => sum + v, 0) : 0;
    
    const ytdLeads = monthly.slice(0, currentMonth + 1).reduce((sum, m) => {
      return sum + Object.values(m.leadsByChannel).reduce((s, v) => s + v, 0);
    }, 0);
    
    const ytdConverted = monthly.slice(0, currentMonth + 1).reduce((sum, m) => sum + m.convertedLeads, 0);
    const ytdRevenue = monthly.slice(0, currentMonth + 1).reduce((sum, m) => sum + m.attributedRevenueSar, 0);
    const ytdSpend = monthly.slice(0, currentMonth + 1).reduce((sum, m) => {
      return sum + Object.values(m.spendByChannelSar).reduce((s, v) => s + v, 0);
    }, 0);
    
    const conversionRate = safeDiv(ytdConverted, ytdLeads) * 100;
    const avgRevenuePerLead = safeDiv(ytdRevenue, ytdConverted);
    const costPerLead = safeDiv(ytdSpend, ytdLeads);
    
    const activeCampaigns = (yearData.campaigns || []).filter(c => {
      const now = new Date();
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return now >= start && now <= end;
    }).length;
    
    return {
      mtdLeads,
      ytdLeads,
      conversionRate,
      ytdConverted,
      ytdRevenue,
      avgRevenuePerLead,
      costPerLead,
      activeCampaigns,
      ytdSpend,
    };
  }, [yearData, currentMonth]);

  const leadsByChannelYTD = useMemo(() => {
    const monthly = yearData.monthly || [];
    const totals: ChannelMetrics = {
      website: 0,
      linkedinOrganic: 0,
      linkedinPaid: 0,
      instagramOrganic: 0,
      instagramPaid: 0,
      facebookOrganic: 0,
      facebookPaid: 0,
    };
    
    monthly.slice(0, currentMonth + 1).forEach(m => {
      MARKETING_CHANNELS.forEach(ch => {
        totals[ch] += m.leadsByChannel[ch];
      });
    });
    
    return totals;
  }, [yearData, currentMonth]);

  const spendByChannelYTD = useMemo(() => {
    const monthly = yearData.monthly || [];
    const totals: ChannelMetrics = {
      website: 0,
      linkedinOrganic: 0,
      linkedinPaid: 0,
      instagramOrganic: 0,
      instagramPaid: 0,
      facebookOrganic: 0,
      facebookPaid: 0,
    };
    
    monthly.slice(0, currentMonth + 1).forEach(m => {
      MARKETING_CHANNELS.forEach(ch => {
        totals[ch] += m.spendByChannelSar[ch];
      });
    });
    
    return totals;
  }, [yearData, currentMonth]);

  const conversionByChannel = useMemo(() => {
    const monthly = yearData.monthly || [];
    const channelData: { channel: MarketingChannel; leads: number; spend: number }[] = [];
    
    MARKETING_CHANNELS.forEach(ch => {
      const leads = monthly.slice(0, currentMonth + 1).reduce((sum, m) => sum + m.leadsByChannel[ch], 0);
      const spend = monthly.slice(0, currentMonth + 1).reduce((sum, m) => sum + m.spendByChannelSar[ch], 0);
      channelData.push({ channel: ch, leads, spend });
    });
    
    return channelData;
  }, [yearData, currentMonth]);

  const campaignKPIs = useMemo(() => {
    const campaigns = yearData.campaigns || [];
    const campaignMonthly = yearData.campaignMonthly || {};
    
    return campaigns.map(campaign => {
      const allocations = campaignMonthly[campaign.id] || [];
      const totalLeads = allocations.reduce((sum, a) => sum + a.leads, 0);
      const totalConverted = allocations.reduce((sum, a) => sum + a.convertedLeads, 0);
      const totalRevenue = allocations.reduce((sum, a) => sum + a.attributedRevenueSar, 0);
      const totalSpend = allocations.reduce((sum, a) => sum + a.spendSar, 0);
      
      const cpl = safeDiv(totalSpend, totalLeads);
      const roas = safeDiv(totalRevenue, totalSpend);
      const convRate = safeDiv(totalConverted, totalLeads) * 100;
      
      const now = new Date();
      const start = new Date(campaign.startDate);
      const end = new Date(campaign.endDate);
      let status: 'active' | 'upcoming' | 'completed' = 'completed';
      if (now < start) status = 'upcoming';
      else if (now <= end) status = 'active';
      
      return {
        ...campaign,
        status,
        totalLeads,
        totalConverted,
        totalRevenue,
        totalSpend,
        cpl,
        roas,
        convRate,
      };
    });
  }, [yearData]);

  const renderKPICard = (title: string, value: string, subtitle?: string, color?: string) => (
    <View style={styles.kpiCard}>
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={[styles.kpiValue, color ? { color } : null]}>{value}</Text>
      {subtitle && <Text style={styles.kpiSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderYearSelector = () => (
    <View style={styles.yearSelectorContainer}>
      <TouchableOpacity 
        style={styles.yearSelector} 
        onPress={() => setYearDropdownOpen(!yearDropdownOpen)}
      >
        <Text style={styles.yearSelectorText}>{selectedYear}</Text>
        <ChevronDown size={20} color={LogiPointColors.white} />
      </TouchableOpacity>
      {yearDropdownOpen && (
        <View style={styles.yearDropdown}>
          {availableYears.map(year => (
            <TouchableOpacity 
              key={year} 
              style={[styles.yearOption, year === selectedYear && styles.yearOptionSelected]}
              onPress={() => {
                setSelectedYear(year);
                setYearDropdownOpen(false);
              }}
            >
              <Text style={[styles.yearOptionText, year === selectedYear && styles.yearOptionTextSelected]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderStackedBarChart = () => {
    const monthly = yearData.monthly || [];
    const width = Dimensions.get('window').width - 48;
    const height = 250;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const maxTotal = Math.max(...monthly.map(m => 
      Object.values(m.leadsByChannel).reduce((sum, v) => sum + v, 0)
    ), 1);
    
    const barWidth = chartWidth / 12 - 4;
    
    return (
      <Svg width={width} height={height}>
        {monthly.map((m, monthIdx) => {
          let yOffset = 0;
          const x = padding.left + monthIdx * (chartWidth / 12) + 2;
          
          return (
            <G key={monthIdx}>
              {MARKETING_CHANNELS.map((ch, chIdx) => {
                const value = m.leadsByChannel[ch];
                const barHeight = (value / maxTotal) * chartHeight;
                const y = padding.top + chartHeight - yOffset - barHeight;
                yOffset += barHeight;
                
                return (
                  <Rect
                    key={ch}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(barHeight, 0)}
                    fill={CHANNEL_COLORS[ch]}
                  />
                );
              })}
              <SvgText
                x={x + barWidth / 2}
                y={height - 10}
                fontSize={10}
                fill={LogiPointColors.beige}
                textAnchor="middle"
              >
                {MONTH_SHORT[monthIdx]}
              </SvgText>
            </G>
          );
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <G key={i}>
            <Line
              x1={padding.left}
              y1={padding.top + chartHeight * (1 - ratio)}
              x2={width - padding.right}
              y2={padding.top + chartHeight * (1 - ratio)}
              stroke={LogiPointColors.beige}
              strokeWidth={0.5}
              opacity={0.3}
            />
            <SvgText
              x={padding.left - 5}
              y={padding.top + chartHeight * (1 - ratio) + 4}
              fontSize={10}
              fill={LogiPointColors.beige}
              textAnchor="end"
            >
              {formatNumber(maxTotal * ratio)}
            </SvgText>
          </G>
        ))}
      </Svg>
    );
  };

  const renderChannelLegend = () => (
    <View style={styles.legendContainer}>
      {MARKETING_CHANNELS.map(ch => (
        <View key={ch} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: CHANNEL_COLORS[ch] }]} />
          <Text style={styles.legendText}>{CHANNEL_LABELS[ch]}</Text>
        </View>
      ))}
    </View>
  );

  const renderLeadSourcesTable = () => (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Channel</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Leads</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Spend (SAR)</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>CPL</Text>
      </View>
      {MARKETING_CHANNELS.map(ch => {
        const leads = leadsByChannelYTD[ch];
        const spend = spendByChannelYTD[ch];
        const cpl = safeDiv(spend, leads);
        
        return (
          <View key={ch} style={styles.tableRow}>
            <View style={[styles.tableCell, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
              <View style={[styles.channelDot, { backgroundColor: CHANNEL_COLORS[ch] }]} />
              <Text style={styles.tableCellText}>{CHANNEL_LABELS[ch]}</Text>
            </View>
            <Text style={[styles.tableCell, { flex: 1 }]}>{formatNumber(leads)}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{formatNumber(spend)}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{spend > 0 ? cpl.toFixed(0) : '-'}</Text>
          </View>
        );
      })}
    </View>
  );

  const renderCampaignTable = () => (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Campaign</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Leads</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Revenue</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>CPL</Text>
        <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ROAS</Text>
        {isAdmin && <Text style={[styles.tableHeaderCell, { width: 70 }]}>Actions</Text>}
      </View>
      {campaignKPIs.map((campaign, idx) => (
        <View key={campaign.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>{campaign.name}</Text>
          <View style={[styles.tableCell, { flex: 1 }]}>
            <View style={[styles.statusBadge, 
              campaign.status === 'active' && styles.statusActive,
              campaign.status === 'upcoming' && styles.statusUpcoming,
              campaign.status === 'completed' && styles.statusCompleted,
            ]}>
              <Text style={styles.statusText}>{campaign.status}</Text>
            </View>
          </View>
          <Text style={[styles.tableCell, { flex: 1 }]}>{campaign.totalLeads}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(campaign.totalRevenue)}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{campaign.totalSpend > 0 ? campaign.cpl.toFixed(0) : '-'}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>{campaign.totalSpend > 0 ? campaign.roas.toFixed(2) + 'x' : '-'}</Text>
          {isAdmin && (
            <View style={[styles.tableCell, { width: 70, flexDirection: 'row', gap: 8 }]}>
              <TouchableOpacity onPress={() => handleEditCampaign(idx)}>
                <Edit2 size={16} color={LogiPointColors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCampaign(idx)}>
                <Trash2 size={16} color={LogiPointColors.error} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddCampaign}>
          <Plus size={16} color={LogiPointColors.white} />
          <Text style={styles.addButtonText}>Add Campaign</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderGanttChart = () => {
    const campaigns = campaignKPIs;
    const width = Dimensions.get('window').width - 48;
    const rowHeight = 36;
    const height = Math.max(campaigns.length * rowHeight + 60, 150);
    const padding = { top: 30, right: 20, bottom: 20, left: 140 };
    const chartWidth = width - padding.left - padding.right;
    
    const yearStart = new Date(`${selectedYear}-01-01`);
    const yearEnd = new Date(`${selectedYear}-12-31`);
    const totalDays = 365;
    
    const getX = (dateStr: string) => {
      const date = new Date(dateStr);
      const dayOfYear = Math.floor((date.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
      return padding.left + (dayOfYear / totalDays) * chartWidth;
    };
    
    const getChannelColor = (channels: MarketingChannel[]) => {
      if (channels.includes('linkedinPaid') || channels.includes('linkedinOrganic')) return '#0077B5';
      if (channels.includes('instagramPaid') || channels.includes('instagramOrganic')) return '#E4405F';
      if (channels.includes('facebookPaid') || channels.includes('facebookOrganic')) return '#1877F2';
      return LogiPointColors.primary;
    };
    
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg width={Math.max(width, 600)} height={height}>
          {MONTH_SHORT.map((month, idx) => (
            <G key={month}>
              <Line
                x1={padding.left + (idx / 12) * chartWidth}
                y1={padding.top - 10}
                x2={padding.left + (idx / 12) * chartWidth}
                y2={height - padding.bottom}
                stroke={LogiPointColors.beige}
                strokeWidth={0.5}
                opacity={0.3}
              />
              <SvgText
                x={padding.left + (idx / 12) * chartWidth + chartWidth / 24}
                y={padding.top - 15}
                fontSize={10}
                fill={LogiPointColors.beige}
                textAnchor="middle"
              >
                {month}
              </SvgText>
            </G>
          ))}
          
          {campaigns.map((campaign, idx) => {
            const y = padding.top + idx * rowHeight;
            const startX = getX(campaign.startDate);
            const endX = getX(campaign.endDate);
            const barWidth = Math.max(endX - startX, 10);
            
            return (
              <G key={campaign.id}>
                <SvgText
                  x={padding.left - 5}
                  y={y + rowHeight / 2 + 4}
                  fontSize={10}
                  fill={LogiPointColors.white}
                  textAnchor="end"
                >
                  {campaign.name.length > 18 ? campaign.name.substring(0, 18) + '...' : campaign.name}
                </SvgText>
                <Rect
                  x={startX}
                  y={y + 8}
                  width={barWidth}
                  height={rowHeight - 16}
                  fill={getChannelColor(campaign.channels)}
                  rx={4}
                  opacity={campaign.status === 'completed' ? 0.6 : 1}
                />
              </G>
            );
          })}
        </Svg>
      </ScrollView>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderYearSelector()}
      
      <View style={styles.kpiGrid}>
        {renderKPICard('MTD Leads', formatNumber(kpis.mtdLeads), MONTHS[currentMonth])}
        {renderKPICard('YTD Leads', formatNumber(kpis.ytdLeads))}
        {renderKPICard('Conversion Rate', `${kpis.conversionRate.toFixed(1)}%`, 'of leads converted')}
        {renderKPICard('Converted Leads', formatNumber(kpis.ytdConverted), 'YTD')}
        {renderKPICard('Revenue', formatCurrency(kpis.ytdRevenue), 'from conversions', LogiPointColors.success)}
        {renderKPICard('Avg Rev/Lead', formatCurrency(kpis.avgRevenuePerLead))}
        {renderKPICard('Cost per Lead', `${kpis.costPerLead.toFixed(0)} SAR`, 'avg across paid', kpis.costPerLead > 500 ? LogiPointColors.warning : LogiPointColors.primary)}
        {renderKPICard('Active Campaigns', kpis.activeCampaigns.toString())}
      </View>
      
      <ChartCard title="Lead Sources by Channel" subtitle={`${selectedYear} YTD`}>
        {renderStackedBarChart()}
        {renderChannelLegend()}
      </ChartCard>
      
      <ChartCard title="Channel Performance" subtitle="YTD Summary">
        {renderLeadSourcesTable()}
      </ChartCard>
      
      <ChartCard title="Campaign Performance" subtitle={`${selectedYear} Campaigns`}>
        {renderCampaignTable()}
      </ChartCard>
      
      <ChartCard title="Campaign Timeline" subtitle={`${selectedYear} Gantt Chart`}>
        {renderGanttChart()}
      </ChartCard>

      <EditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSave}
        title={editField.startsWith('new_') ? 'Add Campaign' : 'Edit'}
        fields={editFields}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LogiPointColors.midnight,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  yearSelectorContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
    zIndex: 100,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LogiPointColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  yearSelectorText: {
    color: LogiPointColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  yearDropdown: {
    position: 'absolute',
    top: 44,
    left: 0,
    backgroundColor: LogiPointColors.gray[800],
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  yearOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  yearOptionSelected: {
    backgroundColor: LogiPointColors.primary,
  },
  yearOptionText: {
    color: LogiPointColors.white,
    fontSize: 14,
  },
  yearOptionTextSelected: {
    fontWeight: '600',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  kpiCard: {
    backgroundColor: LogiPointColors.gray[800],
    borderRadius: 12,
    padding: 16,
    minWidth: '47%',
    flex: 1,
  },
  kpiTitle: {
    color: LogiPointColors.beige,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  kpiValue: {
    color: LogiPointColors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  kpiSubtitle: {
    color: LogiPointColors.beige,
    fontSize: 11,
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    color: LogiPointColors.beige,
    fontSize: 11,
  },
  tableContainer: {
    backgroundColor: LogiPointColors.gray[900],
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: LogiPointColors.gray[800],
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    color: LogiPointColors.beige,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: LogiPointColors.gray[800],
  },
  tableCell: {
    color: LogiPointColors.white,
    fontSize: 12,
  },
  tableCellText: {
    color: LogiPointColors.white,
    fontSize: 12,
  },
  channelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusActive: {
    backgroundColor: LogiPointColors.success,
  },
  statusUpcoming: {
    backgroundColor: LogiPointColors.warning,
  },
  statusCompleted: {
    backgroundColor: LogiPointColors.gray[600],
  },
  statusText: {
    color: LogiPointColors.white,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    backgroundColor: LogiPointColors.primary,
    marginTop: 8,
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  addButtonText: {
    color: LogiPointColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
