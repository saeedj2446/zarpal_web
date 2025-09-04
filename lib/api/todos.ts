import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodosResponse } from "../types"

const DUMMY_API_BASE = "https://dummyjson.com"

const apiRequest = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const todosApi = {
  getTodos: async (): Promise<TodosResponse> => {
    return apiRequest(`${DUMMY_API_BASE}/todos?limit=20&skip=0`)
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    return apiRequest(`${DUMMY_API_BASE}/todos/add`, {
      method: "POST",
      body: JSON.stringify(todo),
    })
  },

  // Update a todo
  updateTodo: async ({ id, ...updates }: UpdateTodoRequest): Promise<Todo> => {
    return apiRequest(`${DUMMY_API_BASE}/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  },

  // Delete a todo
  deleteTodo: async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
    return apiRequest(`${DUMMY_API_BASE}/todos/${id}`, {
      method: "DELETE",
    })
  },
}
