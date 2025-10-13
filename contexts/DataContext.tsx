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
};

export const [DataProvider, useData] = createContextHook(() => {
  const [salesData, setSalesData] = useState<SalesData>(mockSalesData);
  const [riskData, setRiskData] = useState<RiskData>(mockRiskData);
  const [contractData, setContractData] = useState<ContractData>(mockContractData);
  const [realEstateData, setRealEstateData] = useState<RealEstateData>(mockRealEstateData);
  const [logisticsData, setLogisticsData] = useState<LogisticsData>(mockLogisticsData);
  const [warehouseData, setWarehouseData] = useState<WarehouseData>(mockWarehouseData);
  const [vasData, setVasData] = useState<VASData>(mockVASData);
  const [poData, setPoData] = useState<POData>(mockPOData);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = useCallback(async () => {
    try {
      const [sales, risks, contracts, realEstate, logistics, warehouse, vas, po] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.sales),
        AsyncStorage.getItem(STORAGE_KEYS.risks),
        AsyncStorage.getItem(STORAGE_KEYS.contracts),
        AsyncStorage.getItem(STORAGE_KEYS.realEstate),
        AsyncStorage.getItem(STORAGE_KEYS.logistics),
        AsyncStorage.getItem(STORAGE_KEYS.warehouse),
        AsyncStorage.getItem(STORAGE_KEYS.vas),
        AsyncStorage.getItem(STORAGE_KEYS.po),
      ]);

      if (sales) {
        const parsedSales = JSON.parse(sales);
        setSalesData({
          ...mockSalesData,
          ...parsedSales,
          quarterlyTargets: parsedSales.quarterlyTargets || mockSalesData.quarterlyTargets,
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
    await AsyncStorage.setItem(STORAGE_KEYS.realEstate, JSON.stringify(data));
  }, []);

  const updateVasData = useCallback(async (data: VASData) => {
    setVasData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.vas, JSON.stringify(data));
  }, []);

  const updatePoData = useCallback(async (data: POData) => {
    setPoData(data);
    await AsyncStorage.setItem(STORAGE_KEYS.po, JSON.stringify(data));
  }, []);

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
    ]
  );
});
