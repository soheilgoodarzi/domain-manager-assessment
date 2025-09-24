import { Domain } from "@/types/domain"
import axios from "axios"

const apiClient = axios.create({
  baseURL: "https://domain-danajo.liara.run/api/Domain/",
  headers: {
    "Content-Type": "application/json",
  },
})

type PaginatedDomainsResponse = {
  count: number
  next: string | null
  previous: string | null
  results: Domain[]
}

export const getDomains = async (): Promise<Domain[]> => {
  try {
    const response = await apiClient.get<PaginatedDomainsResponse>("/")
    return response.data.results
  } catch (error) {
    console.error("Failed to fetch domains:", error)
    return []
  }
}

export type CreateDomainInput = {
  domain: string
  status: 1 | 2 | 3
  isActive: boolean
}

export const createDomain = async (
  newDomain: CreateDomainInput
): Promise<Domain> => {
  const response = await apiClient.post<Domain>("/", newDomain)
  return response.data
}
export default apiClient
