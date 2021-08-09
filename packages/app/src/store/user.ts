import { UserDto } from '@vnbp/common/dist/models'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null as unknown as UserDto,
    users: [] as UserDto[]
  }),
  getters: {
    currentUser(state) {
      return state.user
    }
  },
  actions: {
    setCurrentUser(user: UserDto) {
      this.user = user
    },
    addUser(user: UserDto) {
      this.users.push(user)
    },
    removeUser(user: UserDto) {
      const index = this.users.findIndex((u) => u.id === user.id)
      if (index > -1) this.users.splice(index, 1)
    }
  }
})
