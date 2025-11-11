import { supabase } from '../supabaseClient';
import { mockSalesData } from '../mocks/dashboardData';

async function lockDashboardData() {
  console.log('🔒 Locking dashboard data to Supabase...\n');

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

  console.log('📊 Revenue by Segment (locked):');
  console.log(mockSalesData.revenueBySegment.map(s => `  - ${s.segment}`).join('\n'));
  
  console.log('\n👥 Account Managers (locked):');
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
    } else {
      const { error: insertError } = await supabase
        .from('sales')
        .insert([{ id: 1, ...dataToLock }]);

      if (insertError) throw insertError;
      console.log('\n✅ Successfully INSERTED row id=1 in sales table');
    }

    console.log('\n🎉 Dashboard data is now locked in Supabase!');
    console.log('   All segments and account managers will persist across refreshes.');
    
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
