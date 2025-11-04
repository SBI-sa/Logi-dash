import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import {
  SalesData,
  RiskData,
  ContractData,
  RealEstateData,
  LogisticsData,
  WarehouseData,
  VASData,
  POData,
  mockSalesData,
  mockRiskData,
  mockContractData,
  mockRealEstateData,
  mockLogisticsData,
  mockWarehouseData,
  mockVASData,
  mockPOData,
} from '@/mocks/dashboardData';
import { supabase } from '../supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const [contractData, setContractData] = useState<ContractData>(mockContractData);
  const [realEstateData, setRealEstateData] = useState<RealEstateData>(mockRealEstateData);
  const [logisticsData, setLogisticsData] = useState<LogisticsData>(mockLogisticsData);
  const [warehouseData, setWarehouseData] = useState<WarehouseData>(mockWarehouseData);
  const [vasData, setVasData] = useState<VASData>(mockVASData);
  const [poData, setPoData] = useState<POData>(mockPOData);
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

  const fetchContractsData = useCallback(async () => {
    // TODO: Re-enable when 'contracts' table is created in Supabase
    // Currently using mock data only
    setContractData(mockContractData);
    console.log('✅ Loaded contracts (using mock data)');
  }, []);

  const fetchRealEstateData = useCallback(async () => {
    // TODO: Re-enable when 'real_estate' table is created in Supabase
    // Currently using mock data only
    setRealEstateData(mockRealEstateData);
    console.log('✅ Loaded real_estate (using mock data)');
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
        fetchContractsData(),
        fetchRealEstateData(),
        fetchLogisticsData(),
        fetchWarehouseData(),
        fetchVasData(),
        fetchPoData(),
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
    fetchContractsData,
    fetchRealEstateData,
    fetchLogisticsData,
    fetchWarehouseData,
    fetchVasData,
    fetchPoData,
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

    // TODO: Re-enable when Supabase tables are created
    // Contracts subscription (currently disabled - table doesn't exist)
    // const contractsChannel = supabase
    //   .channel('contracts-updates')
    //   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contracts' }, () => {
    //     console.log('🔄 Contracts updated - refetching');
    //     fetchContractsData();
    //   })
    //   .subscribe();
    // channels.push(contractsChannel);

    // Real estate subscription (currently disabled - table doesn't exist)
    // const realEstateChannel = supabase
    //   .channel('real-estate-updates')
    //   .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'real_estate' }, () => {
    //     console.log('🔄 Real estate updated - refetching');
    //     fetchRealEstateData();
    //   })
    //   .subscribe();
    // channels.push(realEstateChannel);

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

    // Last updated subscription
    const lastUpdatedChannel = supabase
      .channel('last-updated-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'last_updated' }, () => {
        console.log('🔄 Last updated - refetching');
        fetchLastUpdatedData();
      })
      .subscribe();
    channels.push(lastUpdatedChannel);

    console.log('✅ Realtime subscriptions active for all 7 tables');

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
    fetchContractsData,
    fetchRealEstateData,
    fetchLogisticsData,
    fetchWarehouseData,
    fetchVasData,
    fetchPoData,
    fetchLastUpdatedData,
  ]);

  // Update functions (will be replaced with adminSave helper later)
  // For now, keep them for backwards compatibility with existing admin screens
  const updateSalesData = useCallback(async (data: SalesData) => {
    try {
      setSalesData(data);
      // TODO: Replace with adminSave helper
      console.log('[DataContext] updateSalesData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update sales data:', error);
      throw error;
    }
  }, []);

  const updateRiskData = useCallback(async (data: RiskData) => {
    try {
      setRiskData(data);
      console.log('[DataContext] updateRiskData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update risk data:', error);
      throw error;
    }
  }, []);

  const updateContractData = useCallback(async (data: ContractData) => {
    try {
      setContractData(data);
      console.log('[DataContext] updateContractData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update contract data:', error);
      throw error;
    }
  }, []);

  const updateLogisticsData = useCallback(async (data: LogisticsData) => {
    try {
      setLogisticsData(data);
      console.log('[DataContext] updateLogisticsData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update logistics data:', error);
      throw error;
    }
  }, []);

  const updateWarehouseData = useCallback(async (data: WarehouseData) => {
    try {
      setWarehouseData(data);
      console.log('[DataContext] updateWarehouseData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update warehouse data:', error);
      throw error;
    }
  }, []);

  const updateRealEstateData = useCallback(async (data: RealEstateData) => {
    try {
      setRealEstateData(data);
      console.log('[DataContext] updateRealEstateData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update real estate data:', error);
      throw error;
    }
  }, []);

  const updateVasData = useCallback(async (data: VASData) => {
    try {
      setVasData(data);
      console.log('[DataContext] updateVasData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update VAS data:', error);
      throw error;
    }
  }, []);

  const updatePoData = useCallback(async (data: POData) => {
    try {
      setPoData(data);
      console.log('[DataContext] updatePoData called - pending adminSave integration');
    } catch (error) {
      console.error('[DataContext] Failed to update PO data:', error);
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

  const getLastUpdated = useCallback((cardKey: string) => {
    return lastUpdated[cardKey] || '';
  }, [lastUpdated]);

  return useMemo(
    () => ({
      salesData,
      riskData,
      contractData,
      realEstateData,
      logisticsData,
      warehouseData,
      vasData,
      poData,
      isLoading,
      error,
      updateSalesData,
      updateRiskData,
      updateContractData,
      updateRealEstateData,
      updateLogisticsData,
      updateWarehouseData,
      updateVasData,
      updatePoData,
      lastUpdated,
      updateLastUpdated,
      getLastUpdated,
    }),
    [
      salesData,
      riskData,
      contractData,
      realEstateData,
      logisticsData,
      warehouseData,
      vasData,
      poData,
      isLoading,
      error,
      updateSalesData,
      updateRiskData,
      updateContractData,
      updateRealEstateData,
      updateLogisticsData,
      updateWarehouseData,
      updateVasData,
      updatePoData,
      lastUpdated,
      updateLastUpdated,
      getLastUpdated,
    ]
  );
});
