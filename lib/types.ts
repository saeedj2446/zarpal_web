// Core TypeScript interfaces for the application
export interface Dto_Response {
  responseCode: number
  responseData: any
  responseText:string
}
export interface DtoOut_Response {
  sessionId: string
  encPassword: string
  clientTime: string
}
export interface DtoOut_Session {
  response: Dto_Response
}
export interface DtoIn_Otp {
  sessionId: string
  otp: string
}
export interface DtoIn_Password {
  sessionId: string
  encPassword: string
  clientTime: string
}
export interface RegisterUserReq {
  natId: number
  contact: string
  birthDate: string
  hostId: number
  recommender: string
  clientTime: string
  mac: string
}













export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface CreateTodoRequest {
  todo: string
  completed: boolean
  userId: number
}

export interface UpdateTodoRequest {
  id: number
  todo?: string
  completed?: boolean
}

export interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

export interface TodoState {
  todos: Todo[]
  filter: "all" | "completed" | "incomplete"
  searchQuery: string
  draggedTodo: Todo | null
}
