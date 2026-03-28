import { supabase } from '../supabaseClient';

async function updateSalesCustomersTotal() {
  console.log('🔄 Updating sales data with top_customers_total field...');

  try {
    // Update the sales table with the new top_customers_total column
    // The column name is snake_case in the database
    const { error: updateError } = await supabase
      .from('sales')
      .update({
        top_customers_total: [
          { name: 'Client 1', sales: 0, color: '#00617f' },
          { name: 'Client 2', sales: 0, color: '#00617f' },
          { name: 'Client 3', sales: 0, color: '#00617f' },
          { name: 'Client 4', sales: 0, color: '#00617f' },
          { name: 'Client 5', sales: 0, color: '#00617f' },
          { name: 'Client 6', sales: 0, color: '#00617f' },
          { name: 'Client 7', sales: 0, color: '#00617f' },
          { name: 'Client 8', sales: 0, color: '#00617f' },
          { name: 'Client 9', sales: 0, color: '#00617f' },
          { name: 'Client 10', sales: 0, color: '#00617f' },
        ],
      })
      .eq('id', 1);

    if (updateError) {
      console.error('❌ Error updating sales data:', updateError);
      return;
    }

    console.log('✅ Successfully updated sales data with top_customers_total!');
    console.log('✅ Total tab now has 10 editable customers (Client 1-10)');
    
    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('sales')
      .select('top_customers_total')
      .eq('id', 1)
      .single();

    if (!verifyError && verifyData) {
      console.log('✅ Verified:', verifyData);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

updateSalesCustomersTotal();
