import { supabase } from '../supabaseClient';

const TABLES = ['sales', 'risks', 'contracts', 'real_estate', 'logistics', 'warehouse', 'vas', 'po'];

async function cleanupOldRows() {
  console.log('🧹 Starting cleanup of old data rows...');
  
  for (const table of TABLES) {
    try {
      const { data: latestRow, error: fetchError } = await supabase
        .from(table)
        .select('id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (fetchError) {
        console.error(`❌ Error fetching latest row from ${table}:`, fetchError);
        continue;
      }
      
      if (!latestRow) {
        console.log(`⚠️ No rows found in ${table}, skipping...`);
        continue;
      }
      
      const { data: deletedRows, error: deleteError } = await supabase
        .from(table)
        .delete()
        .neq('id', latestRow.id)
        .select('id');
      
      if (deleteError) {
        console.error(`❌ Error deleting old rows from ${table}:`, deleteError);
        continue;
      }
      
      const count = deletedRows?.length || 0;
      console.log(`✅ Cleaned up ${count} old row(s) from ${table} (kept ID: ${latestRow.id})`);
      
    } catch (error) {
      console.error(`❌ Unexpected error cleaning ${table}:`, error);
    }
  }
  
  console.log('🎉 Cleanup completed!');
}

export { cleanupOldRows };

if (require.main === module) {
  cleanupOldRows()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
