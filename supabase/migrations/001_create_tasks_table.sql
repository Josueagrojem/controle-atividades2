-- Criar tabela de tarefas
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  sharepoint_id TEXT NOT NULL,
  responsible TEXT NOT NULL,
  involved TEXT[] DEFAULT '{}',
  start_date TEXT NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('todo', 'doing', 'done', 'overdue')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar função para criar tabela se não existir (para compatibilidade)
CREATE OR REPLACE FUNCTION create_tasks_table_if_not_exists()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- A tabela já foi criada acima, esta função é apenas para compatibilidade
  NULL;
END;
$$;

-- Adicionar RLS (Row Level Security) - permitir acesso público por enquanto
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Permitir acesso público às tarefas" ON tasks
FOR ALL USING (true);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_responsible ON tasks(responsible);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);