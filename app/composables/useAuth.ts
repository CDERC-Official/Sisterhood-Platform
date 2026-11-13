import {
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile
} from '~/data/mock-store'
import type {
  LoginInput,
  LoginResult,
  ProfilePatch,
  ProfileResult,
  RegisterInput,
  RegisterResult
} from '~/data/mock-store'

export type {
  LoginInput,
  LoginResult,
  ProfilePatch,
  ProfileResult,
  RegisterInput,
  RegisterResult
} from '~/data/mock-store'

export function useAuth() {
  const { state, commit, resetDemoData } = useMockStore()

  const user = computed(() => {
    const id = state.value.currentUserId
    if (!id) return null
    return state.value.users.find(item => item.id === id) ?? null
  })

  function register(input: RegisterInput): RegisterResult {
    return commit(current => registerUser(current, input))
  }

  function login(input: LoginInput): LoginResult {
    return commit(current => loginUser(current, input))
  }

  function logout() {
    commit(current => ({ state: logoutUser(current), result: undefined }))
  }

  function updateProfile(patch: ProfilePatch): ProfileResult {
    return commit(current => updateUserProfile(current, patch))
  }

  return {
    user,
    register,
    login,
    logout,
    updateProfile,
    resetDemoData
  }
}
