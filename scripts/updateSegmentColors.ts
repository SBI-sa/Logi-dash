import { supabase } from '../supabaseClient';

const NEW_COLORS = ['#00617f', '#a7aca1', '#081f2c', '#9b2743'];

async function updateSegmentColors() {
  console.log('🎨 Updating Revenue by Segment colors...');
  console.log('📋 New color palette:', NEW_COLORS);

  try {
    const { data: salesRow, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .single();

    if (fetchError) {
      console.error('❌ Failed to fetch sales data:', fetchError);
      return;
    }

    if (!salesRow) {
      console.error('❌ No sales data found');
      return;
    }

    console.log('✅ Fetched sales data');

    const revenueBySegmentMonthly = salesRow.revenue_by_segment_monthly || {};
    
    const months = Object.keys(revenueBySegmentMonthly);
    console.log(`📅 Found ${months.length} months of data:`, months.join(', '));

    const updatedMonthlyData: any = {};

    months.forEach((month) => {
      const segments = revenueBySegmentMonthly[month];
      if (!Array.isArray(segments)) {
        console.warn(`⚠️ Skipping ${month} - invalid data format`);
        return;
      }

      updatedMonthlyData[month] = segments.map((segment: any, index: number) => {
        const colorIndex = index % NEW_COLORS.length;
        const newColor = NEW_COLORS[colorIndex];
        
        console.log(`  ${month} - Segment ${index + 1}: "${segment.segment}" → ${newColor}`);
        
        return {
          ...segment,
          color: newColor,
        };
      });
    });

    console.log('\n💾 Saving updated colors to Supabase...');

    const { error: updateError } = await supabase
      .from('sales')
      .update({
        revenue_by_segment_monthly: updatedMonthlyData,
      })
      .eq('id', salesRow.id);

    if (updateError) {
      console.error('❌ Failed to update colors:', updateError);
      return;
    }

    console.log('✅ Successfully updated all segment colors!');
    console.log('\n🎨 Color distribution:');
    NEW_COLORS.forEach((color, i) => {
      console.log(`  ${color} - Used for segments at positions ${i}, ${i+4}, ${i+8}, etc.`);
    });

    console.log('\n🔄 Refresh your browser to see the new colors!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

updateSegmentColors();
