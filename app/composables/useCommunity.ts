import {
  appendCommunityReply,
  createCommunityPost,
  deleteOwnPost as deleteOwnPostState,
  deleteOwnReply as deleteOwnReplyState
} from '~/data/mock-store'
import type { CommunityPostDraft, CommunityReplyDraft } from '~/data/mock-store'

export type { CommunityPostDraft, CommunityReplyDraft } from '~/data/mock-store'

export function useCommunity() {
  const { state, commit } = useMockStore()
  const posts = computed(() => state.value.communityPosts)

  function createPost(draft: CommunityPostDraft) {
    return commit(current => createCommunityPost(current, draft))
  }

  function appendReply(postId: string, draft: CommunityReplyDraft) {
    return commit(current => appendCommunityReply(current, postId, draft))
  }

  function deleteOwnPost(postId: string, userId: string) {
    return commit(current => deleteOwnPostState(current, postId, userId))
  }

  function deleteOwnReply(postId: string, replyId: string, userId: string) {
    return commit(current => deleteOwnReplyState(current, postId, replyId, userId))
  }

  return {
    posts,
    createPost,
    appendReply,
    deleteOwnPost,
    deleteOwnReply
  }
}
