import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Todo, TodoState } from "../../types"

const initialState: TodoState = {
  todos: [],
  filter: "all",
  searchQuery: "",
  draggedTodo: null,
}

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.unshift(action.payload)
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex((todo) => todo.id === action.payload.id)
      if (index !== -1) {
        state.todos[index] = action.payload
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload)
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    reorderTodos: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      const [movedTodo] = state.todos.splice(fromIndex, 1)
      state.todos.splice(toIndex, 0, movedTodo)
    },
    setFilter: (state, action: PayloadAction<"all" | "completed" | "incomplete">) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setDraggedTodo: (state, action: PayloadAction<Todo | null>) => {
      state.draggedTodo = action.payload
    },
  },
})

export const {
  setTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  reorderTodos,
  setFilter,
  setSearchQuery,
  setDraggedTodo,
} = todoSlice.actions
