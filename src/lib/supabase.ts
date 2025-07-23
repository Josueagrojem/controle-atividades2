import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project-ref.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tabela de tarefas
export interface DatabaseTask {
  id: string
  title: string
  sharepoint_id: string
  responsible: string
  involved: string[]
  start_date: string
  deadline: string
  status: 'todo' | 'doing' | 'done' | 'overdue'
  description?: string
  created_at: string
  updated_at: string
}