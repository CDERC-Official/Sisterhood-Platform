import {
  createProduct as createProductState,
  deleteProduct as deleteProductState,
  updateProduct as updateProductState
} from '~/data/mock-store'
import type { ProductDraft, ProductPatch } from '~/data/mock-store'

export type { ProductDraft, ProductPatch } from '~/data/mock-store'

export function useProducts() {
  const { state, commit } = useMockStore()
  const products = computed(() => state.value.products)

  function createProduct(draft: ProductDraft) {
    return commit(current => createProductState(current, draft))
  }

  function updateProduct(id: string, patch: ProductPatch) {
    return commit(current => updateProductState(current, id, patch))
  }

  function deleteProduct(id: string) {
    return commit(current => deleteProductState(current, id))
  }

  return {
    products,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
