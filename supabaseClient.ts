import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vckvjvswmwlfvieudjrf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZja3ZqdnN3bXdsZnZpZXVkanJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjYxODQsImV4cCI6MjA3NzA0MjE4NH0.DnDVqf59Lfipcww6Orbwunxk-lZ_2kviuHOMcxpKLE4'

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

