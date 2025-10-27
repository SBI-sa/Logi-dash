import { createClient } from '@supabase/supabase-js'

// Your Supabase credentials
const supabaseUrl = 'https://vckvjvswmwlfvieudjrf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZja3ZqdnN3bXdsZnZpZXVkanJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjYxODQsImV4cCI6MjA3NzA0MjE4NH0.DnDVqf59Lfipcww6Orbwunxk-lZ_2kviuHOMcxpKLE4'

// Create a single supabase client for your whole app
export const supabase = createClient(supabaseUrl, supabaseKey)
