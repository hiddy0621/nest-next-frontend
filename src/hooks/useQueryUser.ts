import axios from 'axios';
import { useRouter } from 'next/router';
import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';

export default function useQueryUser() {
  const router = useRouter()
  const getUser = async () => {
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`
    )
    return data
  }
  // React Query で API経由で取得したユーザーデータをブラウザにキャッシュする
  return useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    onError: (e: any) => {
      if (e.response.status === '401' || e.response.status === '403') {
        router.push('/')
      }
    },
  })
}