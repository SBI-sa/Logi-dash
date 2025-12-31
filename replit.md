# LogiPoint Reporting Dashboard

## Overview
This project is a cross-platform reporting dashboard application built with Expo and React Native. It provides comprehensive business analytics for LogiPoint across iOS, Android, and Web platforms, with a primary focus on the web environment within Replit. The application offers various reporting modules including Sales, Warehouse, Logistics, Contracts, Risks, Real Estate, VAS, Purchase Orders, and Marketing & Leads. It is powered by a Supabase backend with real-time data synchronization, aiming to deliver a robust, real-time analytics platform for critical business insights.

## User Preferences
- I want iterative development.
- Ask before making major changes.
- I prefer detailed explanations.

## System Architecture
The application is built on Expo SDK 54, React Native 0.81, and React 19, utilizing TypeScript. It employs Expo Router for file-based navigation, Zustand for client-side state management, and @tanstack/react-query for server-state management. The UI/UX features a clean design with custom chart components for KPI Cards, Line Charts, Bar Charts, Pie Charts, and more, integrated with `lucide-react-native` for icons and `react-native-svg` for rendering. Data entry supports exact numeric values without rounding.

### Authentication
A 3-tier access code authentication system is implemented:
- Users enter a single access code on the login screen.
- The system automatically determines the user role (Limited Viewer, Full Viewer, Admin) based on the code.
- Access codes are stored as environment variables (`EXPO_PUBLIC_VIEWER_PASSWORD`, `EXPO_PUBLIC_FULL_VIEWER_PASSWORD`, `EXPO_PUBLIC_ADMIN_PASSWORD`).
- Tab visibility is restricted based on the user's role (e.g., Limited Viewers cannot see Sales, Risk, Real Estate, or Warehouse tabs).
- User sessions are persisted using AsyncStorage.

### Timestamp Management
Admin users can edit "Last Updated" timestamps:
- Timestamps are displayed in a date-only format (e.g., "Nov 10, 2025").
- Editing is available via an admin-only pencil icon, opening a modal for date-only input (YYYY-MM-DD).
- Updates are saved to Supabase's `last_updated` table and broadcast in real-time to all clients.

### Sales Module
The Sales module includes:
- **Customer Management**: Supports independent editing of customer lists for each monthly tab, and a fixed list of 10 top customers on a "Total" tab. The "Total" tab customers are stored separately and have specific editing rules (e.g., no adding new customers, always 10 slots).
- **Bullet Graph Visualization**: KPI cards (YTD Revenue vs Budget, Total Revenue) feature bullet graphs comparing actual performance against targets or baselines, with automatic color-coding for performance (green for over-target, accent for under-target).

### Marketing & Leads Module
This module provides comprehensive marketing analytics with a year-driven data structure:
- **Year Selector**: Dynamic dropdown to switch between years.
- **9 Marketing Channels**: Tracks Website, LinkedIn (Organic/Paid), Instagram (Organic/Paid), Facebook (Organic/Paid), Email, and Referral channels.
- **KPI Cards**: Displays MTD Leads, YTD Leads, Conversion Rate, Converted Leads, Total Revenue, Avg Revenue/Lead, CPL, and Active Campaigns.
- **Visualizations**: Stacked bar chart for leads by channel, channel performance table, campaign performance table, and a custom Gantt chart for campaign duration.
- **Campaign Management**: Full CRUD operations for campaigns, including monthly allocations for accurate CPL/ROAS calculations.
- **Data Structure**: A single `marketing` table in Supabase with a JSONB `years` column stores per-year data.
- **Access**: Restricted to Full Viewer and Admin users.

### Transportation/Logistics Module
This module supports deletion of editable data entries with confirmation alerts for:
- **Trip Categories**: Deletion from Total tab removes categories from all months.
- **Delivery Performance**: Allows removal of specific monthly performance entries.
- **Delays by Route**: Enables removal of routes no longer tracked.
- Deletions update local state, persist to Supabase, and sync in real-time.

### Image Management
Image uploads use a cache-busting mechanism:
- Clean URLs are stored in Supabase.
- Timestamped URLs (`?t=${Date.now()}`) are used in the UI to force browser cache refreshes, ensuring immediate display of updated images.
- This applies to images such as the Warehouse allocation map, Real Estate land image, and JLH image.

## External Dependencies
- **Supabase**: Backend services for database (9 tables: `sales`, `risks`, `real_estate`, `logistics`, `warehouse`, `vas`, `po`, `last_updated`, `marketing`), authentication, and real-time subscriptions.
- **Expo**: For cross-platform development and build processes.
- **@tanstack/react-query**: For server state management and data fetching.
- **Zustand**: For client-side state management.
- **@supabase/supabase-js**: JavaScript client library for Supabase interaction.
- **@blazejkustra/react-native-alert**: Cross-platform Alert implementation (for iOS, Android, and Web).
- **lucide-react-native**: Icon library.
- **react-native-svg**: Used for rendering SVG-based charts and graphics.
- **AsyncStorage**: Used for local data persistence.