/**
 * Shared demo store. Pages read this through useAuth, useMakers, useProducts,
 * useInquiries, and useCommunity so they all see one copy of the seed.
 *
 * Server render starts from the seed and never touches localStorage.
 * After mount, the client replaces that copy when a snapshot exists.
 * The first successful write saves the snapshot; refresh then reads it back.
 */
import {
  clearStoredState,
  createSeedState,
  readStoredState,
  writeStoredState
} from '~/data/mock-store'
import type { MockState } from '~/data/mock-store'

const stateKey = 'sisterhood-mock-store'
const hydratedKey = 'sisterhood-mock-store-hydrated'

export function useMockStore() {
  const state = useState<MockState>(stateKey, createSeedState)
  const hydrated = useState(hydratedKey, () => false)

  function ensureHydrated() {
    if (!import.meta.client || hydrated.value) return
    const stored = readStoredState()
    if (stored) state.value = stored
    hydrated.value = true
  }

  if (import.meta.client && !hydrated.value) {
    if (useNuxtApp().isHydrating) onMounted(ensureHydrated)
    else ensureHydrated()
  }

  function commit<T>(recipe: (current: MockState) => { state: MockState, result: T }) {
    ensureHydrated()
    const outcome = recipe(state.value)
    if (outcome.state !== state.value) {
      state.value = outcome.state
      writeStoredState(outcome.state)
    }
    return outcome.result
  }

  function resetDemoData() {
    hydrated.value = true
    state.value = createSeedState()
    clearStoredState()
  }

  return {
    state: computed(() => state.value),
    hydrated: computed(() => hydrated.value),
    ensureHydrated,
    commit,
    resetDemoData
  }
}
