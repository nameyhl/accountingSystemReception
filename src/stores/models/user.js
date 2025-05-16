import { defineStore } from 'pinia'
import { ref } from 'vue'

const userStore = defineStore(
  'user',
  () => {
    let user = ref(null)

    const setUser = (data) => {
      user.value = data
    }

    const removeUser = () => {
      user.value = null
    }
    let token = ref(null)

    const setToken = (data) => {
      token.value = data
      localStorage.setItem('token', data)
    }

    const getUser = () => {
      return user.value
    }

    const removeToken = () => {
      token.value = null
      localStorage.removeItem('token')
    }

    const login = (data) => {
      setUser(data)
      setToken(data.token)
    }

    const logout = () => {
      removeUser()
      removeToken()
    }

    return { user, setUser, removeUser, token, setToken, removeToken, login, logout, getUser }
  },
  {
    persist: true,
  },
)

export default userStore
