import { useState, useEffect } from 'react'
import { supabase, DatabaseTask } from '@/lib/supabase'
import { Task, TaskFormData } from '@/types/task'
import { useToast } from '@/hooks/use-toast'

// Função para converter DatabaseTask para Task
const convertToTask = (dbTask: DatabaseTask): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  sharepointId: dbTask.sharepoint_id,
  responsible: dbTask.responsible,
  involved: dbTask.involved,
  startDate: dbTask.start_date,
  deadline: dbTask.deadline,
  status: dbTask.status,
  description: dbTask.description,
  createdAt: dbTask.created_at,
  updatedAt: dbTask.updated_at
})

// Função para converter Task para DatabaseTask
const convertToDbTask = (task: Task): Omit<DatabaseTask, 'created_at' | 'updated_at'> => ({
  id: task.id,
  title: task.title,
  sharepoint_id: task.sharepointId,
  responsible: task.responsible,
  involved: task.involved,
  start_date: task.startDate,
  deadline: task.deadline,
  status: task.status,
  description: task.description
})

export const useSupabaseTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Função para criar tabela se não existir
  const initializeDatabase = async () => {
    try {
      const { error } = await supabase.rpc('create_tasks_table_if_not_exists')
      if (error && !error.message.includes('already exists')) {
        console.error('Error creating table:', error)
      }
    } catch (err) {
      console.error('Error initializing database:', err)
    }
  }

  // Migrar dados do localStorage para Supabase
  const migrateFromLocalStorage = async () => {
    try {
      const localTasks = localStorage.getItem('tasks')
      if (localTasks) {
        const parsedTasks: Task[] = JSON.parse(localTasks)
        
        // Verificar se já existem tarefas no banco
        const { data: existingTasks } = await supabase
          .from('tasks')
          .select('id')
          .limit(1)
        
        // Se não existe nenhuma tarefa no banco, fazer migração
        if (!existingTasks || existingTasks.length === 0) {
          const dbTasks = parsedTasks.map(convertToDbTask)
          
          const { error } = await supabase
            .from('tasks')
            .insert(dbTasks)
          
          if (error) {
            console.error('Error migrating tasks:', error)
          } else {
            toast({
              title: "Migração concluída",
              description: `${parsedTasks.length} tarefas migradas do armazenamento local`,
            })
            // Limpar localStorage após migração bem-sucedida
            localStorage.removeItem('tasks')
          }
        }
      }
    } catch (err) {
      console.error('Error during migration:', err)
    }
  }

  // Carregar tarefas do Supabase
  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading tasks:', error)
        toast({
          title: "Erro ao carregar tarefas",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      if (data) {
        const convertedTasks = data.map(convertToTask)
        setTasks(convertedTasks)
      }
    } catch (err) {
      console.error('Error loading tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar nova tarefa
  const addTask = async (taskData: TaskFormData) => {
    try {
      const newTask: Omit<DatabaseTask, 'created_at' | 'updated_at'> = {
        id: crypto.randomUUID(),
        title: taskData.title,
        sharepoint_id: taskData.sharepointId,
        responsible: taskData.responsible,
        involved: taskData.involved || [],
        start_date: taskData.startDate,
        deadline: taskData.deadline,
        status: taskData.status,
        description: taskData.description
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single()

      if (error) {
        toast({
          title: "Erro ao criar tarefa",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      if (data) {
        const convertedTask = convertToTask(data)
        setTasks(prev => [convertedTask, ...prev])
        toast({
          title: "Tarefa criada",
          description: "Nova tarefa adicionada com sucesso",
        })
      }
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  // Atualizar tarefa
  const updateTask = async (taskId: string, updates: Partial<TaskFormData>) => {
    try {
      const updateData: any = { updated_at: new Date().toISOString() }
      
      if (updates.title) updateData.title = updates.title
      if (updates.sharepointId) updateData.sharepoint_id = updates.sharepointId
      if (updates.responsible) updateData.responsible = updates.responsible
      if (updates.involved) updateData.involved = updates.involved
      if (updates.startDate) updateData.start_date = updates.startDate
      if (updates.deadline) updateData.deadline = updates.deadline
      if (updates.status) updateData.status = updates.status
      if (updates.description !== undefined) updateData.description = updates.description

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single()

      if (error) {
        toast({
          title: "Erro ao atualizar tarefa",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      if (data) {
        const convertedTask = convertToTask(data)
        setTasks(prev => prev.map(task => 
          task.id === taskId ? convertedTask : task
        ))
        toast({
          title: "Tarefa atualizada",
          description: "Tarefa modificada com sucesso",
        })
      }
    } catch (err) {
      console.error('Error updating task:', err)
    }
  }

  // Deletar tarefa
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) {
        toast({
          title: "Erro ao deletar tarefa",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      setTasks(prev => prev.filter(task => task.id !== taskId))
      toast({
        title: "Tarefa deletada",
        description: "Tarefa removida com sucesso",
      })
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  // Atualizar status da tarefa
  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single()

      if (error) {
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive"
        })
        return
      }

      if (data) {
        const convertedTask = convertToTask(data)
        setTasks(prev => prev.map(task => 
          task.id === taskId ? convertedTask : task
        ))
      }
    } catch (err) {
      console.error('Error updating task status:', err)
    }
  }

  useEffect(() => {
    const initialize = async () => {
      await initializeDatabase()
      await migrateFromLocalStorage()
      await loadTasks()
    }
    
    initialize()

    // Configurar real-time subscriptions
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks' 
      }, () => {
        loadTasks() // Recarregar tarefas quando houver mudanças
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  }
}