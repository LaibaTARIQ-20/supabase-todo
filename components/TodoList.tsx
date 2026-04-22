'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, type Todo } from '@/lib/supabase'

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [adding, setAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load todos on mount
  useEffect(() => {
    fetchTodos()

    // Realtime subscription — updates list on any DB change
    const channel = supabase
      .channel('todos-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        () => fetchTodos()
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) setTodos(data)
    setLoading(false)
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    const task = newTask.trim()
    if (!task) return

    setAdding(true)
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('todos')
      .insert({ task, user_id: user!.id })

    if (!error) {
      setNewTask('')
      inputRef.current?.focus()
    }
    setAdding(false)
  }

  const toggleDone = async (todo: Todo) => {
    await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', todo.id)
  }

  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id)
  }

  const pending = todos.filter(t => !t.done)
  const completed = todos.filter(t => t.done)

  if (loading) {
    return <div className="text-stone-400 text-sm text-center py-10">Loading todos...</div>
  }

  return (
    <div>
      {/* Add todo form */}
      <form onSubmit={addTodo} className="flex gap-2 mb-8">
        <input
          ref={inputRef}
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent transition"
        />
        <button
          type="submit"
          disabled={adding || !newTask.trim()}
          className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>

      {/* Empty state */}
      {todos.length === 0 && (
        <div className="text-center py-16 text-stone-300">
          <div className="text-4xl mb-3">✓</div>
          <p className="text-sm">No todos yet — add one above!</p>
        </div>
      )}

      {/* Pending todos */}
      {pending.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">
            Tasks · {pending.length}
          </p>
          <div className="space-y-2">
            {pending.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleDone} onDelete={deleteTodo} />
            ))}
          </div>
        </div>
      )}

      {/* Completed todos */}
      {completed.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">
            Completed · {completed.length}
          </p>
          <div className="space-y-2">
            {completed.map(todo => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleDone} onDelete={deleteTodo} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${todo.done
        ? 'bg-stone-50 border-stone-100'
        : 'bg-white border-stone-200 hover:border-stone-300'
      }`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${todo.done
            ? 'bg-stone-800 border-stone-800'
            : 'border-stone-300 hover:border-stone-500'
          }`}
      >
        {todo.done && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>

      {/* Task text */}
      <span className={`flex-1 text-sm transition-all ${todo.done ? 'line-through text-stone-400' : 'text-stone-700'
        }`}>
        {todo.task}
      </span>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all text-lg leading-none"
        title="Delete"
      >
        ×
      </button>
    </div>
  )
}