import { useAuth } from "@/providers/AuthProvider"


export const useUser = () => {
  const { user } = useAuth()

  return {
    user,
    subscription: user?.sub ? {
      id: user?.sub,
      title: user?.subTitle,
      color: user?.subColor,
      startDate: user?.subStartDate,
      endDate: user?.subEndDate
    } : null
  }
}
