import { supabase } from '../supabaseClient';

async function checkSupabaseData() {
  console.log('🔍 Checking current Supabase data...\n');

  try {
    const { data, error } = await supabase
      .from('sales')
      .select('revenue_by_segment, revenue_by_segment_monthly, account_managers')
      .eq('id', 1)
      .single();

    if (error) throw error;

    console.log('📊 Revenue by Segment:');
    if (data.revenue_by_segment) {
      data.revenue_by_segment.forEach((s: any) => {
        console.log(`  - ${s.segment}: $${s.revenue.toLocaleString()}`);
      });
    } else {
      console.log('  (No data)');
    }

    console.log('\n👥 Account Managers:');
    if (data.account_managers) {
      data.account_managers.forEach((m: any) => {
        console.log(`  - ${m.name}: $${m.revenue.toLocaleString()}`);
      });
    } else {
      console.log('  (No data)');
    }

    console.log('\n📅 Monthly Segments Sample (January):');
    if (data.revenue_by_segment_monthly?.January) {
      data.revenue_by_segment_monthly.January.forEach((s: any) => {
        console.log(`  - ${s.segment}: $${s.revenue.toLocaleString()}`);
      });
    } else {
      console.log('  (No data)');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSupabaseData();
