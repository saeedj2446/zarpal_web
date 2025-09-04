"use client"

import { useMemo } from "react"
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react"
import { useAppSelector } from "../../../lib/hooks/redux"
import { Progress } from "../../../components/radix/progress"

export function TaskStats() {
  const { todos } = useAppSelector((state) => state.todos)

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((todo) => todo.completed).length
    const active = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      total,
      completed,
      active,
      completionRate,
    }
  }, [todos])

  if (stats.total === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 mb-6 border border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Progress Overview</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>{stats.completionRate}% Complete</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Completion Progress</span>
            <span>
              {stats.completed} of {stats.total} tasks
            </span>
          </div>
          <Progress value={stats.completionRate} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-background/50 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Circle className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">{stats.active}</div>
          </div>

          <div className="rounded-lg text-center p-3 bg-background/50  border">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Done</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          </div>

          <div className="text-center p-3 bg-background/50 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <div className="text-2xl font-bold text-purple-500">{stats.total}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
