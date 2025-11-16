import { supabase } from '../supabaseClient';

async function addMissingColumn() {
  console.log('🔧 Adding missing top_customers_total column to Supabase...\n');

  try {
    // Execute SQL to add the column
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE sales 
        ADD COLUMN IF NOT EXISTS top_customers_total JSONB DEFAULT '[]'::jsonb;
      `
    });

    if (error) {
      console.error('❌ Error adding column:', error);
      console.log('\n⚠️  The RPC function might not exist. You need to add this column manually.');
      console.log('\n📝 Manual steps:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Navigate to: Table Editor → sales table');
      console.log('3. Click "Add Column"');
      console.log('4. Set:');
      console.log('   - Name: top_customers_total');
      console.log('   - Type: jsonb');
      console.log('   - Default value: []');
      console.log('   - Nullable: Yes');
      console.log('5. Click "Save"\n');
      return;
    }

    console.log('✅ Column added successfully!');
    console.log('   You can now save segment data without errors.\n');

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    console.log('\n📝 Please add the column manually in Supabase:');
    console.log('1. Open Supabase Dashboard → SQL Editor');
    console.log('2. Run this SQL:');
    console.log('   ALTER TABLE sales ADD COLUMN IF NOT EXISTS top_customers_total JSONB DEFAULT \'[]\'::jsonb;');
    console.log('3. Click "Run"\n');
  }
}

addMissingColumn();
