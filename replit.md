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

## External Dependencies
- **Supabase**: Backend services for database (8 tables: `sales`, `risks`, `real_estate`, `logistics`, `warehouse`, `vas`, `po`, `last_updated`), authentication, and real-time subscriptions.
- **Expo**: For cross-platform development and build processes.
- **@tanstack/react-query**: For server state management and data fetching.
- **Zustand**: For client-side state management.
- **@supabase/supabase-js**: JavaScript client library for Supabase interaction.
- **lucide-react-native**: Icon library used for UI elements.
- **react-native-svg**: Used for rendering SVG-based charts and graphics.
- **Metro**: JavaScript bundler for React Native.
- **AsyncStorage**: Used for local data persistence (falls back to localStorage on web).