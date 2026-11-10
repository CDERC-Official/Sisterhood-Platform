import {
  appendInquiryMessage as appendInquiryMessageState,
  createInquiry as createInquiryState
} from '~/data/mock-store'
import type { InquiryDraft, InquiryMessageDraft } from '~/data/mock-store'

export type { InquiryDraft, InquiryMessageDraft } from '~/data/mock-store'

export function useInquiries() {
  const { state, commit } = useMockStore()
  const inquiries = computed(() => state.value.inquiries)

  function createInquiry(draft: InquiryDraft) {
    return commit(current => createInquiryState(current, draft))
  }

  function appendInquiryMessage(inquiryId: string, draft: InquiryMessageDraft) {
    return commit(current => appendInquiryMessageState(current, inquiryId, draft))
  }

  return {
    inquiries,
    createInquiry,
    appendInquiryMessage
  }
}
