import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodosResponse,
  RegisterUserReq,
  DtoIn_Otp,
  DtoIn_Password, DtoOut_Response, DtoOut_Session
} from "../types"
import {API_BASE, apiRequest} from "@/lib/api/apiRequest";



export const authApi = {
  registerUserReq: async (data: RegisterUserReq): Promise<DtoOut_Session> => {
    return apiRequest(`${API_BASE}/registerUserReq`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  registerUserAut: async (data: DtoIn_Otp): Promise<DtoOut_Response> => {
    return apiRequest(`${API_BASE}/registerUserAut`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
  registerUserPas: async (data: DtoIn_Password): Promise<DtoOut_Response> => {
    return apiRequest(`${API_BASE}/registerUserPas`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}


