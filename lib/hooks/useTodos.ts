"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { todosApi } from "../api/todos"
import { useAppDispatch, useAppSelector } from "./redux"
import { setTodos, addTodo, updateTodo, deleteTodo } from "../store/slices/todoSlice"
import type { Todo, CreateTodoRequest, UpdateTodoRequest } from "../types"
import { toast } from "./use-toast"

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const currentTodos = useAppSelector((state) => state.todos.todos);

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: () => todosApi.getTodos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  useEffect(() => {
    if (todosQuery.data?.todos) {
      if (currentTodos.length === 0) {
        dispatch(setTodos(todosQuery.data.todos))
      }
    }
  }, [todosQuery.data?.todos, dispatch, currentTodos.length])

  // Create todo mutation with optimistic updates
  const createTodoMutation = useMutation({
    mutationFn: todosApi.createTodo,
    onMutate: async (newTodo: CreateTodoRequest) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const optimisticTodo: Todo = {
        id: Date.now(), // Temporary ID
        todo: newTodo.todo,
        completed: newTodo.completed,
        userId: newTodo.userId,
      }

      // Add optimistic todo to Redux store (will appear at top)
      dispatch(addTodo(optimisticTodo))
      return { optimisticTodo }
    },
    onSuccess: (data, variables, context) => {
      if (context?.optimisticTodo) {
        // Replace optimistic todo with real todo from API
        dispatch(deleteTodo(context.optimisticTodo.id))
        dispatch(addTodo(data)) // This will add to top of list
      }
      toast({
        title: "Success",
        description: "Task added successfully!",
      })
    },
    onError: (error, variables, context) => {
      if (context?.optimisticTodo) {
        // Remove optimistic todo on error
        dispatch(deleteTodo(context.optimisticTodo.id))
      }
      toast({
        title: "Error",
        description: "Error in adding task(server side user Ath).",
        variant: "destructive",
      })
    },
  })

  // Update todo mutation
  const updateTodoMutation = useMutation({
    mutationFn: todosApi.updateTodo,
    onMutate: async (updatedTodo: UpdateTodoRequest) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData(["todos"])
      dispatch(updateTodo(updatedTodo as Todo))

      return { previousTodos }
    },
    onSuccess: (data) => {
      dispatch(updateTodo(data))
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast({
        title: "Success",
        description: "Task updated successfully!",
      })
    },
    onError: (error, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos)
      }
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: todosApi.deleteTodo,
    onMutate: async (todoId: number) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] })

      const previousTodos = queryClient.getQueryData(["todos"])
      dispatch(deleteTodo(todoId))

      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] })
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      })
    },
    onError: (error, variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos)
      }
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    },
  })

  return {
    todos: todosQuery.data?.todos || [],
    isLoading: todosQuery.isPending,
    error: todosQuery.error,
    refetch: todosQuery.refetch,
    createTodo: createTodoMutation.mutateAsync,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate,
    isCreating: createTodoMutation.isPending,
    isUpdating: updateTodoMutation.isPending,
    isDeleting: deleteTodoMutation.isPending,
  }
}
