import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import {
  SalesData,
  RiskData,
  RealEstateData,
  LogisticsData,
  WarehouseData,
  VASData,
  POData,
  MarketingData,
  mockSalesData,
  mockRiskData,
  mockRealEstateData,
  mockLogisticsData,
  mockWarehouseData,
  mockVASData,
  mockPOData,
  mockMarketingData,
} from '@/mocks/dashboardData';
import { supabase } from '../supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  saveSalesData,
  saveRisksData,
  saveRealEstateData,
  saveLogisticsData,
  saveWarehouseData,
  saveVasData,
  savePoData,
  saveMarketingData,
  updateCardTimestamp as saveCardTimestamp,
} from '../lib/adminSave';

export interface LastUpdatedData {
  [cardKey: string]: string;
}

// Helper: Map snake_case database columns to camelCase TypeScript
function mapDbToUi<T>(dbRow: any, fallback: T): T {
  if (!dbRow) return fallback;

  const mapped: any = {};

  // Map all snake_case keys to camelCase, but SKIP null/undefined/empty values
  // This preserves the fallback structure when Supabase JSONB fields are empty
  Object.keys(dbRow).forEach((key) => {
    const value = dbRow[key];
    
    // Skip null, undefined, empty objects, empty arrays, and metadata fields
    if (
      value === null || 
      value === undefined || 
      key === 'id' || 
      key === 'created_at' || 
      key === 'updated_at' ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) || // Empty object {}
      (Array.isArray(value) && value.length === 0) // Empty array []
    ) {
      return;
    }
    
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    mapped[camelKey] = value;
  });

  return { ...fallback, ...mapped };
}

export const [DataProvider, useData] = createContextHook(() => {
  const [salesData, setSalesData] = useState<SalesData>(mockSalesData);
  const [riskData, setRiskData] = useState<RiskData>(mockRiskData);
  const [realEstateData, setRealEstateData] = useState<RealEstateData>(mockRealEstateData);
  const [logisticsData, setLogisticsData] = useState<LogisticsData>(mockLogisticsData);
  const [warehouseData, setWarehouseData] = useState<WarehouseData>(mockWarehouseData);
  const [vasData, setVasData] = useState<VASData>(mockVASData);
  const [poData, setPoData] = useState<POData>(mockPOData);
  const [marketingData, setMarketingData] = useState<MarketingData>(mockMarketingData);
  const [lastUpdated, setLastUpdated] = useState<LastUpdatedData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch individual table data
  const fetchSalesData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('sales').select('*').single();
      if (error) throw error;
      console.log('📊 Raw Supabase sales data:', data);
      const mapped = mapDbToUi<SalesData>(data, mockSalesData);
      console.log('📊 Mapped sales data:', mapped);
      console.log('📊 Has revenueBySegmentMonthly?', mapped.revenueBySegmentMonthly);
      setSalesData(mapped);
      console.log('✅ Loaded sales from Supabase');
    } catch (err) {
      console.warn('⚠️ Sales fetch failed, using mock data:', err);
      setSalesData(mockSalesData);
    }
  }, []);

  const fetchRisksData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('risks').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<RiskData>(data, mockRiskData);
      setRiskData(mapped);
      console.log('✅ Loaded risks from Supabase');
    } catch (err) {
      console.warn('⚠️ Risks fetch failed, using mock data:', err);
      setRiskData(mockRiskData);
    }
  }, []);

  const fetchRealEstateData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('real_estate').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<RealEstateData>(data, mockRealEstateData);
      setRealEstateData(mapped);
      console.log('✅ Loaded real_estate from Supabase');
    } catch (err) {
      console.warn('⚠️ Real estate fetch failed, using mock data:', err);
      setRealEstateData(mockRealEstateData);
    }
  }, []);

  const fetchLogisticsData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('logistics').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<LogisticsData>(data, mockLogisticsData);
      setLogisticsData(mapped);
      console.log('✅ Loaded logistics from Supabase');
    } catch (err) {
      console.warn('⚠️ Logistics fetch failed, using mock data:', err);
      setLogisticsData(mockLogisticsData);
    }
  }, []);

  const fetchWarehouseData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('warehouse').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<WarehouseData>(data, mockWarehouseData);
      setWarehouseData(mapped);
      console.log('✅ Loaded warehouse from Supabase');
    } catch (err) {
      console.warn('⚠️ Warehouse fetch failed, using mock data:', err);
      setWarehouseData(mockWarehouseData);
    }
  }, []);

  const fetchVasData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('vas').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<VASData>(data, mockVASData);
      setVasData(mapped);
      console.log('✅ Loaded vas from Supabase');
    } catch (err) {
      console.warn('⚠️ VAS fetch failed, using mock data:', err);
      setVasData(mockVASData);
    }
  }, []);

  const fetchPoData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('po').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<POData>(data, mockPOData);
      setPoData(mapped);
      console.log('✅ Loaded po from Supabase');
    } catch (err) {
      console.warn('⚠️ PO fetch failed, using mock data:', err);
      setPoData(mockPOData);
    }
  }, []);

  const fetchMarketingData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('marketing').select('*').single();
      if (error) throw error;
      const mapped = mapDbToUi<MarketingData>(data, mockMarketingData);
      setMarketingData(mapped);
      console.log('✅ Loaded marketing from Supabase');
    } catch (err) {
      console.warn('⚠️ Marketing fetch failed, using mock data:', err);
      setMarketingData(mockMarketingData);
    }
  }, []);

  const fetchLastUpdatedData = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('last_updated').select('*').single();
      if (error) throw error;
      setLastUpdated(data?.timestamps || {});
      console.log('✅ Loaded last_updated from Supabase');
    } catch (err) {
      console.warn('⚠️ Last updated fetch failed, using empty object:', err);
      setLastUpdated({});
    }
  }, []);

  // Load all data on mount
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchSalesData(),
        fetchRisksData(),
        fetchRealEstateData(),
        fetchLogisticsData(),
        fetchWarehouseData(),
        fetchVasData(),
        fetchPoData(),
        fetchMarketingData(),
        fetchLastUpdatedData(),
      ]);
      console.log('✅ All data loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchSalesData,
    fetchRisksData,
    fetchRealEstateData,
    fetchLogisticsData,
    fetchWarehouseData,
    fetchVasData,
    fetchPoData,
    fetchMarketingData,
    fetchLastUpdatedData,
  ]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Realtime subscriptions
  useEffect(() => {
    const channels: RealtimeChannel[] = [];

    // Sales subscription
    const salesChannel = supabase
      .channel('sales-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sales' }, () => {
        console.log('🔄 Sales updated - refetching');
        fetchSalesData();
      })
      .subscribe();
    channels.push(salesChannel);

    // Risks subscription
    const risksChannel = supabase
      .channel('risks-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'risks' }, () => {
        console.log('🔄 Risks updated - refetching');
        fetchRisksData();
      })
      .subscribe();
    channels.push(risksChannel);

    // Real estate subscription
    const realEstateChannel = supabase
      .channel('real-estate-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'real_estate' }, () => {
        console.log('🔄 Real estate updated - refetching');
        fetchRealEstateData();
      })
      .subscribe();
    channels.push(realEstateChannel);

    // Logistics subscription
    const logisticsChannel = supabase
      .channel('logistics-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'logistics' }, () => {
        console.log('🔄 Logistics updated - refetching');
        fetchLogisticsData();
      })
      .subscribe();
    channels.push(logisticsChannel);

    // Warehouse subscription
    const warehouseChannel = supabase
      .channel('warehouse-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'warehouse' }, () => {
        console.log('🔄 Warehouse updated - refetching');
        fetchWarehouseData();
      })
      .subscribe();
    channels.push(warehouseChannel);

    // VAS subscription
    const vasChannel = supabase
      .channel('vas-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vas' }, () => {
        console.log('🔄 VAS updated - refetching');
        fetchVasData();
      })
      .subscribe();
    channels.push(vasChannel);

    // PO subscription
    const poChannel = supabase
      .channel('po-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'po' }, () => {
        console.log('🔄 PO updated - refetching');
        fetchPoData();
      })
      .subscribe();
    channels.push(poChannel);

    // Marketing subscription
    const marketingChannel = supabase
      .channel('marketing-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'marketing' }, () => {
        console.log('🔄 Marketing updated - refetching');
        fetchMarketingData();
      })
      .subscribe();
    channels.push(marketingChannel);

    // Last updated subscription
    const lastUpdatedChannel = supabase
      .channel('last-updated-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'last_updated' }, () => {
        console.log('🔄 Last updated - refetching');
        fetchLastUpdatedData();
      })
      .subscribe();
    channels.push(lastUpdatedChannel);

    console.log('✅ Realtime subscriptions active for all 9 tables');

    // Cleanup on unmount
    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      console.log('🔌 Realtime subscriptions cleaned up');
    };
  }, [
    fetchSalesData,
    fetchRisksData,
    fetchRealEstateData,
    fetchLogisticsData,
    fetchWarehouseData,
    fetchVasData,
    fetchPoData,
    fetchMarketingData,
    fetchLastUpdatedData,
  ]);

  // Update functions (will be replaced with adminSave helper later)
  // For now, keep them for backwards compatibility with existing admin screens
  const updateSalesData = useCallback(async (data: SalesData) => {
    try {
      setSalesData(data);
      await saveSalesData(data);
      console.log('[DataContext] updateSalesData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update sales data:', error);
      throw error;
    }
  }, []);

  const updateRiskData = useCallback(async (data: RiskData) => {
    try {
      setRiskData(data);
      await saveRisksData(data);
      console.log('[DataContext] updateRiskData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update risk data:', error);
      throw error;
    }
  }, []);

  const updateLogisticsData = useCallback(async (data: LogisticsData) => {
    try {
      setLogisticsData(data);
      await saveLogisticsData(data);
      console.log('[DataContext] updateLogisticsData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update logistics data:', error);
      throw error;
    }
  }, []);

  const updateWarehouseData = useCallback(async (data: WarehouseData) => {
    try {
      setWarehouseData(data);
      await saveWarehouseData(data);
      console.log('[DataContext] updateWarehouseData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update warehouse data:', error);
      throw error;
    }
  }, []);

  const updateRealEstateData = useCallback(async (data: RealEstateData) => {
    try {
      setRealEstateData(data);
      await saveRealEstateData(data);
      console.log('[DataContext] updateRealEstateData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update real estate data:', error);
      throw error;
    }
  }, []);

  const updateVasData = useCallback(async (data: VASData) => {
    try {
      setVasData(data);
      await saveVasData(data);
      console.log('[DataContext] updateVasData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update VAS data:', error);
      throw error;
    }
  }, []);

  const updatePoData = useCallback(async (data: POData) => {
    try {
      setPoData(data);
      await savePoData(data);
      console.log('[DataContext] updatePoData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update PO data:', error);
      throw error;
    }
  }, []);

  const updateMarketingData = useCallback(async (data: MarketingData) => {
    try {
      setMarketingData(data);
      await saveMarketingData(data);
      console.log('[DataContext] updateMarketingData - saved to Supabase');
    } catch (error) {
      console.error('[DataContext] Failed to update marketing data:', error);
      throw error;
    }
  }, []);

  const updateLastUpdated = useCallback(async (cardKey: string, value: string) => {
    setLastUpdated(prev => {
      const updated = { ...prev, [cardKey]: value };
      console.log('[DataContext] updateLastUpdated called - pending adminSave integration');
      return updated;
    });
  }, []);

  const updateCardTimestamp = useCallback(async (cardKey: string, timestamp: string) => {
    // Capture the previous value for rollback on error
    const previousTimestamp = lastUpdated[cardKey];
    
    try {
      // Update local state immediately for UI responsiveness (optimistic update)
      setLastUpdated(prev => ({ ...prev, [cardKey]: timestamp }));
      
      // Save to Supabase - realtime subscriptions will propagate to other users
      const result = await saveCardTimestamp(cardKey, timestamp);
      
      if (!result.success) {
        // Restore previous value on error
        setLastUpdated(prev => ({ ...prev, [cardKey]: previousTimestamp }));
        throw new Error(result.error || 'Failed to update timestamp');
      }
      
      console.log(`✅ [DataContext] Updated ${cardKey} timestamp to ${timestamp}`);
    } catch (error) {
      console.error('[DataContext] Failed to update card timestamp:', error);
      // Ensure previous value is restored
      setLastUpdated(prev => ({ ...prev, [cardKey]: previousTimestamp }));
      throw error;
    }
  }, [lastUpdated]);

  const getLastUpdated = useCallback((cardKey: string) => {
    return lastUpdated[cardKey] || '';
  }, [lastUpdated]);

  return useMemo(
    () => ({
      salesData,
      riskData,
      realEstateData,
      logisticsData,
      warehouseData,
      vasData,
      poData,
      marketingData,
      isLoading,
      error,
      updateSalesData,
      updateRiskData,
      updateRealEstateData,
      updateLogisticsData,
      updateWarehouseData,
      updateVasData,
      updatePoData,
      updateMarketingData,
      lastUpdated,
      updateLastUpdated,
      updateCardTimestamp,
      getLastUpdated,
    }),
    [
      salesData,
      riskData,
      realEstateData,
      logisticsData,
      warehouseData,
      vasData,
      poData,
      marketingData,
      isLoading,
      error,
      updateSalesData,
      updateRiskData,
      updateRealEstateData,
      updateLogisticsData,
      updateWarehouseData,
      updateVasData,
      updatePoData,
      updateMarketingData,
      lastUpdated,
      updateLastUpdated,
      updateCardTimestamp,
      getLastUpdated,
    ],
  );
});
