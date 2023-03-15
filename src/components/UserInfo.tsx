import useQueryUser from "@/hooks/useQueryUser";
import { Loader } from "@mantine/core";

export default function UserInfo() {
  const { data: user, status } = useQueryUser()
  if (status === 'loading') return <Loader />
  return (
    <div>
      <p>{user?.email}</p>
    </div>
  )
}