import { api } from "@/lib/api"

export const getDashboardStats = async () => {
  return api<APIGetDashboardStats>({
    endpoint: "/dashboard/"
  })
}