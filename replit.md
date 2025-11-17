# LogiPoint Reporting Dashboard

## Overview
This project is a cross-platform reporting dashboard application built with Expo and React Native, providing comprehensive business analytics for LogiPoint. It supports iOS, Android, and Web platforms, with a primary focus on the web environment within Replit. The application offers various reporting modules including Sales, Warehouse, Logistics, Contracts, Risks, Real Estate, VAS, and Purchase Orders, all powered by a Supabase backend with real-time data synchronization. The vision is to provide a robust, real-time analytics platform for critical business insights.

## User Preferences
- I want iterative development.
- Ask before making major changes.
- I prefer detailed explanations.

## System Architecture
The application is built on **Expo SDK 54** and **React Native 0.81** with **React 19** and **TypeScript**. It utilizes **Expo Router** for file-based navigation and **Zustand** for client-side state management, complemented by **@tanstack/react-query** for server-state management. The UI/UX features a clean design with custom chart components for various data visualizations like KPI Cards, Line Charts, Bar Charts, Pie Charts, and more, integrated with `lucide-react-native` for icons and `react-native-svg` for rendering. Authentication uses hardcoded credentials for development, with distinct viewer and admin modes providing read-only and full edit permissions respectively. 

### Timestamp Management
Admin users can edit "Last Updated" timestamps which are reflected across all tab screens:
- **Display**: Timestamps shown as date-only format (e.g., "Nov 10, 2025") without time
- **Components**: `LastUpdatedHeaderRight.tsx` (header display) and `PageHeader.tsx` (page headers)
- **Editing**: Admin-only pencil icon opens `TimestampEditModal.tsx` with date-only input (YYYY-MM-DD format)
- **Storage**: Time automatically set to midnight (00:00) when saved
- **Synchronization**: Updates saved to Supabase `last_updated` table with real-time broadcast to all clients
- **Error Handling**: Failed updates roll back to previous value with alert notification to admin

The system design ensures real-time data updates across all clients when admin edits are made, following a pattern of local state update, Supabase save, and real-time broadcast.

### Sales Module Customer Management
The Sales module features two types of customer editing:
- **Monthly Tabs**: Each month (January-December) has its own customer list that can be edited independently. Customers can be added, edited, or removed per month.
- **Total Tab**: Fixed list of exactly 10 customers (`topCustomersTotal`) that represents the overall top customers. Unlike monthly tabs, the Total tab:
  - Has exactly 10 customer slots (Client 1-10 by default)
  - Cannot add new customers (button is hidden)
  - All 10 customers are fully editable (name, revenue, color)
  - Stored separately from monthly customer data in `topCustomersTotal` array
  - Persists to Supabase `top_customers_total` JSONB column
- **Data Flow**: Total tab customers use dedicated `topCustomersTotal` array, while monthly tabs use `topCustomersMonthly` object
- **Fallback**: If Supabase column doesn't exist, uses mock data from `mockSalesData.topCustomersTotal`

### Data Entry
The application supports **exact numeric values** without rounding or limits:
- All revenue, budget, and sales fields accept precise values (e.g., 165300, 1246580)
- Values are stored and displayed exactly as entered using `parseFloat()` without any abbreviation
- No K/M formatting on input or storage - only on charts where appropriate

### Transportation/Logistics Module Delete Functionality
The Transportation module supports deletion of editable data entries with confirmation alerts:
- **Trip Categories**: Delete button available inside edit modal for custom categories in both Total and Monthly tabs. Deleting from Total tab removes category from all months. Auto-calculated "Total Trips" category cannot be deleted.
- **Delivery Performance**: Delete button inside edit modal for each monthly performance entry. Allows removing specific months from the tracking chart.
- **Delays by Route**: Delete button inside edit modal for each route entry. Enables removal of routes that are no longer tracked.
- **UI Pattern**: Red Delete button appears inside the edit modal footer, positioned next to Cancel and Save buttons. Only shows for edit operations (not for add operations). All deletions trigger confirmation alerts to prevent accidental data loss.
- **Data Flow**: Deletions update local state, persist to Supabase, sync in real-time to all connected clients, and automatically close the edit modal.

## External Dependencies
- **Supabase**: Backend services for database (8 tables: `sales`, `risks`, `real_estate`, `logistics`, `warehouse`, `vas`, `po`, `last_updated`), authentication, and real-time subscriptions. Sales table includes JSONB columns: `top_customers_total` for Total tab customers, `top_customers_monthly` for monthly customer data, `revenue_by_segment_monthly` for segment data.
- **Expo**: For cross-platform development and build processes.
- **@tanstack/react-query**: For server state management and data fetching.
- **Zustand**: For client-side state management.
- **@supabase/supabase-js**: JavaScript client library for Supabase interaction.
- **lucide-react-native**: Icon library used for UI elements.
- **react-native-svg**: Used for rendering SVG-based charts and graphics.
- **Metro**: JavaScript bundler for React Native.
- **AsyncStorage**: Used for local data persistence (falls back to localStorage on web).

### Image Management
Image uploads use cache-busting timestamps to ensure replacements display immediately:
- **Database Storage**: Clean URLs without query parameters are stored in Supabase (e.g., `https://.../warehouse/allocation.jpg`)
- **UI Display**: Timestamped URLs with `?t=${Date.now()}` are used in the UI to force browser cache refresh
- **Separate Objects**: Upload handlers create two separate objects:
  - `dataForDatabase`: Contains clean URL, saved to Supabase
  - `dataForState`: Contains timestamped URL, used for local state and UI display
- **Why This Matters**: Image files are uploaded to the same path each time. Without timestamps in the UI, browsers cache the old image. Clean URLs in the database ensure future uploads work correctly
- **Affected Images**: Warehouse allocation map, Real Estate land image, JLH image

## Recent Changes
### November 17, 2025
- **Transportation delete functionality**: Added delete buttons with confirmation alerts for Trip Categories (Total and Monthly tabs), Delivery Performance entries, and Delays by Route. Deletions cascade properly (Total tab removes from all months) and sync to Supabase in real-time
- **Image cache-busting architecture**: Implemented dual-object pattern for image uploads - clean URLs stored in Supabase database, timestamped URLs used in UI to force browser refresh. Prevents mutation bugs and ensures future image replacements work correctly for warehouse allocation, land, and JLH images
- **Warehouse village colors**: Updated to use only 4-color repeating pattern (#00617f, #a7aca1, #081f2c, #9b2743) across all village cards

### November 16, 2025
- **Fixed data persistence issue**: Added missing `top_customers_total` JSONB column to Supabase sales table via SQL Editor
- **Revenue by Segment colors**: Updated to 4-color repeating pattern (#00617f, #a7aca1, #081f2c, #9b2743) across all months
- **Exact value display**: Removed K/M abbreviations in formatCurrency function to show precise numbers
- All admin edits now persist correctly to Supabase with real-time synchronization