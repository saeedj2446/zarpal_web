"use client"

import { useMemo } from "react"
import { TaskItem } from "./task-item"
import { useAppSelector } from "../../../lib/hooks/redux"
import { useTodos } from "../../../lib/hooks/useTodos"
import { useDragAndDrop } from "../../../lib/hooks/useDragAndDrop"
import { Loader2, CheckCircle2, Circle, AlertCircle, Move } from "lucide-react"
import { Button } from "../../../components/radix/button"

export function TaskList() {
  const { isLoading, error, refetch } = useTodos()
  const { todos, filter, searchQuery } = useAppSelector((state) => state.todos)
  const { draggedTodo } = useDragAndDrop()

  const filteredTodos = useMemo(() => {
    let filtered = todos

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((todo) => todo.todo.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    switch (filter) {
      case "completed":
        filtered = filtered.filter((todo) => todo.completed)
        break
      case "incomplete":
        filtered = filtered.filter((todo) => !todo.completed)
        break
      default:
        // "all" - no additional filtering
        break
    }

    return filtered
  }, [todos, filter, searchQuery])

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length

  if (isLoading && todos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading tasks from API...
        </div>
      </div>
    )
  }

  if (error && todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-5 w-5" />
          Failed to load tasks from API
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-2">
          {searchQuery.trim() ? "No tasks match your search" : "No tasks yet"}
        </div>
        {!searchQuery.trim() && (
          <div className="text-sm text-muted-foreground">Add your first task above to get started!</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4" />
          <span>{totalCount - completedCount} Active</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{completedCount} Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Total: {totalCount}</span>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span>Offline Mode</span>
          </div>
        )}
        {filteredTodos.length > 1 && (
          <div className="flex items-center gap-2 text-primary">
            <Move className="h-4 w-4" />
            <span>Drag to reorder</span>
          </div>
        )}
      </div>

      {draggedTodo && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg border border-primary/20 shadow-lg">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4" />
              <span>Reordering: {draggedTodo.todo.substring(0, 30)}...</span>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
          <TaskItem key={todo.id} todo={todo} isDragging={draggedTodo?.id === todo.id} />
        ))}
      </div>
    </div>
  )
}
