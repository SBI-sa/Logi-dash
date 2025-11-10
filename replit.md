# LogiPoint Reporting Dashboard

## Overview
This is a cross-platform reporting dashboard application built with Expo and React Native. The app provides comprehensive business analytics and reporting for LogiPoint, with support for iOS, Android, and Web platforms.

**Project Type**: Expo React Native Web Application  
**Primary Platform**: Web (in Replit environment)  
**Framework**: Expo Router + React Native  
**State Management**: Zustand + React Query  
**Backend**: Supabase with 8 active tables and realtime subscriptions

## Current State
- ✅ Web build successfully compiled and served on port 5000
- ✅ Login system functional (viewer code: 2030, admin: thamir.sulimani@logipoint.sa / Logi@2030)
- ✅ Dashboard with multiple reporting modules (Sales, Warehouse, Logistics, Contracts, etc.)
- ✅ Supabase backend with 8 tables: sales, risks, real_estate, logistics, warehouse, vas, po, last_updated
- ✅ Realtime subscriptions active for all 8 tables
- ✅ Static web build deployed for production-ready hosting

## Recent Changes

### November 10, 2025 (Latest)
- **Complete AdminSave Integration**: Wired all 8 screens to their respective adminSave functions in lib/adminSave.ts
- **Realtime Data Sync**: All admin edits now save to Supabase and propagate instantly via realtime subscriptions
- **Integration Status**:
  - ✅ Sales: Uses `saveSalesData()` directly in edit handlers
  - ✅ Risks: `updateRiskData()` → `saveRisksData()`
  - ✅ Real Estate: Uses `saveRealEstateData()` directly in image upload handlers
  - ✅ Logistics: `updateLogisticsData()` → `saveLogisticsData()`
  - ✅ Warehouse: Uses `saveWarehouseData()` directly in image upload handlers
  - ✅ VAS: `updateVasData()` → `saveVasData()`
  - ✅ PO: `updatePoData()` → `savePoData()`
  - ✅ Last Updated: Timestamps sync via `saveLastUpdated()`
- **Code Cleanup**: Removed unused `saveContractsData()` function and ContractData type from lib/adminSave.ts
- **DataContext.tsx**: Updated all update functions to call their respective save helpers
- **Pattern**: Admin edits → Local state update → Supabase save → Realtime broadcast → All viewers updated

### November 9, 2025
- **Image Upload Persistence Fix**: Fixed Warehouse and Real Estate screens to save uploaded images to Supabase database
- **Database Integration**: Added `saveWarehouseData` and `saveRealEstateData` calls after all image upload operations
- **Image Removal Persistence**: Fixed image removal functions to persist deletions to database
- **Public URL Fix**: Updated warehouse allocation image upload to use permanent public URLs instead of temporary signed URLs
- **Complete Coverage**: All image operations (upload & removal) now save to database for both screens:
  - Warehouse: allocation image upload/removal using public URLs
  - Real Estate: land image, JLH image, and additional images upload/removal
- **Data Persistence**: Uploaded images now persist across page refreshes and sync to all users via realtime subscriptions
- **Supabase Storage**: Images stored in `dashboard-images` bucket under `warehouse/` and `real_estate/` folders
- **Pattern Consistency**: Warehouse upload now matches Real Estate pattern using `getPublicUrl()` for permanent URLs

### November 5, 2025
- **Login Screen Updates**: Changed subtitle from "Dashboard & Reporting" to "Reporting Dashboard"
- **Shield Icon Removal**: Removed animated shield icon from login screen header for cleaner appearance
- **Login Screen Cleanup**: Removed "Welcome to LogiPoint" and "View dashboards and reports" text from login screen
- **Home Screen Cleanup**: Removed "Quick Access" heading and "Long press and drag to reorder" subtitle from home screen
- **Admin Login Simplified**: Removed email field from admin login - now only requires password (Logi@2030)
- **UI Cleanup**: Removed "Data Last Updated" timestamp element from home screen for cleaner interface
- **Code Optimization**: Removed unused state variables and imports from home screen component
- **Git Branch**: Working on Draft branch for UI improvements

### November 4, 2025
- **Database Cleanup**: Dropped unused `contracts` table, reduced from 9 to 8 active Supabase tables
- **Real Estate Restoration**: Re-enabled Supabase integration for Real Estate page (contracts.tsx)
- **Realtime Subscriptions**: Updated subscription count from 7 to 8 tables (re-enabled real_estate subscription)
- **Data Loading**: All 8 tables now loading successfully from Supabase with realtime updates
- **Code Cleanup**: Removed all contract-related references from DataContext.tsx
- **Cache Control**: Users must do hard refresh (Ctrl+Shift+R / Cmd+Shift+R) after builds to see updates

### October 28, 2025
- **Project Import**: Successfully imported from GitHub and configured for Replit environment
- **Web Build Setup**: Configured Expo to export static web build
- **Workflow Configuration**: Set up web server workflow using `serve` to host static files on port 5000
- **Bug Fix**: Fixed syntax error in `app/(tabs)/sales.tsx` (duplicate closing braces)
- **Deployment**: Configured for Replit autoscale deployment with build and serve commands

## Project Structure

```
├── app/                     # App screens (Expo Router)
│   ├── (tabs)/             # Tab navigation screens
│   │   ├── (home)/         # Home tab
│   │   ├── contracts.tsx   # Contracts reporting
│   │   ├── logistics.tsx   # Logistics dashboard
│   │   ├── po.tsx          # Purchase Orders
│   │   ├── risks.tsx       # Risk management
│   │   ├── sales.tsx       # Sales analytics
│   │   ├── vas.tsx         # Value Added Services
│   │   └── warehouse.tsx   # Warehouse management
│   ├── _layout.tsx         # Root layout
│   ├── login.tsx           # Login screen
│   └── +not-found.tsx      # 404 screen
├── components/             # Reusable UI components
│   ├── charts/            # Chart components (KPI, Line, Bar, Pie, etc.)
│   └── EditModal.tsx      # Edit functionality modal
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication state
│   └── DataContext.tsx    # Data management
├── constants/             # App constants
│   └── colors.ts         # Color palette
├── mocks/                # Mock data
│   └── dashboardData.ts  # Sample dashboard data
├── assets/               # Static assets
│   └── images/          # App icons and images
├── dist/                # Built web application (generated)
├── app.json             # Expo configuration
├── supabaseClient.ts    # Supabase client setup
└── package.json         # Dependencies and scripts
```

## Development Workflow

### Running Locally
```bash
# Start development server (for mobile/native development)
bun run start-dev

# Build and serve web version (production preview)
bun run build
bun run serve
```

### Building for Web
```bash
# Export static web build
bun run build
```

The build creates a `dist/` folder containing:
- `index.html` - Main HTML file
- `_expo/static/` - Bundled JavaScript and assets
- `favicon.ico` - App favicon

### Mobile Development
For mobile development (iOS/Android), use:
```bash
bun run start-mobile
```
This starts Expo with tunnel mode for testing on physical devices.

## Technologies

### Core Stack
- **Expo SDK 54**: Cross-platform framework
- **React Native 0.81**: Mobile framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Metro**: JavaScript bundler

### Key Libraries
- **expo-router**: File-based routing
- **@tanstack/react-query**: Server state management
- **zustand**: Client state management
- **@supabase/supabase-js**: Backend integration
- **lucide-react-native**: Icon library
- **react-native-svg**: SVG rendering for charts

### Charts & Visualizations
Custom chart components for:
- KPI Cards
- Line Charts
- Bar Charts (Simple, Grouped, Vertical, Clustered)
- Pie Charts (Simple, Donut, Zone)
- Combo Charts
- Bullet Charts
- Speedometer Gauges
- Progress Gauges
- Year-over-Year comparisons
- Small Multiples

## Authentication

The app uses hardcoded credentials for development:

**Viewer Mode:**
- Code: `2030`
- Limited read-only access

**Admin Mode:**
- Email: `thamir.sulimani@logipoint.sa`
- Password: `Logi@2030`
- Full edit permissions

> ⚠️ **Security Note**: These are development credentials. For production, implement proper authentication with environment variables and server-side validation.

## Data Storage

### Current Setup
- Uses AsyncStorage for local persistence (falls back to localStorage on web)
- **Supabase Integration Active**: All 8 tables load data from Supabase in real-time
- Admin edit operations save to both local storage and Supabase

### Supabase Tables (8 Total)
1. **sales** - Sales analytics and revenue data
2. **risks** - Risk management tracking
3. **real_estate** - Land contracts and parking information
4. **logistics** - Transportation and logistics data
5. **warehouse** - Warehouse management metrics
6. **vas** - Value Added Services tracking
7. **po** - Purchase Orders
8. **last_updated** - Timestamp tracking for data freshness

### Realtime Updates
- All 8 tables have active realtime subscriptions
- Changes made by Admin users propagate to Viewer users instantly
- Subscription channels handle insert, update, and delete operations

## Deployment

### Replit Deployment
This project is configured for Replit's autoscale deployment:
- **Build Command**: `bun run build` (exports web to `dist/`)
- **Run Command**: `bunx serve dist -l 5000` (serves static files)
- **Port**: 5000

To publish on Replit:
1. Click the "Deploy" button in Replit
2. The app will automatically build and serve

### Alternative Deployment Options

**Static Hosting (Recommended for Web):**
- Vercel
- Netlify  
- GitHub Pages
- Cloudflare Pages

**Mobile App Stores:**
- Use Expo EAS for iOS App Store and Google Play Store
- See README.md for detailed deployment instructions

## Environment Variables

Currently using hardcoded Supabase credentials in `supabaseClient.ts`. For production:
1. Move credentials to environment variables
2. Use Replit Secrets for sensitive data
3. Implement proper authentication flow

## Known Issues & Limitations

1. **Native Animations**: Web version shows warning about `useNativeDriver` (expected, native features not available on web)
2. **LSP Errors**: TypeScript LSP shows some configuration warnings - these don't affect runtime
3. **Browser Caching**: Static builds require hard refresh (Ctrl+Shift+R / Cmd+Shift+R) to see updates

## Browser Compatibility

The web version works on:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires JavaScript enabled
- ⚠️ File API support needed for image uploads

## Troubleshooting

### App not loading?
- Check that workflow "Web Server" is running
- Verify port 5000 is accessible
- Clear browser cache and hard reload

### Changes not appearing?
- Run `bun run build` to rebuild
- Restart the "Web Server" workflow
- The app serves static files, so rebuilds are required for code changes

### Build errors?
- Run `bun install` to ensure dependencies are up to date
- Check syntax errors in source files
- Review workflow logs for detailed error messages

## Next Steps / Future Improvements

1. **Authentication**: Implement proper OAuth or JWT-based authentication
2. **Performance**: Implement code splitting and lazy loading
3. **Mobile Builds**: Set up EAS Build for native iOS/Android apps
4. **Tests**: Add unit and integration tests
5. **CI/CD**: Automate builds and deployments
6. **Analytics**: Add user analytics and dashboard usage tracking

## Support & Documentation

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **Supabase**: https://supabase.com/docs
- **Original README**: See `README.md` for detailed Rork/Expo setup instructions
