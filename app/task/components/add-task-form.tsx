"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Loader2 } from "lucide-react"


import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/radix/form"
import {Button} from "@/components/radix/button";
import {Input} from "@/components/radix/input";
import {useTodos} from "@/lib/hooks/useTodos";
import {CreateTodoFormData, createTodoSchema} from "@/lib/validations/todo";

export function AddTaskForm() {
  const { createTodo, isCreating } = useTodos()
  const [isExpanded, setIsExpanded] = useState(false)

  const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      todo: "",
      completed: false,
    },
  })

  const onSubmit = (data: CreateTodoFormData) => {
    createTodo({
      ...data,
      userId: 1, // Default user ID for demo
    })
    form.reset()
    setIsExpanded(false)
  }

  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="todo"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Add a new task..."
                      className="text-base"
                      onFocus={() => setIsExpanded(true)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isCreating || !form.watch("todo").trim()} className="px-4">
              {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          {isExpanded && (
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset()
                  setIsExpanded(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isCreating || !form.watch("todo").trim()}>
                {isCreating ? "Adding..." : "Add Task"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  )
}
