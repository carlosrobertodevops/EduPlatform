import { DashboardPage } from "@/components/pages/dashboard/dashboard";
import { getDashboardStats } from "@/services/dashboard";

export default async function () {
  const dashboardStats = await getDashboardStats()

  return <DashboardPage stats={dashboardStats.data!} />
}