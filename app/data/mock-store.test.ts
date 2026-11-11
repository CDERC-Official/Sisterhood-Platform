import { describe, expect, it, vi } from 'vitest'
import { communityTags } from '#shared/types'
import type { LocaleString, User } from '#shared/types'
import {
  demoMakerEmail,
  demoPassword,
  demoSupporterEmail,
  seed
} from './seed'
import {
  appendCommunityReply,
  appendInquiryMessage,
  clearStoredState,
  createCommunityPost,
  createInquiry,
  createProduct,
  createSeedState,
  deleteOwnPost,
  deleteOwnReply,
  deleteProduct,
  loginUser,
  logoutUser,
  mockStoreStorageKey,
  mockStoreVersion,
  readStoredState,
  registerUser,
  updateMakerProfile,
  updateProduct,
  updateUserProfile,
  writeStoredState
} from './mock-store'
import type { ProductDraft, ProductPatch } from './mock-store'

function memoryStorage(): Storage {
  const items = new Map<string, string>()
  return {
    get length() {
      return items.size
    },
    clear() {
      items.clear()
    },
    getItem(key) {
      return items.get(key) ?? null
    },
    key(index) {
      return [...items.keys()][index] ?? null
    },
    removeItem(key) {
      items.delete(key)
    },
    setItem(key, value) {
      items.set(key, String(value))
    }
  }
}

function userFrom(result: { ok: true, user: User } | { ok: false, error: string }) {
  if (!result.ok) throw new Error(result.error)
  return result.user
}

function expectRecentTimestamp(value: string) {
  expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  expect(Math.abs(Date.now() - Date.parse(value))).toBeLessThan(5_000)
}

function expectCopy(value: LocaleString) {
  expect(value.en.length).toBeGreaterThan(0)
  expect(value.de.length).toBeGreaterThan(0)
}

function productDraft(makerId: string): ProductDraft {
  return {
    makerId,
    title: { en: 'Bowl', de: 'Schale' },
    description: { en: 'A bowl', de: 'Eine Schale' },
    category: 'Ceramics',
    imageUrls: ['https://example.com/bowl.jpg'],
    price: { amount: 12, currency: 'EUR' }
  }
}

describe('seed', () => {
  it('starts signed out with a private copy of the seed', () => {
    const state = createSeedState()

    expect(state.currentUserId).toBeNull()
    expect(state.users).toEqual(seed.users)
    expect(state.makerProfiles).toEqual(seed.makerProfiles)
    expect(state.products).toEqual(seed.products)
    expect(state.inquiries).toEqual(seed.inquiries)
    expect(state.communityPosts).toEqual(seed.communityPosts)
    expect(state.users).not.toBe(seed.users)

    state.users.pop()
    expect(createSeedState().users).toHaveLength(seed.users.length)
  })

  it('includes the documented demo accounts', () => {
    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const supporter = state.users.find(user => user.email === demoSupporterEmail)

    expect(maker?.isMaker).toBe(true)
    expect(supporter?.isMaker).toBe(false)
    expect(state.users.every(user => user.password === demoPassword && user.attested)).toBe(true)
    expect(state.makerProfiles.some(profile => profile.userId === maker?.id)).toBe(true)
    expect(state.makerProfiles.some(profile => profile.userId === supporter?.id)).toBe(false)
  })

  it('gives every maker several products and bilingual copy', () => {
    const state = createSeedState()
    const counts = new Map<string, number>()
    for (const product of state.products) {
      counts.set(product.makerId, (counts.get(product.makerId) ?? 0) + 1)
      expectCopy(product.title)
      expectCopy(product.description)
    }

    expect(new Set(state.products.map(product => product.category)).size).toBeGreaterThan(1)
    expect(state.products.some(product => product.price !== undefined)).toBe(true)
    expect(state.products.some(product => product.price === undefined)).toBe(true)
    for (const profile of state.makerProfiles) {
      const count = counts.get(profile.userId) ?? 0
      expect(count).toBeGreaterThanOrEqual(3)
      expect(count).toBeLessThanOrEqual(5)
      expect(profile.place.length).toBeGreaterThan(0)
      expect(profile.portraitImageUrl).toMatch(/^https:\/\//)
      expectCopy(profile.bio)
    }
  })

  it('seeds one inquiry thread and one post for every community tag', () => {
    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    const thread = state.inquiries.find(inquiry => inquiry.inquirerUserId === supporter?.id)

    expect(maker).toBeDefined()
    expect(thread?.makerUserId).toBe(maker?.id)
    expect(thread?.messages.length).toBeGreaterThanOrEqual(2)
    expect(state.products.some(product => product.id === thread?.productId && product.makerId === maker?.id)).toBe(true)

    for (const tag of communityTags) {
      expect(state.communityPosts.some(post => post.tag === tag)).toBe(true)
    }
    expect(state.communityPosts.some(post => post.replies.length > 0)).toBe(true)
  })
})

describe('auth', () => {
  it('registers a maker, signs them in, and rejects a duplicate email', () => {
    const created = registerUser(createSeedState(), {
      email: '  New.Maker@sisterhood.test ',
      password: 'secret',
      displayName: '  New Maker  ',
      isMaker: true
    })
    const user = userFrom(created.result)
    const profile = created.state.makerProfiles.find(item => item.userId === user.id)

    expect(user.id).toMatch(/^usr_/)
    expect(user.email).toBe('new.maker@sisterhood.test')
    expect(user.displayName).toBe('New Maker')
    expect(user.attested).toBe(true)
    expect(user.isMaker).toBe(true)
    expect(created.state.currentUserId).toBe(user.id)
    expect(profile).toEqual({
      userId: user.id,
      place: '',
      bio: { en: '', de: '' },
      portraitImageUrl: ''
    })

    const duplicate = registerUser(created.state, {
      email: 'NEW.MAKER@sisterhood.test',
      password: 'other',
      displayName: 'Other',
      isMaker: false
    })
    expect(duplicate.result).toEqual({ ok: false, error: 'duplicate-email' })
    expect(duplicate.state).toBe(created.state)
  })

  it('rejects a blank account without changing state', () => {
    const state = createSeedState()
    const blank = registerUser(state, {
      email: ' ',
      password: '',
      displayName: ' ',
      isMaker: false
    })

    expect(blank.result).toEqual({ ok: false, error: 'invalid-account' })
    expect(blank.state).toBe(state)
  })

  it('logs in the seeded accounts and keeps the session when a later login fails', () => {
    const state = createSeedState()
    const unknown = loginUser(state, { email: 'nobody@sisterhood.test', password: demoPassword })
    const wrong = loginUser(state, { email: demoMakerEmail, password: 'wrong' })
    const signedIn = loginUser(state, { email: ' Amara@sisterhood.test ', password: demoPassword })
    const user = userFrom(signedIn.result)
    const again = loginUser(signedIn.state, { email: demoMakerEmail, password: demoPassword })
    const failed = loginUser(signedIn.state, { email: demoSupporterEmail, password: 'wrong' })

    expect(unknown.result).toEqual({ ok: false, error: 'invalid-credentials' })
    expect(unknown.state).toBe(state)
    expect(wrong.state).toBe(state)
    expect(user.email).toBe(demoMakerEmail)
    expect(signedIn.state.currentUserId).toBe(user.id)
    expect(again.state).toBe(signedIn.state)
    expect(again.result).toMatchObject({ ok: true, user })
    expect(failed.state).toBe(signedIn.state)
    expect(failed.state.currentUserId).toBe(user.id)
  })

  it('logs out and ignores a second logout', () => {
    const signedIn = loginUser(createSeedState(), { email: demoSupporterEmail, password: demoPassword })
    const signedOut = logoutUser(signedIn.state)
    const again = logoutUser(signedOut)

    expect(signedOut.currentUserId).toBeNull()
    expect(signedOut).not.toBe(signedIn.state)
    expect(again).toBe(signedOut)
  })

  it('updates the signed-in profile and lets a supporter become a maker', () => {
    const state = createSeedState()
    const signedOut = updateUserProfile(state, { displayName: 'Nope' })
    const signedIn = loginUser(state, { email: demoSupporterEmail, password: demoPassword })
    const blank = updateUserProfile(signedIn.state, { displayName: '  ' })
    const renamed = updateUserProfile(signedIn.state, { displayName: ' Lena B. ', isMaker: true })
    const user = userFrom(renamed.result)
    const kept = updateUserProfile(renamed.state, { displayName: 'Lena B.', isMaker: false })

    expect(signedOut.result).toEqual({ ok: false, error: 'not-signed-in' })
    expect(signedOut.state).toBe(state)
    expect(blank.result).toEqual({ ok: false, error: 'invalid-profile' })
    expect(blank.state).toBe(signedIn.state)
    expect(user.displayName).toBe('Lena B.')
    expect(user.isMaker).toBe(true)
    expect(renamed.state.makerProfiles.some(profile => profile.userId === user.id && profile.place === '')).toBe(true)
    expect(userFrom(kept.result).isMaker).toBe(true)
    expect(kept.state.makerProfiles.filter(profile => profile.userId === user.id)).toHaveLength(1)
  })
})

describe('maker profiles', () => {
  it('updates the signed-in maker and leaves the caller’s bio object alone', () => {
    const signedIn = loginUser(createSeedState(), { email: demoMakerEmail, password: demoPassword })
    const user = userFrom(signedIn.result)
    const bio = { en: 'Hello', de: 'Hallo' }
    const updated = updateMakerProfile(signedIn.state, user.id, {
      place: 'Berlin',
      bio,
      portraitImageUrl: 'https://example.com/ada.jpg'
    })

    expect(updated.result).toMatchObject({
      userId: user.id,
      place: 'Berlin',
      bio: { en: 'Hello', de: 'Hallo' },
      portraitImageUrl: 'https://example.com/ada.jpg'
    })
    bio.en = 'Changed later'
    expect(updated.result?.bio.en).toBe('Hello')
  })

  it('refuses a profile edit for someone who is not a maker', () => {
    const state = createSeedState()
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    const updated = updateMakerProfile(state, supporter?.id ?? '', { place: 'Berlin' })

    expect(updated.result).toBeNull()
    expect(updated.state).toBe(state)
  })
})

describe('products', () => {
  it('creates a product with an id and timestamp, then edits and deletes it', () => {
    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const draft = productDraft(maker?.id ?? '')
    const created = createProduct(state, draft)
    const second = createProduct(created.state, draft)
    const edited = updateProduct(created.state, created.result.id, {
      title: { en: 'Edited bowl', de: 'Bearbeitete Schale' },
      price: undefined,
      makerId: 'someone-else',
      createdAt: '2000-01-01T00:00:00.000Z'
    } as ProductPatch)
    const missing = updateProduct(created.state, 'missing', { category: 'Wood' })
    const removed = deleteProduct(edited.state, created.result.id)
    const missingDelete = deleteProduct(edited.state, 'missing')

    expect(created.result.id).toMatch(/^prd_/)
    expectRecentTimestamp(created.result.createdAt)
    expect(created.result.id).not.toBe(second.result.id)
    expect(created.state.products.at(-1)).toBe(created.result)
    draft.title.en = 'Mutated draft'
    expect(created.result.title.en).toBe('Bowl')

    expect(edited.result?.title.de).toBe('Bearbeitete Schale')
    expect(edited.result?.price).toBeUndefined()
    expect(edited.result?.makerId).toBe(maker?.id)
    expect(edited.result?.createdAt).toBe(created.result.createdAt)
    expect(missing.result).toBeNull()
    expect(missing.state).toBe(created.state)
    expect(removed.result).toBe(true)
    expect(removed.state.products.some(product => product.id === created.result.id)).toBe(false)
    expect(missingDelete).toEqual({ state: edited.state, result: false })
  })

  it('keeps inquiry threads when their product is deleted', () => {
    const state = createSeedState()
    const thread = state.inquiries[0]
    if (!thread) throw new Error('Seed is missing its inquiry')

    const removed = deleteProduct(state, thread.productId)

    expect(removed.result).toBe(true)
    expect(removed.state.inquiries).toEqual(state.inquiries)
  })
})

describe('inquiries', () => {
  it('creates a thread and appends a message', () => {
    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    const created = createInquiry(state, {
      productId: 'prd_marker',
      makerUserId: maker?.id ?? '',
      inquirerUserId: supporter?.id ?? '',
      body: '  Can you add a row?  '
    })
    const inquiry = created.result
    if (!inquiry) throw new Error('Inquiry was not created')
    const followUp = appendInquiryMessage(created.state, inquiry.id, {
      authorUserId: maker?.id ?? '',
      body: ' Yes '
    })
    const stored = followUp.state.inquiries.find(item => item.id === inquiry.id)

    expect(inquiry.id).toMatch(/^inq_/)
    expectRecentTimestamp(inquiry.createdAt)
    expect(inquiry.messages).toHaveLength(1)
    expect(inquiry.messages[0]?.body).toBe('Can you add a row?')
    expect(inquiry.messages[0]?.id).toMatch(/^msg_/)
    expect(inquiry.messages[0]?.createdAt).toBe(inquiry.createdAt)
    expect(followUp.result?.body).toBe('Yes')
    expect(followUp.result?.id).toMatch(/^msg_/)
    expectRecentTimestamp(followUp.result?.createdAt ?? '')
    expect(stored?.messages.map(message => message.body)).toEqual(['Can you add a row?', 'Yes'])
  })

  it('rejects a blank inquiry or a message on a missing thread', () => {
    const state = createSeedState()
    const blank = createInquiry(state, {
      productId: '',
      makerUserId: 'usr_amara',
      inquirerUserId: 'usr_lena',
      body: '   '
    })
    const missing = appendInquiryMessage(state, 'missing', {
      authorUserId: 'usr_lena',
      body: 'Hello'
    })

    expect(blank).toEqual({ state, result: null })
    expect(missing).toEqual({ state, result: null })
  })

  it('allows two inquiries from the same person on the same product', () => {
    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    if (!maker || !supporter) throw new Error('Seed is missing demo accounts')

    const first = createInquiry(state, {
      productId: 'prd_amara_brass_collar',
      makerUserId: maker.id,
      inquirerUserId: supporter.id,
      body: 'First question'
    })
    const second = createInquiry(first.state, {
      productId: 'prd_amara_brass_collar',
      makerUserId: maker.id,
      inquirerUserId: supporter.id,
      body: 'Second question'
    })

    expect(first.result?.id).not.toBe(second.result?.id)
    expect(second.state.inquiries.filter(inquiry =>
      inquiry.productId === 'prd_amara_brass_collar'
      && inquiry.inquirerUserId === supporter.id
    ).length).toBeGreaterThanOrEqual(2)
  })

  it('keeps a new inquiry after writing the store snapshot', () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)

    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    if (!maker || !supporter) throw new Error('Seed is missing demo accounts')

    const created = createInquiry(state, {
      productId: 'prd_amara_brass_collar',
      makerUserId: maker.id,
      inquirerUserId: supporter.id,
      body: 'Saved after refresh'
    })
    const inquiry = created.result
    if (!inquiry) throw new Error('Inquiry was not created')

    writeStoredState(created.state)
    const restored = readStoredState()

    expect(restored?.inquiries.some(item =>
      item.id === inquiry.id
      && item.messages[0]?.body === 'Saved after refresh'
    )).toBe(true)

    clearStoredState()
    vi.unstubAllGlobals()
  })
})

describe('community', () => {
  it('creates a post, appends a reply, and deletes only the author’s own records', () => {
    const state = createSeedState()
    const author = state.users.find(user => user.email === demoMakerEmail)
    const other = state.users.find(user => user.email === demoSupporterEmail)
    const seeded = state.communityPosts.find(post => post.replies.length > 0)
    const seededReply = seeded?.replies[0]
    if (!author || !other || !seeded || !seededReply) throw new Error('Seed is missing a replied post')

    const created = createCommunityPost(state, {
      authorUserId: author.id,
      tag: 'Questions',
      title: '  Which oil?  ',
      body: '  It goes sticky.  '
    })
    const post = created.result
    if (!post) throw new Error('Post was not created')
    const reply = appendCommunityReply(created.state, post.id, {
      authorUserId: other.id,
      body: '  Walnut oil  '
    })
    const deniedReply = deleteOwnReply(reply.state, post.id, reply.result?.id ?? '', author.id)
    const removedReply = deleteOwnReply(reply.state, post.id, reply.result?.id ?? '', other.id)
    const deniedPost = deleteOwnPost(state, seeded.id, other.id)
    const removedPost = deleteOwnPost(removedReply.state, post.id, author.id)

    expect(post.id).toMatch(/^post_/)
    expect(post.title).toBe('Which oil?')
    expect(post.body).toBe('It goes sticky.')
    expect(post.replies).toEqual([])
    expectRecentTimestamp(post.createdAt)
    expect(reply.result?.id).toMatch(/^reply_/)
    expect(reply.result?.body).toBe('Walnut oil')
    expectRecentTimestamp(reply.result?.createdAt ?? '')
    expect(deniedReply).toEqual({ state: reply.state, result: false })
    expect(removedReply.result).toBe(true)
    expect(removedReply.state.communityPosts.find(item => item.id === post.id)?.replies).toEqual([])
    expect(deniedPost).toEqual({ state, result: false })
    expect(removedPost.result).toBe(true)
    expect(removedPost.state.communityPosts.some(item => item.id === post.id)).toBe(false)
    expect(removedPost.state.communityPosts.some(item => item.id === seeded.id)).toBe(true)
  })

  it('rejects an empty post or a reply on a missing post', () => {
    const state = createSeedState()
    const author = state.users.find(user => user.email === demoMakerEmail)
    const blank = createCommunityPost(state, {
      authorUserId: author?.id ?? '',
      tag: 'Stories',
      title: ' ',
      body: 'A story'
    })
    const missing = appendCommunityReply(state, 'missing', {
      authorUserId: author?.id ?? '',
      body: 'Hello'
    })

    expect(blank).toEqual({ state, result: null })
    expect(missing).toEqual({ state, result: null })
  })
})

describe('localStorage', () => {
  it('round-trips the seed and a later edit', () => {
    vi.stubGlobal('localStorage', memoryStorage())
    const state = createSeedState()
    writeStoredState(state)
    expect(readStoredState()).toEqual(state)

    const signedIn = loginUser(state, { email: demoMakerEmail, password: demoPassword })
    const created = createProduct(signedIn.state, productDraft(signedIn.state.currentUserId ?? ''))
    writeStoredState(created.state)

    const stored = readStoredState()
    expect(stored?.currentUserId).toBe(signedIn.state.currentUserId)
    expect(stored?.products.some(product => product.id === created.result.id)).toBe(true)
    expect(stored?.users).toHaveLength(state.users.length)
  })

  it('ignores a missing, corrupt, or outdated snapshot', () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)

    expect(readStoredState()).toBeNull()

    storage.setItem(mockStoreStorageKey, '{')
    expect(readStoredState()).toBeNull()

    storage.setItem(mockStoreStorageKey, JSON.stringify({ version: mockStoreVersion + 1, state: createSeedState() }))
    expect(readStoredState()).toBeNull()

    storage.setItem(mockStoreStorageKey, JSON.stringify({ version: mockStoreVersion, state: { users: [] } }))
    expect(readStoredState()).toBeNull()
  })

  it('clears the snapshot and swallows storage failures', () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)
    writeStoredState(createSeedState())
    clearStoredState()
    expect(storage.getItem(mockStoreStorageKey)).toBeNull()

    storage.setItem = () => {
      throw new Error('quota')
    }
    expect(() => writeStoredState(createSeedState())).not.toThrow()

    storage.getItem = () => {
      throw new Error('blocked')
    }
    expect(readStoredState()).toBeNull()

    storage.removeItem = () => {
      throw new Error('blocked')
    }
    expect(() => clearStoredState()).not.toThrow()
  })
})
