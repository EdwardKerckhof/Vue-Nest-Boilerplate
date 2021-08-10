import { UserDto } from '@vnbp/common/dist/models'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null as unknown as UserDto,
    users: [] as UserDto[],
    authenticated: false
  }),
  getters: {
    getCurrentUser(state) {
      return state.user
    },
    getLoggedInStatus(state) {
      return state.authenticated
    }
  },
  actions: {
    setCurrentUser(user: UserDto) {
      this.user = user
    },
    setLoggedInStatus(loggedIn: boolean) {
      this.authenticated = loggedIn
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
