import { EditedTask } from '@/types';
import create from 'zustand';

type State = {
  editedTask: EditedTask
  updateEditedTask: (payload: EditedTask) => void
  resetEditedTask: () => void
}

const initTask: EditedTask = {
  id: 0,
  title: '',
  description: ''
}

export const useStore = create<State>((set) => ({
  editedTask: initTask,
  updateEditedTask: (payload) => {
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
        description: payload.description
      },
    })
  },
  resetEditedTask: () => set({
    editedTask: initTask
  })
}))