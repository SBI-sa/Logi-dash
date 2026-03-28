/**
 * ⚠️ ⚠️ ⚠️ DANGER - MANUAL USE ONLY ⚠️ ⚠️ ⚠️
 * 
 * THIS SCRIPT WILL OVERWRITE ALL LIVE SUPABASE DATA IN THE SALES TABLE!
 * 
 * DO NOT RUN THIS SCRIPT UNLESS YOU EXPLICITLY WANT TO:
 * - Reset the database to baseline mock data
 * - Overwrite ALL admin edits made in the production app
 * - Lose all changes made since the last baseline
 * 
 * This script is ONLY for:
 * - Initial database setup (first time only)
 * - Intentional data resets during development
 * 
 * NEVER add this script to package.json scripts
 * NEVER call this from any automated process
 * NEVER run this on production Supabase instance
 * 
 * To run manually (after reading all warnings):
 * npx ts-node scripts/MANUAL-ONLY-lockDashboardData.ts
 */

import { supabase } from '../supabaseClient';
import { mockSalesData } from '../mocks/dashboardData';

async function lockDashboardData() {
  console.log('\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⚠️  CRITICAL WARNING - DATA OVERWRITE IMMINENT ⚠️');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('This script will OVERWRITE the entire sales table in Supabase');
  console.log('with baseline mock data, destroying all admin edits.');
  console.log('');
  console.log('❌ You will LOSE:');
  console.log('   • All revenue segments edited in admin mode');
  console.log('   • All account manager data modified by admins');
  console.log('   • All monthly revenue data customized in the app');
  console.log('   • Every single admin change since baseline was set');
  console.log('');
  console.log('✅ You will GAIN:');
  console.log('   • A fresh copy of the original mock data');
  console.log('   • Baseline values for development/testing');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Interactive confirmation (requires manual intervention)
  console.log('TO PROCEED, you must manually edit this script and set:');
  console.log('const I_UNDERSTAND_THIS_WILL_DELETE_DATA = true;');
  console.log('');
  
  const I_UNDERSTAND_THIS_WILL_DELETE_DATA = false;
  
  if (!I_UNDERSTAND_THIS_WILL_DELETE_DATA) {
    console.log('❌ ABORTED: Safety check failed.');
    console.log('   Set I_UNDERSTAND_THIS_WILL_DELETE_DATA = true to proceed.');
    console.log('');
    process.exit(1);
  }

  console.log('🔒 Proceeding to lock dashboard data to Supabase...\n');

  const dataToLock = {
    revenue_by_segment: mockSalesData.revenueBySegment,
    revenue_by_segment_monthly: mockSalesData.revenueBySegmentMonthly,
    account_managers: mockSalesData.accountManagers,
    total_revenue: mockSalesData.totalRevenue,
    last_year_ytd_revenue: mockSalesData.lastYearYtdRevenue,
    mtd_revenue: mockSalesData.mtdRevenue,
    ytd_revenue: mockSalesData.ytdRevenue,
    mtd_budget: mockSalesData.mtdBudget,
    ytd_budget: mockSalesData.ytdBudget,
    revenue_target: mockSalesData.revenueTarget,
    growth_percentage: mockSalesData.growthPercentage,
    quarterly_targets: mockSalesData.quarterlyTargets,
    quarterly_labelling: mockSalesData.quarterlyLabelling,
    top_products: mockSalesData.topProducts,
    top_customers: mockSalesData.topCustomers,
    top_customers_monthly: mockSalesData.topCustomersMonthly,
    monthly_trend: mockSalesData.monthlyTrend,
    monthly_revenue: mockSalesData.monthlyRevenue,
  };

  console.log('📊 Revenue by Segment (will be locked):');
  console.log(mockSalesData.revenueBySegment.map(s => `  - ${s.segment}`).join('\n'));
  
  console.log('\n👥 Account Managers (will be locked):');
  console.log(mockSalesData.accountManagers.map(m => `  - ${m.name}`).join('\n'));

  console.log('\n📅 Monthly segments for all 12 months');
  Object.keys(mockSalesData.revenueBySegmentMonthly).forEach(month => {
    const segments = mockSalesData.revenueBySegmentMonthly[month];
    console.log(`  ${month}: ${segments.map(s => s.segment).join(', ')}`);
  });

  try {
    const { data: existing, error: fetchError } = await supabase
      .from('sales')
      .select('id')
      .eq('id', 1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('sales')
        .update(dataToLock)
        .eq('id', 1);

      if (updateError) throw updateError;
      console.log('\n✅ Successfully UPDATED row id=1 in sales table');
      console.log('⚠️  ALL PREVIOUS ADMIN EDITS HAVE BEEN OVERWRITTEN');
    } else {
      const { error: insertError } = await supabase
        .from('sales')
        .insert([{ id: 1, ...dataToLock }]);

      if (insertError) throw insertError;
      console.log('\n✅ Successfully INSERTED row id=1 in sales table');
    }

    console.log('\n🎉 Dashboard data is now locked in Supabase!');
    console.log('   All segments and account managers will persist across refreshes.');
    console.log('   Admin mode edits will now modify THIS baseline data.');
    
  } catch (error) {
    console.error('\n❌ Error locking data to Supabase:', error);
    throw error;
  }
}

lockDashboardData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
