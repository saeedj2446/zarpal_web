"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit2, Trash2, X, Save, GripVertical } from "lucide-react"
import { Button } from "../../../components/radix/button"
import { Input } from "../../../components/radix/input"
import { Checkbox } from "../../../components/radix/checkbox"
import { Form, FormControl, FormField, FormItem } from "../../../components/radix/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/radix/alert-dialog"
import { useTodos } from "../../../lib/hooks/useTodos"
import { useDragAndDrop } from "../../../lib/hooks/useDragAndDrop"
import { useAppDispatch } from "../../../lib/hooks/redux"
import { toggleTodo } from "../../../lib/store/slices/todoSlice"
import { updateTodoSchema, type UpdateTodoFormData } from "../../../lib/validations/todo"
import type { Todo } from "../../../lib/types"
import { cn } from "../../../lib/utils"

interface TaskItemProps {
  todo: Todo
  isDragging?: boolean
}

export function TaskItem({ todo, isDragging = false }: TaskItemProps) {
  const { updateTodo, deleteTodo, isUpdating, isDeleting } = useTodos()
  const dispatch = useAppDispatch()
  const [isEditing, setIsEditing] = useState(false)

  const { draggedTodo, handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragEnter, handleDragLeave } =
    useDragAndDrop()

  const isBeingDragged = draggedTodo?.id === todo.id

  const form = useForm<UpdateTodoFormData>({
    resolver: zodResolver(updateTodoSchema),
    defaultValues: {
      todo: todo.todo,
    },
  })

  const handleToggleComplete = () => {
    dispatch(toggleTodo(todo.id))
    updateTodo({
      id: todo.id,
      completed: !todo.completed,
    })
  }

  const handleEdit = (data: UpdateTodoFormData) => {
    updateTodo({
      id: todo.id,
      todo: data.todo,
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteTodo(todo.id)
  }

  const handleCancelEdit = () => {
    form.reset({ todo: todo.todo })
    setIsEditing(false)
  }

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => handleDragStart(e, todo)}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, todo)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={cn(
        "group bg-card rounded-lg border p-4 shadow-sm transition-all duration-300 cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:border-primary/20 hover:scale-[1.01]",
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
        isBeingDragged && "opacity-50 rotate-1 scale-105 shadow-lg border-primary/50 z-10",
        draggedTodo && draggedTodo.id !== todo.id && "border-dashed border-primary/30 bg-primary/5",
        todo.completed && "opacity-75 bg-muted/30",
        isEditing && "cursor-default ring-2 ring-primary/20",
      )}
    >
      <div className="flex items-start gap-3">
        {!isEditing && (
          <div className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </div>
        )}

        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggleComplete}
          className="mt-1 flex-shrink-0 transition-all duration-200 hover:scale-110"
        />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="todo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  <Button type="submit" size="sm" disabled={isUpdating} className="transition-all duration-200">
                    <Save className="h-3 w-3 mr-1" />
                    {isUpdating ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="transition-all duration-200 bg-transparent"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <div
              className={cn(
                "text-base cursor-pointer transition-all duration-200 select-none hover:text-primary",
                todo.completed && "line-through text-muted-foreground hover:text-muted-foreground",
              )}
              onClick={handleToggleComplete}
            >
              {todo.todo}
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all duration-200"
            >
              <Edit2 className="h-3 w-3" />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Task</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this task? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  )
}
