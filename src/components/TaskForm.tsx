import useMutationTask from '@/hooks/useMutateTask';
import { useStore } from '@/store/index';
import { FormEvent } from 'react';
import { Button, Center, TextInput } from '@mantine/core';
import { IconDatabase } from '@tabler/icons';

export default function TaskForm() {
  // タスク初期値
  const { editedTask } = useStore()
  // update reducer
  const update = useStore((state) => state.updateEditedTask)
  const { createTaskMutation, updateTaskMutation } = useMutationTask()
  
  // 送信ハンドラ
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // 新しいタスクかどうかは、taskId をみて判別
    if (editedTask.id === 0) {
      createTaskMutation.mutate({
        title: editedTask.title,
        description: editedTask.description
      })
    } else {
      updateTaskMutation.mutate({
        id: editedTask.id,
        title: editedTask.title,
        description: editedTask.description
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextInput
          mt='md'
          placeholder='タイトル'
          value={editedTask.title || ''}
          onChange={(e) => update({ 
            ...editedTask, 
            title: e.currentTarget.value 
          })}
        />
        <TextInput
          mt='md'
          placeholder='内容'
          value={editedTask.description || ''}
          onChange={(e) => update({
            ...editedTask,
            description: e.currentTarget.value
          })}
        />
        <Center mt="lg">
          <Button
            disabled={editedTask.title === ''}
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
            type="submit"
          >
            {editedTask.id === 0 ? 'タスクを作成' : 'タスクの更新'}
          </Button>
        </Center>
      </form>
    </>
  )
}