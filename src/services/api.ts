import { Domain } from "@/types/domain"
import axios from "axios"
const apiClient = axios.create({
  baseURL: "https://domain-danajo.liara.run/api/Domain/",
  headers: {
    "Content-Type": "application/json",
  },
})

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const response = await apiClient.get<Domain[]>("/")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message)
      throw new Error(
        error.response?.data?.message || "An unknown error occurred"
      )
    } else {
      console.error("Unexpected error:", error)
      throw new Error("An unexpected error occurred")
    }
  }
}
export type CreateDomainInput = {
  domain: string | undefined
  status: 1 | 2 | 3 | undefined
  isActive: boolean | undefined
}
export const createDomain = async (
  newDomain: CreateDomainInput
): Promise<Domain> => {
  const response = await apiClient.post<Domain>("/", newDomain)
  return response.data
}
