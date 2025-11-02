# LogiPoint Supabase Database Schema

This document outlines the required Supabase tables and their structure for the LogiPoint Management Dashboard.

## Tables Overview

1. `sales` - Sales performance data
2. `risks` - Risk management data (KRI)
3. `contracts` - Contract tracking data
4. `real_estate` - Real estate and land management
5. `logistics` - Logistics and delivery performance
6. `warehouse` - Warehouse occupancy and operations
7. `vas` - Value-Added Services (delivery & labeling)
8. `po` - Purchase Order movements (FCL/LCL)
9. `last_updated` - Track when each data section was last updated

---

## 1. Sales Table

**Table name:** `sales`

```sql
CREATE TABLE sales (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**JSONB Structure:** The `data` column stores the entire SalesData object as JSON.

**Fields in data:**
- `totalRevenue` (number)
- `lastYearYtdRevenue` (number)
- `mtdRevenue` (number)
- `ytdRevenue` (number)
- `mtdBudget` (number)
- `ytdBudget` (number)
- `revenueTarget` (number)
- `growthPercentage` (number)
- `quarterlyTargets` (object with q1, q2, q3, q4)
- `quarterlyLabelling` (object with q1, q2, q3, q4)
- `topProducts` (array)
- `topCustomers` (array)
- `topCustomersMonthly` (object)
- `revenueBySegment` (array)
- `revenueBySegmentMonthly` (object)
- `monthlyTrend` (array)
- `monthlyRevenue` (array)
- `accountManagers` (array)

---

## 2. Risks Table

**Table name:** `risks`

```sql
CREATE TABLE risks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `totalRisks` (number)
- `highRisks` (number)
- `mediumRisks` (number)
- `lowRisks` (number)
- `mitigatedPercentage` (number)
- `mitigatedRisksCount` (number)
- `totalRisksForMitigation` (number)
- `risksByDepartment` (array)
- `riskHeatmap` (array)
- `risksAddressedDate` (string)

---

## 3. Contracts Table

**Table name:** `contracts`

```sql
CREATE TABLE contracts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `expiringThisMonth` (number)
- `expiringThisQuarter` (number)
- `totalContracts` (number)
- `contracts` (array of contract objects)

---

## 4. Real Estate Table

**Table name:** `real_estate`

```sql
CREATE TABLE real_estate (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `jipTotalCapacity` (number)
- `jipOccupiedLand` (number)
- `jipOccupancyPercentage` (number)
- `jipAverageRate` (number)
- `parking` (object)
- `lands` (array)
- `landImageUri` (string, optional)
- `jlhImageUri` (string, optional)
- `additionalImages` (array, optional)

---

## 5. Logistics Table

**Table name:** `logistics`

```sql
CREATE TABLE logistics (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `onTimeDeliveryRate` (number)
- `averageDeliveryTime` (number)
- `transportationCostPerShipment` (number)
- `activeShipments` (number)
- `delayedShipments` (number)
- `utilizationRate` (number)
- `fleetUtilization` (number)
- `trucks` (number)
- `drivers` (number)
- `tripsInProgress` (number)
- `tripsCompleted` (number)
- `tripsPending` (number)
- `tripsTransporters` (number)
- `deliveryPerformance` (array)
- `delaysByRoute` (array)
- `thresholds` (object)
- `tripCategories` (array)
- `tripCategoriesMonthly` (object)

---

## 6. Warehouse Table

**Table name:** `warehouse`

```sql
CREATE TABLE warehouse (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `currentOccupancy` (number)
- `capacity` (number)
- `occupancyPercentage` (number)
- `inboundShipments` (number)
- `outboundShipments` (number)
- `inventoryTurnover` (number)
- `averageDaysInStorage` (number)
- `occupancyByZone` (array)
- `occupancyTrend` (array)
- `allocationImageUri` (string, optional)

---

## 7. VAS Table (Value-Added Services)

**Table name:** `vas`

```sql
CREATE TABLE vas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `deliveryTotal` (object)
- `labellingTotal` (object)
- `top5Clients` (array)
- `labellingQuarterly` (object with q1, q2, q3, q4)
- `deliveryQuarterly` (object with q1, q2, q3, q4)

---

## 8. PO Table (Purchase Orders)

**Table name:** `po`

```sql
CREATE TABLE po (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Fields in data:**
- `fclQuarterly` (object with q1, q2, q3, q4)
- `lclQuarterly` (object with q1, q2, q3, q4)
- `fclMonthly` (array)
- `lclMonthly` (array)
- `ciyMovement` (object with thisYear and lastYear arrays)

---

## 9. Last Updated Table

**Table name:** `last_updated`

```sql
CREATE TABLE last_updated (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  card_key VARCHAR(255) UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

This table tracks when each dashboard section was last updated by an admin.

---

## Setup Instructions

### Step 1: Create Tables in Supabase

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create all tables
CREATE TABLE sales (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE risks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contracts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE real_estate (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE logistics (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE warehouse (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE po (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE last_updated (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  card_key VARCHAR(255) UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 2: Insert Initial Mock Data

Use the admin dashboard to populate initial data, or run SQL inserts with your mock data from `mocks/dashboardData.ts`.

### Step 3: Enable Row Level Security (RLS) - Optional

For production, you can enable RLS policies:

```sql
-- Enable RLS
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Create policies (example for public read access)
CREATE POLICY "Allow public read access" ON sales FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update" ON sales FOR UPDATE USING (auth.role() = 'authenticated');
```

---

## Notes

- All data is stored in JSONB format to maintain flexibility and match the existing TypeScript interfaces
- Each table has only one row (id = 1) which gets updated by the admin
- The `updated_at` timestamp is automatically updated on each change
- Charts will read directly from the `data` column and work with the same structure as before
