"use client"

import type React from "react"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "./redux"
import { reorderTodos, setDraggedTodo } from "../store/slices/todoSlice"
import type { Todo } from "../types"

export const useDragAndDrop = () => {
  const dispatch = useAppDispatch()
  const { todos, draggedTodo } = useAppSelector((state) => state.todos)

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, todo: Todo) => {
      dispatch(setDraggedTodo(todo))
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/html", e.currentTarget.outerHTML)
      e.dataTransfer.setData("text/plain", todo.id.toString())

      // Add a slight delay to allow the drag image to be set
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.style.opacity = "0.5"
        }
      }, 0)
    },
    [dispatch],
  )

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      dispatch(setDraggedTodo(null))
      if (e.currentTarget) {
        e.currentTarget.style.opacity = "1"
      }
    },
    [dispatch],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetTodo: Todo) => {
      e.preventDefault()

      if (!draggedTodo || draggedTodo.id === targetTodo.id) {
        return
      }

      const draggedIndex = todos.findIndex((todo) => todo.id === draggedTodo.id)
      const targetIndex = todos.findIndex((todo) => todo.id === targetTodo.id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        dispatch(reorderTodos({ fromIndex: draggedIndex, toIndex: targetIndex }))
      }
    },
    [dispatch, draggedTodo, todos],
  )

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  return {
    draggedTodo,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDragEnter,
    handleDragLeave,
  }
}
