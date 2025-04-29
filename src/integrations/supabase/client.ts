
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database';

const supabaseUrl = 'https://xexgdtlctyuycohzhmuu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleGdkdGxjdHl1eWNvaHpobXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzY0NTMsImV4cCI6MjA2MTQ1MjQ1M30.hbqL05Y8UMfVaOa4nbDQNClCfjk_yRg_dtoL09_yGyo'

export const supabase = createClient(supabaseUrl, supabaseKey)
