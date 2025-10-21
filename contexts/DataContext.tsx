import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const STORAGE_KEYS = {
  sales: '@logipoint_sales',
  risks: '@logipoint_risks',
  contracts: '@logipoint_contracts',
  realEstate: '@logipoint_realestate',
  logistics: '@logipoint_logistics',
  warehouse: '@logipoint_warehouse',
  vas: '@logipoint_vas',
  po: '@logipoint_po',
  lastUpdated: '@logipoint_last_updated',
};

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
    try {
      const [sales, risks, contracts, realEstate, logistics, warehouse, vas, po, lastUpdatedStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.sales),
        AsyncStorage.getItem(STORAGE_KEYS.risks),
        AsyncStorage.getItem(STORAGE_KEYS.contracts),
        AsyncStorage.getItem(STORAGE_KEYS.realEstate),
        AsyncStorage.getItem(STORAGE_KEYS.logistics),
        AsyncStorage.getItem(STORAGE_KEYS.warehouse),
        AsyncStorage.getItem(STORAGE_KEYS.vas),
        AsyncStorage.getItem(STORAGE_KEYS.po),
        AsyncStorage.getItem(STORAGE_KEYS.lastUpdated),
      ]);

      if (sales) {
        const parsedSales = JSON.parse(sales);
        setSalesData({
          ...mockSalesData,
          ...parsedSales,
          quarterlyTargets: parsedSales.quarterlyTargets || mockSalesData.quarterlyTargets,
          quarterlyLabelling: {
            q1: { ...mockSalesData.quarterlyLabelling.q1, ...parsedSales.quarterlyLabelling?.q1 },
            q2: { ...mockSalesData.quarterlyLabelling.q2, ...parsedSales.quarterlyLabelling?.q2 },
            q3: { ...mockSalesData.quarterlyLabelling.q3, ...parsedSales.quarterlyLabelling?.q3 },
            q4: { ...mockSalesData.quarterlyLabelling.q4, ...parsedSales.quarterlyLabelling?.q4 },
          },
        });
      }
      if (risks) setRiskData(JSON.parse(risks));
      if (contracts) setContractData(JSON.parse(contracts));
      if (realEstate) {
        const parsedRealEstate = JSON.parse(realEstate);
        setRealEstateData({
          ...mockRealEstateData,
          ...parsedRealEstate,
          parking: parsedRealEstate.parking || mockRealEstateData.parking,
        });
      }
      if (logistics) setLogisticsData(JSON.parse(logistics));
      if (warehouse) setWarehouseData(JSON.parse(warehouse));
      if (vas) setVasData(JSON.parse(vas));
      if (po) setPoData(JSON.parse(po));
      if (lastUpdatedStr) setLastUpdated(JSON.parse(lastUpdatedStr));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);



  const updateSalesData = useCallback(async (data: SalesData) => {
    setSalesData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(data));
  }, []);

  const updateRiskData = useCallback(async (data: RiskData) => {
    setRiskData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.risks, JSON.stringify(data));
  }, []);

  const updateContractData = useCallback(async (data: ContractData) => {
    setContractData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(data));
  }, []);

  const updateLogisticsData = useCallback(async (data: LogisticsData) => {
    setLogisticsData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.logistics, JSON.stringify(data));
  }, []);

  const updateWarehouseData = useCallback(async (data: WarehouseData) => {
    setWarehouseData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.warehouse, JSON.stringify(data));
  }, []);

  const updateRealEstateData = useCallback(async (data: RealEstateData) => {
    setRealEstateData(data);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.realEstate, JSON.stringify(data));
    } catch (error: unknown) {
      if (error instanceof Error && (error.message.includes('quota') || error.message.includes('QuotaExceededError'))) {
        console.error('Storage quota exceeded. Data too large to save.');
        throw new Error('Storage quota exceeded. Images are too large. Please use smaller images.');
      }
      throw error;
    }
  }, []);

  const updateVasData = useCallback(async (data: VASData) => {
    setVasData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.vas, JSON.stringify(data));
  }, []);

  const updatePoData = useCallback(async (data: POData) => {
    setPoData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.po, JSON.stringify(data));
  }, []);

  const updateLastUpdated = useCallback(async (cardKey: string, value: string) => {
    setLastUpdated(prev => {
      const updated = { ...prev, [cardKey]: value };
      AsyncStorage.setItem(STORAGE_KEYS.lastUpdated, JSON.stringify(updated));
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
