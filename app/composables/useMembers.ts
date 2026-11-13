import { publicMembers } from '~/utils/members'

export function useMembers() {
  const { state } = useMockStore()
  const { profiles } = useMakers()
  const members = computed(() => publicMembers(state.value.users, profiles.value))
  return { members }
}
