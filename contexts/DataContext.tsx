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

export interface LastUpdatedData {
  [cardKey: string]: string;
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

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        salesResult,
        risksResult,
        contractsResult,
        realEstateResult,
        logisticsResult,
        warehouseResult,
        vasResult,
        poResult,
      ] = await Promise.all([
        supabase.from('sales').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('risks').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('contracts').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('real_estate').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('logistics').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('warehouse').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('vas').select('*').order('id', { ascending: false }).limit(1).single(),
        supabase.from('po').select('*').order('id', { ascending: false }).limit(1).single(),
      ]);

      if (salesResult.data?.data) {
        setSalesData(salesResult.data.data);
      } else {
        console.log('⚠️ No Supabase sales data, using mock');
      }

      if (risksResult.data?.data) {
        setRiskData(risksResult.data.data);
      }

      if (contractsResult.data?.data) {
        setContractData(contractsResult.data.data);
      }

      if (realEstateResult.data?.data) {
        setRealEstateData(realEstateResult.data.data);
      }

      if (logisticsResult.data?.data) {
        setLogisticsData(logisticsResult.data.data);
      }

      if (warehouseResult.data?.data) {
        setWarehouseData(warehouseResult.data.data);
      }

      if (vasResult.data?.data) {
        setVasData(vasResult.data.data);
      }

      if (poResult.data?.data) {
        setPoData(poResult.data.data);
      }

      const lastUpdatedResult = await supabase.from('last_updated').select('*');
      if (lastUpdatedResult.data) {
        const lastUpdatedMap: LastUpdatedData = {};
        lastUpdatedResult.data.forEach((row: any) => {
          lastUpdatedMap[row.card_key] = row.timestamp;
        });
        setLastUpdated(lastUpdatedMap);
      }
    } catch (error) {
      console.error('[DataContext] Failed to load data from Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);



  const updateSalesData = useCallback(async (data: SalesData) => {
    try {
      console.log('[DataContext] Updating sales data to Supabase...', { data });
      setSalesData(data);
      const payload = { id: 1, data, updated_at: new Date().toISOString() };
      console.log('[DataContext] Upsert payload:', payload);
      
      const { data: result, error } = await supabase
        .from('sales')
        .upsert(payload)
        .select();
      
      console.log('[DataContext] Supabase response:', { result, error });
      
      if (error) {
        console.error('[DataContext] Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }
      
      console.log('[DataContext] Sales data updated successfully in Supabase');
    } catch (error: any) {
      console.error('[DataContext] Failed to update sales data:', error);
      console.error('[DataContext] Error type:', typeof error);
      console.error('[DataContext] Error keys:', Object.keys(error || {}));
      throw error;
    }
  }, []);

  const updateRiskData = useCallback(async (data: RiskData) => {
    try {
      setRiskData(data);
      const { error } = await supabase
        .from('risks')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update risk data:', error);
      throw error;
    }
  }, []);

  const updateContractData = useCallback(async (data: ContractData) => {
    try {
      setContractData(data);
      const { error } = await supabase
        .from('contracts')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update contract data:', error);
      throw error;
    }
  }, []);

  const updateLogisticsData = useCallback(async (data: LogisticsData) => {
    try {
      setLogisticsData(data);
      const { error } = await supabase
        .from('logistics')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update logistics data:', error);
      throw error;
    }
  }, []);

  const updateWarehouseData = useCallback(async (data: WarehouseData) => {
    try {
      setWarehouseData(data);
      const { error } = await supabase
        .from('warehouse')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update warehouse data:', error);
      throw error;
    }
  }, []);

  const updateRealEstateData = useCallback(async (data: RealEstateData) => {
    try {
      setRealEstateData(data);
      const { error } = await supabase
        .from('real_estate')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update real estate data:', error);
      throw error;
    }
  }, []);

  const updateVasData = useCallback(async (data: VASData) => {
    try {
      setVasData(data);
      const { error } = await supabase
        .from('vas')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update VAS data:', error);
      throw error;
    }
  }, []);

  const updatePoData = useCallback(async (data: POData) => {
    try {
      setPoData(data);
      const { error } = await supabase
        .from('po')
        .upsert({ id: 1, data, updated_at: new Date().toISOString() });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to update PO data:', error);
      throw error;
    }
  }, []);

  const updateLastUpdated = useCallback(async (cardKey: string, value: string) => {
    try {
      setLastUpdated(prev => ({ ...prev, [cardKey]: value }));
      const { error } = await supabase
        .from('last_updated')
        .upsert({ card_key: cardKey, timestamp: value });
      if (error) throw error;
    } catch (error) {
      console.error('[DataContext] Failed to save last updated:', error);
    }
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
