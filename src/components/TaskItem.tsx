import useMutationTask from "@/hooks/useMutateTask";
import { useStore } from "@/store";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { List } from "@mantine/core";
import { Task } from "@prisma/client";

type ITaskItem = Omit<Task, 'createdAt' | 'updatedAt' | 'userId'> 

export default function TaskItem({
  id,
  title,
  description
}: ITaskItem) {
  const update = useStore((state) => state.updateEditedTask)
  const { deleteTaskMutation } = useMutationTask()

  return (
    <List.Item>
      <div className="float-left mr-10">
        <PencilAltIcon
          className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
          onClick={() => {
            update({
              id,
              title,
              description,
            })
          }}
        />
        <TrashIcon
          className="h-5 w-5 cursor-pointer text-blue-500"
          onClick={() => {
            deleteTaskMutation.mutate(id)
          }}
        />
      </div>
      <span>{title}</span>
    </List.Item>
  )
}