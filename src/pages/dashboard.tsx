
import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import * as Yup from 'yup'
import { IconDatabase } from '@tabler/icons'
import { LogoutIcon, ShieldCheckIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import {
  Anchor,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { Layout } from '@/components/Layout'
import UserInfo from '@/components/UserInfo'
import { useQueryClient } from '@tanstack/react-query'
import TaskForm from '@/components/TaskForm'
import TaskList from '@/components/TaskList'

export default function Dashboard() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = async () => {
    // ユーザーデータのキャッシュを残さないように消す
    queryClient.removeQueries(['use'])
    queryClient.removeQueries(['tasks'])
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
    router.push('/')
  }

  return (
    <Layout title="Dashboard">
      <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={logout}
      />
      <TaskForm />
      <TaskList />
      <UserInfo />
    </Layout>
  )
}
