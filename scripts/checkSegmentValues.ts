import { supabase } from '../supabaseClient';

async function checkSegmentValues() {
  console.log('🔍 Checking segment values in database...\n');

  try {
    const { data, error } = await supabase
      .from('sales')
      .select('revenue_by_segment_monthly')
      .single();

    if (error) {
      console.error('❌ Error fetching data:', error);
      return;
    }

    if (!data || !data.revenue_by_segment_monthly) {
      console.log('⚠️ No segment data found');
      return;
    }

    const monthlyData = data.revenue_by_segment_monthly;

    // Check "Short Term Storage" across all months
    console.log('📊 "Short Term Storage" values by month:');
    console.log('─'.repeat(60));

    Object.keys(monthlyData).forEach((month) => {
      const segments = monthlyData[month];
      const shortTermStorage = segments.find((s: any) => 
        s.segment.toLowerCase().includes('short term storage')
      );

      if (shortTermStorage) {
        console.log(`${month.padEnd(12)}: Revenue = ${shortTermStorage.revenue.toLocaleString().padStart(10)}`);
        console.log(`${' '.repeat(14)} Budget  = ${shortTermStorage.budget?.toLocaleString().padStart(10) || 'N/A'}`);
        console.log(`${' '.repeat(14)} LY Rev  = ${shortTermStorage.lastYearRevenue?.toLocaleString().padStart(10) || 'N/A'}`);
        console.log('─'.repeat(60));
      }
    });

    // Check the raw value type
    const maySegments = monthlyData['May'];
    if (maySegments) {
      const segment = maySegments.find((s: any) => 
        s.segment.toLowerCase().includes('short term storage')
      );
      if (segment) {
        console.log('\n🔬 Raw value details (May):');
        console.log(`  Type: ${typeof segment.revenue}`);
        console.log(`  Exact value: ${segment.revenue}`);
        console.log(`  Is integer: ${Number.isInteger(segment.revenue)}`);
        console.log(`  String representation: "${segment.revenue}"`);
      }
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

checkSegmentValues();
