import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nkljmavbtabuohjyguwn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbGptYXZidGFidW9oanlndXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzYzNDYsImV4cCI6MjA2ODgxMjM0Nn0.J7DW0qa49DsyFCpvxou_ZOiM9yH-DUXfdxqB5MWloRk'

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
