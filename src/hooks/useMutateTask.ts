import { useStore } from '@/store/index';
import { useRouter } from 'next/router'
import axios from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Task } from '@prisma/client'
import { EditedTask } from '@/types'

export default function useMutationTask() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const reset = useStore((store) => store.resetEditedTask)

  const createTaskMutation = useMutation(
    async(task: Omit<EditedTask, 'id'>) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task
      )
      return res.data
    },
    {
      onSuccess(res) {
        // キャッシュから全タスクを読み込み
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        // キャッシュデータに新しいタスクを追加
        if (previousTodos) {
          queryClient.setQueryData(['tasks'], [res, ...previousTodos])
        }
        // zustand の EditedTask の状態をリセット
        reset()
      },
      onError(e: any) {
        reset()
        if (e.response.status === '401' || e.response.status === '403') {
          router.push('/')
        }
      },
    }
  )

  const updateTaskMutation = useMutation(
    async(task: EditedTask) => {
      // パラメータのId を付与して、Patchで処理
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task
      )
      return res.data
    },
    {
      onSuccess(res) {
        // キャッシュから全タスクを読み込み
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        // キャッシュデータの中から同一IDがあれば置き換える
        if (previousTodos) {
          queryClient.setQueryData(['taskss'], previousTodos.map((task) => task.id === res.id ? res : task))
        }
        // zustand の EditedTask の状態をリセット
        reset()
      },
      onError: (err: any) => {
        reset()
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )
  
  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`)
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['tasks'],
            // ここにおける variables には、削除した taskId が入っている
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        if (err.response.status === 401 || err.response.status === 403) {
          router.push('/')
        }
      },
    }
  )

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation
  }
}