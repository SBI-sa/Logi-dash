import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
// Upload and overwrite dashboard images securely
export async function uploadDashboardImage(
  file: File,
  section: "real_estate" | "warehouse",
  imageName: string
) {
  try {
    const filePath = `${section}/${imageName}`

    // Upload file (and overwrite if it already exists)
    const { error: uploadError } = await supabase.storage
      .from("dashboard-images")
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    console.log("✅ Uploaded:", filePath)
    return { success: true, filePath }
  } catch (error) {
    console.error("❌ Upload failed:", error)
    return { success: false, error }
  }
}

