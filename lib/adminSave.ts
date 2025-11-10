import { Alert } from 'react-native';
import { supabase } from '../supabaseClient';
import type {
  SalesData,
  RiskData,
  RealEstateData,
  LogisticsData,
  WarehouseData,
  VASData,
  POData,
} from '@/mocks/dashboardData';
import type { LastUpdatedData } from '../contexts/DataContext';

/**
 * Helper: Map camelCase TypeScript object to snake_case database columns
 * This is the reverse of mapDbToUi in DataContext
 */
function mapUiToDb(uiData: any): any {
  const dbData: any = {};

  Object.keys(uiData).forEach((key) => {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    dbData[snakeKey] = uiData[key];
  });

  return dbData;
}

/**
 * Generic save function for any table
 * Tries to update first, falls back to upsert if row doesn't exist
 */
async function saveToSupabase<T>(
  tableName: string,
  data: T,
  displayName: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    console.log(`[adminSave] Saving ${displayName}...`);

    // Map camelCase to snake_case
    const dbData = mapUiToDb(data);

    // Try to update existing row (id = 1)
    const { data: updatedData, error: updateError } = await supabase
      .from(tableName)
      .update(dbData)
      .eq('id', 1)
      .select()
      .single();

    if (updateError) {
      // If update failed because row doesn't exist, try upsert
      if (updateError.code === 'PGRST116' || updateError.message.includes('no rows')) {
        console.warn(`[adminSave] Row doesn't exist for ${displayName}, upserting...`);

        const { data: upsertedData, error: upsertError } = await supabase
          .from(tableName)
          .upsert({ id: 1, ...dbData })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        console.log(`✅ [adminSave] ${displayName} created successfully via upsert`);
        Alert.alert('Success', `${displayName} saved successfully!`);
        return { success: true, data: upsertedData };
      }

      // Other update errors
      throw updateError;
    }

    console.log(`✅ [adminSave] ${displayName} updated successfully`);
    Alert.alert('Success', `${displayName} saved successfully!`);
    return { success: true, data: updatedData };
  } catch (error) {
    console.error(`❌ [adminSave] Failed to save ${displayName}:`, error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    Alert.alert(
      'Save Failed',
      `Could not save ${displayName}. ${errorMessage}. Please try again.`
    );

    return { success: false, error: errorMessage };
  }
}

/**
 * Save Sales Data
 */
export async function saveSalesData(data: SalesData) {
  return saveToSupabase('sales', data, 'Sales Data');
}

/**
 * Save Risks Data
 */
export async function saveRisksData(data: RiskData) {
  return saveToSupabase('risks', data, 'Risks Data');
}

/**
 * Save Real Estate Data
 */
export async function saveRealEstateData(data: RealEstateData) {
  return saveToSupabase('real_estate', data, 'Real Estate Data');
}

/**
 * Save Logistics Data
 */
export async function saveLogisticsData(data: LogisticsData) {
  return saveToSupabase('logistics', data, 'Logistics Data');
}

/**
 * Save Warehouse Data
 */
export async function saveWarehouseData(data: WarehouseData) {
  return saveToSupabase('warehouse', data, 'Warehouse Data');
}

/**
 * Save VAS Data
 */
export async function saveVasData(data: VASData) {
  return saveToSupabase('vas', data, 'VAS Data');
}

/**
 * Save PO Data
 */
export async function savePoData(data: POData) {
  return saveToSupabase('po', data, 'PO Data');
}

/**
 * Save Last Updated timestamps
 * Note: last_updated table stores timestamps in a JSONB field
 */
export async function saveLastUpdated(timestamps: LastUpdatedData) {
  try {
    console.log('[adminSave] Saving last updated timestamps...');

    const { data: updatedData, error: updateError } = await supabase
      .from('last_updated')
      .update({ timestamps })
      .eq('id', 1)
      .select()
      .single();

    if (updateError) {
      // If update failed because row doesn't exist, try upsert
      if (updateError.code === 'PGRST116' || updateError.message.includes('no rows')) {
        console.warn('[adminSave] last_updated row doesn\'t exist, upserting...');

        const { data: upsertedData, error: upsertError } = await supabase
          .from('last_updated')
          .upsert({ id: 1, timestamps })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        console.log('✅ [adminSave] Last updated created successfully via upsert');
        return { success: true, data: upsertedData };
      }

      // Other update errors
      throw updateError;
    }

    console.log('✅ [adminSave] Last updated timestamps saved successfully');
    return { success: true, data: updatedData };
  } catch (error) {
    console.error('❌ [adminSave] Failed to save last updated:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';

    Alert.alert(
      'Save Failed',
      `Could not save timestamps. ${errorMessage}. Please try again.`
    );

    return { success: false, error: errorMessage };
  }
}

/**
 * Update a single card's last updated timestamp
 */
export async function updateCardTimestamp(cardKey: string, timestamp: string) {
  try {
    // First, fetch the current timestamps
    const { data: currentData, error: fetchError } = await supabase
      .from('last_updated')
      .select('timestamps')
      .eq('id', 1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Merge the new timestamp with existing ones
    const currentTimestamps = currentData?.timestamps || {};
    const updatedTimestamps = { ...currentTimestamps, [cardKey]: timestamp };

    // Save back to Supabase
    return saveLastUpdated(updatedTimestamps);
  } catch (error) {
    console.error('❌ [adminSave] Failed to update card timestamp:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Batch save multiple tables at once
 * Useful for saving related data changes together
 */
export async function batchSave(saves: Array<() => Promise<any>>) {
  console.log(`[adminSave] Starting batch save of ${saves.length} operations...`);

  const results = await Promise.allSettled(saves.map((saveFn) => saveFn()));

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  if (failed > 0) {
    console.warn(`⚠️ [adminSave] Batch save: ${succeeded} succeeded, ${failed} failed`);
    Alert.alert(
      'Partial Save',
      `${succeeded} of ${saves.length} saves completed. ${failed} failed. Check console for details.`
    );
  } else {
    console.log(`✅ [adminSave] Batch save: all ${succeeded} operations succeeded`);
    Alert.alert('Success', `All ${saves.length} saves completed successfully!`);
  }

  return {
    total: saves.length,
    succeeded,
    failed,
    results,
  };
}
