import { updateMakerProfile as updateMakerProfileState } from '~/data/mock-store'
import type { MakerProfilePatch } from '~/data/mock-store'

export type { MakerProfilePatch } from '~/data/mock-store'

export function useMakers() {
  const { state, commit } = useMockStore()

  const profiles = computed(() => state.value.makerProfiles)

  const makers = computed(() => {
    return state.value.makerProfiles.flatMap((profile) => {
      const user = state.value.users.find(item => item.id === profile.userId)
      return user ? [{ user, profile }] : []
    })
  })

  function updateMakerProfile(userId: string, patch: MakerProfilePatch) {
    return commit(current => updateMakerProfileState(current, userId, patch))
  }

  return {
    profiles,
    makers,
    updateMakerProfile
  }
}
