export interface SalesData {
  totalRevenue: number;
  lastYearYtdRevenue: number;
  mtdRevenue: number;
  ytdRevenue: number;
  mtdBudget: number;
  ytdBudget: number;
  revenueTarget: number;
  growthPercentage: number;
  totalRevenueColor?: string;
  revenueTargetColor?: string;
  quarterlyTargets: {
    q1: { current: number; target: number; color?: string };
    q2: { current: number; target: number; color?: string };
    q3: { current: number; target: number; color?: string };
    q4: { current: number; target: number; color?: string };
  };
  topProducts: { name: string; sales: number }[];
  topCustomers: { name: string; sales: number; color: string }[];
  topCustomersMonthly: { [month: string]: { name: string; sales: number; color: string }[] };
  revenueBySegment: { segment: string; revenue: number; lastYearRevenue?: number; color?: string }[];
  revenueBySegmentMonthly: { [month: string]: { segment: string; revenue: number; lastYearRevenue?: number; color?: string }[] };
  monthlyTrend: { month: string; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number; budget: number; lastYearRevenue?: number; revenueColor?: string; budgetColor?: string; lastYearColor?: string }[];
  accountManagers: { name: string; revenue: number; budget: number; color?: string }[];
}

export interface RiskData {
  totalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  mitigatedPercentage: number;
  mitigatedRisksCount: number;
  totalRisksForMitigation: number;
  risksByDepartment: { department: string; count: number; color: string }[];
  riskHeatmap: { name: string; probability: number; impact: number; level: 'high' | 'medium' | 'low'; risksClosed?: number }[];
  risksAddressedDate: string;
}

export interface ContractData {
  expiringThisMonth: number;
  expiringThisQuarter: number;
  totalContracts: number;
  contracts: {
    id: string;
    client: string;
    value: number;
    expiryDate: string;
    daysUntilExpiry: number;
    status: 'active' | 'expiring-soon' | 'expired';
    renewalStatus: 'pending' | 'in-progress' | 'renewed';
  }[];
}

export interface ParkingData {
  availableSpaces: number;
  rentedSpaces: number;
  occupancyRate: number;
  averageRate: number;
  lastRate: number;
  nextEndingContract: string;
  nextEndingContractSpaces: number;
}

export interface RealEstateData {
  jipTotalCapacity: number;
  jipOccupiedLand: number;
  jipOccupancyPercentage: number;
  jipAverageRate: number;
  parking: ParkingData;
  lands: {
    id: string;
    clientName: string;
    currentRate: number;
    nextEscalationDate: string;
    escalationPercentage: number;
    landSize: number;
    contractEndYear: number;
    averageRate: number;
    bonded?: 'Bonded' | 'Non-Bonded';
  }[];
  landImageUri?: string;
  jlhImageUri?: string;
  additionalImages?: { id: string; uri: string; label: string }[];
}

export interface LogisticsData {
  onTimeDeliveryRate: number;
  averageDeliveryTime: number;
  transportationCostPerShipment: number;
  activeShipments: number;
  delayedShipments: number;
  utilizationRate: number;
  fleetUtilization: number;
  trucks: number;
  drivers: number;
  tripsInProgress: number;
  tripsCompleted: number;
  tripsPending: number;
  tripsTransporters: number;
  deliveryPerformance: { month: string; onTimeRate: number }[];
  delaysByRoute: { route: string; delays: number; trips: number }[];
  thresholds: {
    green: number;
    yellow: number;
  };
  tripCategories: { name: string; value: number }[];
  tripCategoriesMonthly: { [month: string]: { name: string; value: number }[] };
}

export interface WarehouseData {
  currentOccupancy: number;
  capacity: number;
  occupancyPercentage: number;
  inboundShipments: number;
  outboundShipments: number;
  inventoryTurnover: number;
  averageDaysInStorage: number;
  occupancyByZone: { zone: string; occupancy: number; capacity: number; color?: string; emptyWH?: number; whName?: string; sqmPerWH?: number }[];
  occupancyTrend: { month: string; occupancy: number }[];
  allocationImageUri?: string;
}

export interface VASData {
  deliveryTotal: {
    year: string;
    current: number;
    previous: number;
    percentageChange: number;
    color?: string;
  };
  labellingTotal: {
    year: string;
    current: number;
    previous: number;
    percentageChange: number;
    color?: string;
  };
  top5Clients: { name: string; year2024: number; year2025: number; color?: string }[];
  labellingQuarterly: {
    q1: { current: number; lastYear: number; color?: string };
    q2: { current: number; lastYear: number; color?: string };
    q3: { current: number; lastYear: number; color?: string };
    q4: { current: number; lastYear: number; color?: string };
  };
  deliveryQuarterly: {
    q1: { current: number; lastYear: number; color?: string };
    q2: { current: number; lastYear: number; color?: string };
    q3: { current: number; lastYear: number; color?: string };
    q4: { current: number; lastYear: number; color?: string };
  };
}

export interface POData {
  fclQuarterly: {
    q1: { units: number; color?: string };
    q2: { units: number; color?: string };
    q3: { units: number; color?: string };
    q4: { units: number; color?: string };
  };
  lclQuarterly: {
    q1: { units: number; color?: string };
    q2: { units: number; color?: string };
    q3: { units: number; color?: string };
    q4: { units: number; color?: string };
  };
  fclMonthly: { month: string; units: number; color?: string }[];
  lclMonthly: { month: string; units: number; color?: string }[];
  ciyMovement: {
    thisYear: { month: string; inspections: number; pickupDelivery: number }[];
    lastYear: { month: string; inspections: number; pickupDelivery: number }[];
  };
}

export const mockSalesData: SalesData = {
  totalRevenue: 12450000,
  lastYearYtdRevenue: 10500000,
  mtdRevenue: 3200000,
  ytdRevenue: 9850000,
  mtdBudget: 3500000,
  ytdBudget: 10500000,
  revenueTarget: 15000000,
  growthPercentage: 18.5,
  quarterlyTargets: {
    q1: { current: 3150000, target: 3500000 },
    q2: { current: 3700000, target: 3750000 },
    q3: { current: 3000000, target: 3750000 },
    q4: { current: 0, target: 4000000 },
  },
  topProducts: [
    { name: 'Product A', sales: 2500000 },
    { name: 'Product B', sales: 1800000 },
    { name: 'Product C', sales: 1500000 },
    { name: 'Product D', sales: 1200000 },
    { name: 'Product E', sales: 950000 },
  ],
  topCustomers: [
    { name: 'Client Alpha', sales: 3200000, color: '#00617f' },
    { name: 'Client Beta', sales: 2800000, color: '#00617f' },
    { name: 'Client Gamma', sales: 2100000, color: '#00617f' },
    { name: 'Client Delta', sales: 1900000, color: '#00617f' },
    { name: 'Client Epsilon', sales: 1450000, color: '#00617f' },
  ],
  topCustomersMonthly: {
    'January': [
      { name: 'Client Alpha', sales: 250000, color: '#00617f' },
      { name: 'Client Beta', sales: 220000, color: '#00617f' },
      { name: 'Client Gamma', sales: 180000, color: '#00617f' },
      { name: 'Client Delta', sales: 160000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 120000, color: '#00617f' },
    ],
    'February': [
      { name: 'Client Alpha', sales: 260000, color: '#00617f' },
      { name: 'Client Beta', sales: 230000, color: '#00617f' },
      { name: 'Client Gamma', sales: 185000, color: '#00617f' },
      { name: 'Client Delta', sales: 165000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 125000, color: '#00617f' },
    ],
    'March': [
      { name: 'Client Alpha', sales: 270000, color: '#00617f' },
      { name: 'Client Beta', sales: 240000, color: '#00617f' },
      { name: 'Client Gamma', sales: 190000, color: '#00617f' },
      { name: 'Client Delta', sales: 170000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 130000, color: '#00617f' },
    ],
    'April': [
      { name: 'Client Alpha', sales: 265000, color: '#00617f' },
      { name: 'Client Beta', sales: 235000, color: '#00617f' },
      { name: 'Client Gamma', sales: 175000, color: '#00617f' },
      { name: 'Client Delta', sales: 155000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 115000, color: '#00617f' },
    ],
    'May': [
      { name: 'Client Alpha', sales: 280000, color: '#00617f' },
      { name: 'Client Beta', sales: 250000, color: '#00617f' },
      { name: 'Client Gamma', sales: 200000, color: '#00617f' },
      { name: 'Client Delta', sales: 180000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 140000, color: '#00617f' },
    ],
    'June': [
      { name: 'Client Alpha', sales: 300000, color: '#00617f' },
      { name: 'Client Beta', sales: 270000, color: '#00617f' },
      { name: 'Client Gamma', sales: 220000, color: '#00617f' },
      { name: 'Client Delta', sales: 200000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 160000, color: '#00617f' },
    ],
    'July': [
      { name: 'Client Alpha', sales: 310000, color: '#00617f' },
      { name: 'Client Beta', sales: 280000, color: '#00617f' },
      { name: 'Client Gamma', sales: 230000, color: '#00617f' },
      { name: 'Client Delta', sales: 210000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 170000, color: '#00617f' },
    ],
    'August': [
      { name: 'Client Alpha', sales: 305000, color: '#00617f' },
      { name: 'Client Beta', sales: 275000, color: '#00617f' },
      { name: 'Client Gamma', sales: 225000, color: '#00617f' },
      { name: 'Client Delta', sales: 205000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 165000, color: '#00617f' },
    ],
    'September': [
      { name: 'Client Alpha', sales: 320000, color: '#00617f' },
      { name: 'Client Beta', sales: 290000, color: '#00617f' },
      { name: 'Client Gamma', sales: 240000, color: '#00617f' },
      { name: 'Client Delta', sales: 220000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 180000, color: '#00617f' },
    ],
    'October': [
      { name: 'Client Alpha', sales: 340000, color: '#00617f' },
      { name: 'Client Beta', sales: 310000, color: '#00617f' },
      { name: 'Client Gamma', sales: 260000, color: '#00617f' },
      { name: 'Client Delta', sales: 240000, color: '#00617f' },
      { name: 'Client Epsilon', sales: 200000, color: '#00617f' },
    ],
    'November': [
      { name: 'Client Alpha', sales: 0, color: '#00617f' },
      { name: 'Client Beta', sales: 0, color: '#00617f' },
      { name: 'Client Gamma', sales: 0, color: '#00617f' },
      { name: 'Client Delta', sales: 0, color: '#00617f' },
      { name: 'Client Epsilon', sales: 0, color: '#00617f' },
    ],
    'December': [
      { name: 'Client Alpha', sales: 0, color: '#00617f' },
      { name: 'Client Beta', sales: 0, color: '#00617f' },
      { name: 'Client Gamma', sales: 0, color: '#00617f' },
      { name: 'Client Delta', sales: 0, color: '#00617f' },
      { name: 'Client Epsilon', sales: 0, color: '#00617f' },
    ],
  },
  revenueBySegment: [
    { segment: 'Logistics', revenue: 5200000, lastYearRevenue: 4800000 },
    { segment: 'Warehousing', revenue: 3800000, lastYearRevenue: 3500000 },
    { segment: 'Transportation', revenue: 3450000, lastYearRevenue: 3200000 },
  ],
  revenueBySegmentMonthly: {
    'January': [
      { segment: 'Logistics', revenue: 420000, lastYearRevenue: 380000 },
      { segment: 'Warehousing', revenue: 310000, lastYearRevenue: 280000 },
      { segment: 'Transportation', revenue: 280000, lastYearRevenue: 260000 },
    ],
    'February': [
      { segment: 'Logistics', revenue: 430000, lastYearRevenue: 390000 },
      { segment: 'Warehousing', revenue: 320000, lastYearRevenue: 290000 },
      { segment: 'Transportation', revenue: 290000, lastYearRevenue: 270000 },
    ],
    'March': [
      { segment: 'Logistics', revenue: 440000, lastYearRevenue: 400000 },
      { segment: 'Warehousing', revenue: 330000, lastYearRevenue: 300000 },
      { segment: 'Transportation', revenue: 300000, lastYearRevenue: 280000 },
    ],
    'April': [
      { segment: 'Logistics', revenue: 435000, lastYearRevenue: 395000 },
      { segment: 'Warehousing', revenue: 315000, lastYearRevenue: 285000 },
      { segment: 'Transportation', revenue: 285000, lastYearRevenue: 265000 },
    ],
    'May': [
      { segment: 'Logistics', revenue: 450000, lastYearRevenue: 410000 },
      { segment: 'Warehousing', revenue: 340000, lastYearRevenue: 310000 },
      { segment: 'Transportation', revenue: 310000, lastYearRevenue: 290000 },
    ],
    'June': [
      { segment: 'Logistics', revenue: 470000, lastYearRevenue: 430000 },
      { segment: 'Warehousing', revenue: 360000, lastYearRevenue: 330000 },
      { segment: 'Transportation', revenue: 330000, lastYearRevenue: 310000 },
    ],
    'July': [
      { segment: 'Logistics', revenue: 480000, lastYearRevenue: 440000 },
      { segment: 'Warehousing', revenue: 370000, lastYearRevenue: 340000 },
      { segment: 'Transportation', revenue: 340000, lastYearRevenue: 320000 },
    ],
    'August': [
      { segment: 'Logistics', revenue: 475000, lastYearRevenue: 435000 },
      { segment: 'Warehousing', revenue: 365000, lastYearRevenue: 335000 },
      { segment: 'Transportation', revenue: 335000, lastYearRevenue: 315000 },
    ],
    'September': [
      { segment: 'Logistics', revenue: 490000, lastYearRevenue: 450000 },
      { segment: 'Warehousing', revenue: 380000, lastYearRevenue: 350000 },
      { segment: 'Transportation', revenue: 350000, lastYearRevenue: 330000 },
    ],
    'October': [
      { segment: 'Logistics', revenue: 510000, lastYearRevenue: 470000 },
      { segment: 'Warehousing', revenue: 400000, lastYearRevenue: 370000 },
      { segment: 'Transportation', revenue: 370000, lastYearRevenue: 350000 },
    ],
    'November': [
      { segment: 'Logistics', revenue: 0, lastYearRevenue: 460000 },
      { segment: 'Warehousing', revenue: 0, lastYearRevenue: 360000 },
      { segment: 'Transportation', revenue: 0, lastYearRevenue: 340000 },
    ],
    'December': [
      { segment: 'Logistics', revenue: 0, lastYearRevenue: 480000 },
      { segment: 'Warehousing', revenue: 0, lastYearRevenue: 380000 },
      { segment: 'Transportation', revenue: 0, lastYearRevenue: 360000 },
    ],
  },
  monthlyTrend: [
    { month: 'Jan', revenue: 980000 },
    { month: 'Feb', revenue: 1050000 },
    { month: 'Mar', revenue: 1120000 },
    { month: 'Apr', revenue: 1080000 },
    { month: 'May', revenue: 1200000 },
    { month: 'Jun', revenue: 1350000 },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 980000, budget: 1000000, lastYearRevenue: 900000 },
    { month: 'Feb', revenue: 1050000, budget: 1000000, lastYearRevenue: 950000 },
    { month: 'Mar', revenue: 1120000, budget: 1100000, lastYearRevenue: 1000000 },
    { month: 'Apr', revenue: 1080000, budget: 1100000, lastYearRevenue: 980000 },
    { month: 'May', revenue: 1200000, budget: 1150000, lastYearRevenue: 1100000 },
    { month: 'Jun', revenue: 1350000, budget: 1200000, lastYearRevenue: 1250000 },
    { month: 'Jul', revenue: 1420000, budget: 1250000, lastYearRevenue: 1300000 },
    { month: 'Aug', revenue: 1380000, budget: 1250000, lastYearRevenue: 1280000 },
    { month: 'Sep', revenue: 1470000, budget: 1300000, lastYearRevenue: 1350000 },
    { month: 'Oct', revenue: 1600000, budget: 1350000, lastYearRevenue: 1450000 },
    { month: 'Nov', revenue: 0, budget: 1400000, lastYearRevenue: 1500000 },
    { month: 'Dec', revenue: 0, budget: 1500000, lastYearRevenue: 1600000 },
  ],
  accountManagers: [
    { name: 'Ahmed Al-Rashid', revenue: 2800000, budget: 3000000 },
    { name: 'Fatima Al-Saud', revenue: 2500000, budget: 2600000 },
    { name: 'Mohammed Al-Qahtani', revenue: 2200000, budget: 2400000 },
    { name: 'Sara Al-Mutairi', revenue: 1900000, budget: 2000000 },
    { name: 'Khalid Al-Dosari', revenue: 1650000, budget: 1800000 },
  ],
};

export const mockRiskData: RiskData = {
  totalRisks: 47,
  highRisks: 8,
  mediumRisks: 21,
  lowRisks: 18,
  mitigatedPercentage: 62,
  mitigatedRisksCount: 24,
  totalRisksForMitigation: 47,
  risksByDepartment: [
    { department: 'Finance', count: 12, color: '#9b2743' },
    { department: 'Operations', count: 18, color: '#00617f' },
    { department: 'Legal', count: 9, color: '#f59e0b' },
    { department: 'Strategy', count: 8, color: '#8b5cf6' },
  ],
  riskHeatmap: [
    { name: 'Supply Chain Disruption', probability: 4, impact: 5, level: 'high', risksClosed: 15 },
    { name: 'Currency Fluctuation', probability: 3, impact: 4, level: 'high', risksClosed: 8 },
    { name: 'Regulatory Changes', probability: 3, impact: 3, level: 'medium', risksClosed: 6 },
    { name: 'IT System Failure', probability: 2, impact: 5, level: 'medium', risksClosed: 7 },
    { name: 'Staff Turnover', probability: 3, impact: 2, level: 'medium', risksClosed: 4 },
    { name: 'Market Competition', probability: 4, impact: 3, level: 'high', risksClosed: 10 },
    { name: 'Equipment Breakdown', probability: 2, impact: 3, level: 'low', risksClosed: 3 },
    { name: 'Weather Delays', probability: 2, impact: 2, level: 'low', risksClosed: 2 },
  ],
  risksAddressedDate: '2025-10-06',
};

export const mockRealEstateData: RealEstateData = {
  jipTotalCapacity: 500000,
  jipOccupiedLand: 385000,
  jipOccupancyPercentage: 77,
  jipAverageRate: 125,
  parking: {
    availableSpaces: 50,
    rentedSpaces: 180,
    occupancyRate: 78,
    averageRate: 250,
    lastRate: 275,
    nextEndingContract: '2026-03-15',
    nextEndingContractSpaces: 25,
  },
  lands: [
    {
      id: 'L001',
      clientName: 'Saudi Logistics Co.',
      currentRate: 150,
      nextEscalationDate: '2026-01-15',
      escalationPercentage: 5,
      landSize: 50000,
      contractEndYear: 2028,
      averageRate: 145,
      bonded: 'Bonded',
    },
    {
      id: 'L002',
      clientName: 'Gulf Transport Ltd.',
      currentRate: 120,
      nextEscalationDate: '2025-11-20',
      escalationPercentage: 3,
      landSize: 75000,
      contractEndYear: 2027,
      averageRate: 115,
      bonded: 'Non-Bonded',
    },
    {
      id: 'L003',
      clientName: 'Al-Riyadh Warehousing',
      currentRate: 135,
      nextEscalationDate: '2026-03-10',
      escalationPercentage: 4,
      landSize: 60000,
      contractEndYear: 2029,
      averageRate: 130,
      bonded: 'Bonded',
    },
    {
      id: 'L004',
      clientName: 'Eastern Province Logistics',
      currentRate: 110,
      nextEscalationDate: '2025-12-05',
      escalationPercentage: 3.5,
      landSize: 100000,
      contractEndYear: 2026,
      averageRate: 105,
      bonded: 'Non-Bonded',
    },
    {
      id: 'L005',
      clientName: 'Jeddah Distribution Center',
      currentRate: 140,
      nextEscalationDate: '2026-02-28',
      escalationPercentage: 4.5,
      landSize: 100000,
      contractEndYear: 2030,
      averageRate: 135,
      bonded: 'Bonded',
    },
  ],
};

export const mockContractData: ContractData = {
  expiringThisMonth: 5,
  expiringThisQuarter: 12,
  totalContracts: 48,
  contracts: [
    {
      id: 'C001',
      client: 'ABC Corporation',
      value: 850000,
      expiryDate: '2025-10-15',
      daysUntilExpiry: 13,
      status: 'expiring-soon',
      renewalStatus: 'in-progress',
    },
    {
      id: 'C002',
      client: 'XYZ Industries',
      value: 1200000,
      expiryDate: '2025-10-22',
      daysUntilExpiry: 20,
      status: 'expiring-soon',
      renewalStatus: 'pending',
    },
    {
      id: 'C003',
      client: 'Global Logistics Ltd',
      value: 650000,
      expiryDate: '2025-11-05',
      daysUntilExpiry: 34,
      status: 'active',
      renewalStatus: 'pending',
    },
    {
      id: 'C004',
      client: 'Prime Shipping Co',
      value: 920000,
      expiryDate: '2025-11-18',
      daysUntilExpiry: 47,
      status: 'active',
      renewalStatus: 'pending',
    },
    {
      id: 'C005',
      client: 'Metro Transport',
      value: 780000,
      expiryDate: '2025-12-01',
      daysUntilExpiry: 60,
      status: 'active',
      renewalStatus: 'renewed',
    },
  ],
};

export const mockLogisticsData: LogisticsData = {
  onTimeDeliveryRate: 94.5,
  averageDeliveryTime: 2.3,
  transportationCostPerShipment: 450,
  activeShipments: 156,
  delayedShipments: 8,
  utilizationRate: 87,
  fleetUtilization: 87,
  trucks: 45,
  drivers: 68,
  tripsInProgress: 23,
  tripsCompleted: 342,
  tripsPending: 15,
  tripsTransporters: 8,
  deliveryPerformance: [
    { month: 'Jan', onTimeRate: 92 },
    { month: 'Feb', onTimeRate: 93 },
    { month: 'Mar', onTimeRate: 91 },
    { month: 'Apr', onTimeRate: 94 },
    { month: 'May', onTimeRate: 95 },
    { month: 'Jun', onTimeRate: 94.5 },
    { month: 'Jul', onTimeRate: 93.5 },
    { month: 'Aug', onTimeRate: 94 },
    { month: 'Sep', onTimeRate: 95 },
    { month: 'Oct', onTimeRate: 94.5 },
    { month: 'Nov', onTimeRate: 0 },
    { month: 'Dec', onTimeRate: 0 },
  ],
  delaysByRoute: [
    { route: 'Route A', delays: 3, trips: 45 },
    { route: 'Route B', delays: 2, trips: 38 },
    { route: 'Route C', delays: 1, trips: 52 },
    { route: 'Route D', delays: 2, trips: 41 },
  ],
  thresholds: {
    green: 90,
    yellow: 80,
  },
  tripCategories: [
    { name: 'Total Trips', value: 1250 },
    { name: 'Transit', value: 320 },
    { name: 'Inside Port', value: 180 },
    { name: 'Jeddah', value: 450 },
    { name: 'Outside Jeddah', value: 220 },
    { name: 'Outside KSA', value: 80 },
  ],
  tripCategoriesMonthly: {
    'January': [
      { name: 'Total Trips', value: 95 },
      { name: 'Transit', value: 24 },
      { name: 'Inside Port', value: 14 },
      { name: 'Jeddah', value: 34 },
      { name: 'Outside Jeddah', value: 17 },
      { name: 'Outside KSA', value: 6 },
    ],
    'February': [
      { name: 'Total Trips', value: 102 },
      { name: 'Transit', value: 26 },
      { name: 'Inside Port', value: 15 },
      { name: 'Jeddah', value: 37 },
      { name: 'Outside Jeddah', value: 18 },
      { name: 'Outside KSA', value: 6 },
    ],
    'March': [
      { name: 'Total Trips', value: 110 },
      { name: 'Transit', value: 28 },
      { name: 'Inside Port', value: 16 },
      { name: 'Jeddah', value: 40 },
      { name: 'Outside Jeddah', value: 19 },
      { name: 'Outside KSA', value: 7 },
    ],
    'April': [
      { name: 'Total Trips', value: 108 },
      { name: 'Transit', value: 27 },
      { name: 'Inside Port', value: 15 },
      { name: 'Jeddah', value: 39 },
      { name: 'Outside Jeddah', value: 20 },
      { name: 'Outside KSA', value: 7 },
    ],
    'May': [
      { name: 'Total Trips', value: 118 },
      { name: 'Transit', value: 30 },
      { name: 'Inside Port', value: 17 },
      { name: 'Jeddah', value: 43 },
      { name: 'Outside Jeddah', value: 21 },
      { name: 'Outside KSA', value: 7 },
    ],
    'June': [
      { name: 'Total Trips', value: 125 },
      { name: 'Transit', value: 32 },
      { name: 'Inside Port', value: 18 },
      { name: 'Jeddah', value: 45 },
      { name: 'Outside Jeddah', value: 22 },
      { name: 'Outside KSA', value: 8 },
    ],
    'July': [
      { name: 'Total Trips', value: 130 },
      { name: 'Transit', value: 33 },
      { name: 'Inside Port', value: 19 },
      { name: 'Jeddah', value: 47 },
      { name: 'Outside Jeddah', value: 23 },
      { name: 'Outside KSA', value: 8 },
    ],
    'August': [
      { name: 'Total Trips', value: 128 },
      { name: 'Transit', value: 32 },
      { name: 'Inside Port', value: 18 },
      { name: 'Jeddah', value: 46 },
      { name: 'Outside Jeddah', value: 24 },
      { name: 'Outside KSA', value: 8 },
    ],
    'September': [
      { name: 'Total Trips', value: 135 },
      { name: 'Transit', value: 34 },
      { name: 'Inside Port', value: 20 },
      { name: 'Jeddah', value: 49 },
      { name: 'Outside Jeddah', value: 24 },
      { name: 'Outside KSA', value: 8 },
    ],
    'October': [
      { name: 'Total Trips', value: 142 },
      { name: 'Transit', value: 36 },
      { name: 'Inside Port', value: 21 },
      { name: 'Jeddah', value: 51 },
      { name: 'Outside Jeddah', value: 26 },
      { name: 'Outside KSA', value: 8 },
    ],
    'November': [
      { name: 'Total Trips', value: 0 },
      { name: 'Transit', value: 0 },
      { name: 'Inside Port', value: 0 },
      { name: 'Jeddah', value: 0 },
      { name: 'Outside Jeddah', value: 0 },
      { name: 'Outside KSA', value: 0 },
    ],
    'December': [
      { name: 'Total Trips', value: 0 },
      { name: 'Transit', value: 0 },
      { name: 'Inside Port', value: 0 },
      { name: 'Jeddah', value: 0 },
      { name: 'Outside Jeddah', value: 0 },
      { name: 'Outside KSA', value: 0 },
    ],
  },
};

export const mockWarehouseData: WarehouseData = {
  currentOccupancy: 42500,
  capacity: 50000,
  occupancyPercentage: 85,
  inboundShipments: 234,
  outboundShipments: 198,
  inventoryTurnover: 8.5,
  averageDaysInStorage: 12,
  occupancyByZone: [
    { zone: 'Zone A', occupancy: 9800, capacity: 10000, color: '#00617f', emptyWH: 2, whName: 'WH-A1' },
    { zone: 'Zone B', occupancy: 8500, capacity: 10000, color: '#9b2743', emptyWH: 15, whName: 'WH-B1' },
    { zone: 'Zone C', occupancy: 12200, capacity: 15000, color: '#f59e0b', emptyWH: 28, whName: 'WH-C1' },
    { zone: 'Zone D', occupancy: 12000, capacity: 15000, color: '#8b5cf6', emptyWH: 30, whName: 'WH-D1' },
  ],
  occupancyTrend: [
    { month: 'Jan', occupancy: 78 },
    { month: 'Feb', occupancy: 80 },
    { month: 'Mar', occupancy: 82 },
    { month: 'Apr', occupancy: 83 },
    { month: 'May', occupancy: 84 },
    { month: 'Jun', occupancy: 85 },
  ],
};

export const mockPOData: POData = {
  fclQuarterly: {
    q1: { units: 1250, color: '#00617f' },
    q2: { units: 1380, color: '#00617f' },
    q3: { units: 1420, color: '#00617f' },
    q4: { units: 1500, color: '#00617f' },
  },
  lclQuarterly: {
    q1: { units: 850, color: '#9b2743' },
    q2: { units: 920, color: '#9b2743' },
    q3: { units: 980, color: '#9b2743' },
    q4: { units: 1050, color: '#9b2743' },
  },
  fclMonthly: [
    { month: 'Jan', units: 400, color: '#00617f' },
    { month: 'Feb', units: 420, color: '#00617f' },
    { month: 'Mar', units: 430, color: '#00617f' },
    { month: 'Apr', units: 450, color: '#00617f' },
    { month: 'May', units: 460, color: '#00617f' },
    { month: 'Jun', units: 470, color: '#00617f' },
    { month: 'Jul', units: 480, color: '#00617f' },
    { month: 'Aug', units: 470, color: '#00617f' },
    { month: 'Sep', units: 470, color: '#00617f' },
    { month: 'Oct', units: 500, color: '#00617f' },
    { month: 'Nov', units: 0, color: '#00617f' },
    { month: 'Dec', units: 0, color: '#00617f' },
  ],
  lclMonthly: [
    { month: 'Jan', units: 280, color: '#9b2743' },
    { month: 'Feb', units: 285, color: '#9b2743' },
    { month: 'Mar', units: 285, color: '#9b2743' },
    { month: 'Apr', units: 300, color: '#9b2743' },
    { month: 'May', units: 310, color: '#9b2743' },
    { month: 'Jun', units: 310, color: '#9b2743' },
    { month: 'Jul', units: 320, color: '#9b2743' },
    { month: 'Aug', units: 330, color: '#9b2743' },
    { month: 'Sep', units: 330, color: '#9b2743' },
    { month: 'Oct', units: 350, color: '#9b2743' },
    { month: 'Nov', units: 0, color: '#9b2743' },
    { month: 'Dec', units: 0, color: '#9b2743' },
  ],
  ciyMovement: {
    thisYear: [
      { month: 'Jan', inspections: 120, pickupDelivery: 95 },
      { month: 'Feb', inspections: 135, pickupDelivery: 110 },
      { month: 'Mar', inspections: 145, pickupDelivery: 120 },
      { month: 'Apr', inspections: 150, pickupDelivery: 125 },
      { month: 'May', inspections: 160, pickupDelivery: 135 },
      { month: 'Jun', inspections: 170, pickupDelivery: 145 },
      { month: 'Jul', inspections: 175, pickupDelivery: 150 },
      { month: 'Aug', inspections: 180, pickupDelivery: 155 },
      { month: 'Sep', inspections: 185, pickupDelivery: 160 },
      { month: 'Oct', inspections: 190, pickupDelivery: 165 },
      { month: 'Nov', inspections: 195, pickupDelivery: 170 },
      { month: 'Dec', inspections: 200, pickupDelivery: 175 },
    ],
    lastYear: [
      { month: 'Jan', inspections: 100, pickupDelivery: 80 },
      { month: 'Feb', inspections: 110, pickupDelivery: 85 },
      { month: 'Mar', inspections: 115, pickupDelivery: 90 },
      { month: 'Apr', inspections: 120, pickupDelivery: 95 },
      { month: 'May', inspections: 125, pickupDelivery: 100 },
      { month: 'Jun', inspections: 130, pickupDelivery: 105 },
      { month: 'Jul', inspections: 135, pickupDelivery: 110 },
      { month: 'Aug', inspections: 140, pickupDelivery: 115 },
      { month: 'Sep', inspections: 145, pickupDelivery: 120 },
      { month: 'Oct', inspections: 150, pickupDelivery: 125 },
      { month: 'Nov', inspections: 155, pickupDelivery: 130 },
      { month: 'Dec', inspections: 160, pickupDelivery: 135 },
    ],
  },
};

export const mockVASData: VASData = {
  deliveryTotal: {
    year: '2025',
    current: 55500,
    previous: 48600,
    percentageChange: 14.2,
    color: '#00617f',
  },
  labellingTotal: {
    year: '2025',
    current: 48200,
    previous: 42800,
    percentageChange: 12.6,
    color: '#9b2743',
  },
  top5Clients: [
    { name: 'Client Alpha', year2024: 5400, year2025: 6200, color: '#00617f' },
    { name: 'Client Beta', year2024: 4800, year2025: 5500, color: '#00617f' },
    { name: 'Client Gamma', year2024: 4200, year2025: 4800, color: '#00617f' },
    { name: 'Client Delta', year2024: 3600, year2025: 4200, color: '#00617f' },
    { name: 'Client Epsilon', year2024: 3000, year2025: 3600, color: '#00617f' },
  ],
  labellingQuarterly: {
    q1: { current: 12500, lastYear: 11200, color: '#00617f' },
    q2: { current: 13800, lastYear: 12500, color: '#00617f' },
    q3: { current: 14200, lastYear: 13100, color: '#00617f' },
    q4: { current: 15000, lastYear: 13800, color: '#00617f' },
  },
  deliveryQuarterly: {
    q1: { current: 8500, lastYear: 7800, color: '#9b2743' },
    q2: { current: 9200, lastYear: 8500, color: '#9b2743' },
    q3: { current: 9800, lastYear: 9000, color: '#9b2743' },
    q4: { current: 10500, lastYear: 9500, color: '#9b2743' },
  },
};
