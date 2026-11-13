/**
 * Pure transitions for the demo store.
 * Composables own the in-memory copy and localStorage; this module never touches either.
 */
import { seed } from './seed'
import {
  communityTags,
  currencies,
  productCategories
} from '#shared/types'
import type {
  CommunityPost,
  CommunityReply,
  CommunityTag,
  Inquiry,
  InquiryMessage,
  LocaleString,
  MakerProfile,
  Price,
  Product,
  ProductCategory,
  User
} from '#shared/types'

export const mockStoreStorageKey = 'sisterhood.mock-store'
export const mockStoreVersion = 1

export type MockState = {
  users: User[]
  makerProfiles: MakerProfile[]
  products: Product[]
  inquiries: Inquiry[]
  communityPosts: CommunityPost[]
  currentUserId: string | null
}

export type RegisterInput = {
  email: string
  password: string
  displayName: string
  isMaker: boolean
}

export type LoginInput = {
  email: string
  password: string
}

export type ProfilePatch = {
  displayName: string
  /** Makers stay makers. Passing true creates an empty maker profile when one is missing. */
  isMaker?: boolean
}

export type MakerProfilePatch = {
  place?: string
  bio?: LocaleString
  portraitImageUrl?: string
}

export type ProductDraft = Omit<Product, 'id' | 'createdAt'>
export type ProductPatch = Partial<Omit<Product, 'id' | 'makerId' | 'createdAt'>>

export type InquiryDraft = {
  productId: string
  makerUserId: string
  inquirerUserId: string
  body: string
}

export type InquiryMessageDraft = {
  authorUserId: string
  body: string
}

export type CommunityPostDraft = {
  authorUserId: string
  tag: CommunityTag
  title: string
  body: string
}

export type CommunityReplyDraft = {
  authorUserId: string
  body: string
}

export type RegisterResult
  = { ok: true, user: User }
    | { ok: false, error: 'duplicate-email' | 'invalid-account' }

export type LoginResult
  = { ok: true, user: User }
    | { ok: false, error: 'invalid-credentials' }

export type ProfileResult
  = { ok: true, user: User }
    | { ok: false, error: 'not-signed-in' | 'invalid-profile' }

type Transition<T> = {
  state: MockState
  result: T
}

export function createSeedState(): MockState {
  return {
    users: structuredClone(seed.users),
    makerProfiles: structuredClone(seed.makerProfiles),
    products: structuredClone(seed.products),
    inquiries: structuredClone(seed.inquiries),
    communityPosts: structuredClone(seed.communityPosts),
    currentUserId: null
  }
}

export function createId(prefix: string) {
  const random = globalThis.crypto?.randomUUID?.()
    ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return `${prefix}_${random}`
}

export function timestamp() {
  return new Date().toISOString()
}

export function emptyMakerProfile(userId: string): MakerProfile {
  return {
    userId,
    place: '',
    bio: { en: '', de: '' },
    portraitImageUrl: ''
  }
}

export function readStoredState(): MockState | null {
  if (!import.meta.client) return null

  try {
    const raw = localStorage.getItem(mockStoreStorageKey)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!isStoredSnapshot(parsed)) return null
    return parsed.state
  } catch {
    return null
  }
}

export function writeStoredState(state: MockState) {
  if (!import.meta.client) return

  try {
    const snapshot = {
      version: mockStoreVersion,
      state
    }
    localStorage.setItem(mockStoreStorageKey, JSON.stringify(snapshot))
  } catch {
    // A full quota or blocked storage leaves the in-memory session intact.
  }
}

export function clearStoredState() {
  if (!import.meta.client) return

  try {
    localStorage.removeItem(mockStoreStorageKey)
  } catch {
    // Memory is already reset when this fails.
  }
}

export function registerUser(state: MockState, input: RegisterInput): Transition<RegisterResult> {
  const email = input.email.trim().toLowerCase()
  const displayName = input.displayName.trim()
  if (!email || !input.password || !displayName) {
    return { state, result: { ok: false, error: 'invalid-account' } }
  }
  if (state.users.some(user => user.email.toLowerCase() === email)) {
    return { state, result: { ok: false, error: 'duplicate-email' } }
  }

  const user: User = {
    id: createId('usr'),
    email,
    displayName,
    password: input.password,
    attested: true,
    isMaker: input.isMaker
  }
  const makerProfiles = input.isMaker
    ? [...state.makerProfiles, emptyMakerProfile(user.id)]
    : state.makerProfiles

  return {
    state: {
      ...state,
      users: [...state.users, user],
      makerProfiles,
      currentUserId: user.id
    },
    result: { ok: true, user }
  }
}

export function loginUser(state: MockState, input: LoginInput): Transition<LoginResult> {
  const email = input.email.trim().toLowerCase()
  const user = state.users.find(item => item.email.toLowerCase() === email)
  if (!user || user.password !== input.password) {
    return { state, result: { ok: false, error: 'invalid-credentials' } }
  }
  if (state.currentUserId === user.id) {
    return { state, result: { ok: true, user } }
  }
  return {
    state: { ...state, currentUserId: user.id },
    result: { ok: true, user }
  }
}

export function logoutUser(state: MockState): MockState {
  if (state.currentUserId === null) return state
  return { ...state, currentUserId: null }
}

export function updateUserProfile(state: MockState, patch: ProfilePatch): Transition<ProfileResult> {
  const user = currentUser(state)
  if (!user) return { state, result: { ok: false, error: 'not-signed-in' } }

  const displayName = patch.displayName.trim()
  if (!displayName) return { state, result: { ok: false, error: 'invalid-profile' } }

  const isMaker = user.isMaker || patch.isMaker === true
  const nextUser: User = { ...user, displayName, isMaker }
  const hasProfile = state.makerProfiles.some(profile => profile.userId === user.id)
  const makerProfiles = isMaker && !hasProfile
    ? [...state.makerProfiles, emptyMakerProfile(user.id)]
    : state.makerProfiles

  return {
    state: {
      ...state,
      users: state.users.map(item => item.id === user.id ? nextUser : item),
      makerProfiles
    },
    result: { ok: true, user: nextUser }
  }
}

export function updateMakerProfile(
  state: MockState,
  userId: string,
  patch: MakerProfilePatch
): Transition<MakerProfile | null> {
  const user = state.users.find(item => item.id === userId)
  if (!user?.isMaker) return { state, result: null }

  const existing = state.makerProfiles.find(profile => profile.userId === userId)
  const nextProfile: MakerProfile = {
    ...(existing ?? emptyMakerProfile(userId)),
    ...patch,
    ...(patch.bio ? { bio: { ...patch.bio } } : {}),
    userId
  }
  const makerProfiles = existing
    ? state.makerProfiles.map(profile => profile.userId === userId ? nextProfile : profile)
    : [...state.makerProfiles, nextProfile]

  return { state: { ...state, makerProfiles }, result: nextProfile }
}

export function createProduct(state: MockState, draft: ProductDraft): Transition<Product> {
  const product: Product = {
    makerId: draft.makerId,
    title: { ...draft.title },
    description: { ...draft.description },
    category: draft.category,
    imageUrls: [...draft.imageUrls],
    ...(draft.price ? { price: { ...draft.price } } : {}),
    id: createId('prd'),
    createdAt: timestamp()
  }
  return {
    state: { ...state, products: [...state.products, product] },
    result: product
  }
}

export function updateProduct(
  state: MockState,
  id: string,
  patch: ProductPatch
): Transition<Product | null> {
  const existing = state.products.find(product => product.id === id)
  if (!existing) return { state, result: null }

  const next: Product = {
    ...existing,
    ...patch,
    title: patch.title ? { ...patch.title } : existing.title,
    description: patch.description ? { ...patch.description } : existing.description,
    imageUrls: patch.imageUrls ? [...patch.imageUrls] : existing.imageUrls,
    id: existing.id,
    makerId: existing.makerId,
    createdAt: existing.createdAt
  }
  if ('price' in patch) {
    if (patch.price) next.price = { ...patch.price }
    else delete next.price
  }

  return {
    state: {
      ...state,
      products: state.products.map(product => product.id === id ? next : product)
    },
    result: next
  }
}

export function deleteProduct(state: MockState, id: string): Transition<boolean> {
  if (!state.products.some(product => product.id === id)) {
    return { state, result: false }
  }
  return {
    state: { ...state, products: state.products.filter(product => product.id !== id) },
    result: true
  }
}

export function createInquiry(state: MockState, draft: InquiryDraft): Transition<Inquiry | null> {
  const body = draft.body.trim()
  if (!draft.productId || !draft.makerUserId || !draft.inquirerUserId || !body) {
    return { state, result: null }
  }

  const createdAt = timestamp()
  const inquiry: Inquiry = {
    id: createId('inq'),
    productId: draft.productId,
    makerUserId: draft.makerUserId,
    inquirerUserId: draft.inquirerUserId,
    createdAt,
    messages: [{
      id: createId('msg'),
      authorUserId: draft.inquirerUserId,
      body,
      createdAt
    }]
  }
  return {
    state: { ...state, inquiries: [...state.inquiries, inquiry] },
    result: inquiry
  }
}

export function appendInquiryMessage(
  state: MockState,
  inquiryId: string,
  draft: InquiryMessageDraft
): Transition<InquiryMessage | null> {
  const body = draft.body.trim()
  const inquiry = state.inquiries.find(item => item.id === inquiryId)
  if (!inquiry || !draft.authorUserId || !body) return { state, result: null }

  const message: InquiryMessage = {
    id: createId('msg'),
    authorUserId: draft.authorUserId,
    body,
    createdAt: timestamp()
  }
  return {
    state: {
      ...state,
      inquiries: state.inquiries.map(item => item.id === inquiryId
        ? { ...item, messages: [...item.messages, message] }
        : item)
    },
    result: message
  }
}

export function createCommunityPost(
  state: MockState,
  draft: CommunityPostDraft
): Transition<CommunityPost | null> {
  const title = draft.title.trim()
  const body = draft.body.trim()
  if (!draft.authorUserId || !isCommunityTag(draft.tag) || !title || !body) {
    return { state, result: null }
  }

  const post: CommunityPost = {
    id: createId('post'),
    authorUserId: draft.authorUserId,
    tag: draft.tag,
    title,
    body,
    createdAt: timestamp(),
    replies: []
  }
  return {
    state: { ...state, communityPosts: [post, ...state.communityPosts] },
    result: post
  }
}

export function appendCommunityReply(
  state: MockState,
  postId: string,
  draft: CommunityReplyDraft
): Transition<CommunityReply | null> {
  const body = draft.body.trim()
  const post = state.communityPosts.find(item => item.id === postId)
  if (!post || !draft.authorUserId || !body) return { state, result: null }

  const reply: CommunityReply = {
    id: createId('reply'),
    authorUserId: draft.authorUserId,
    body,
    createdAt: timestamp()
  }
  return {
    state: {
      ...state,
      communityPosts: state.communityPosts.map(item => item.id === postId
        ? { ...item, replies: [...item.replies, reply] }
        : item)
    },
    result: reply
  }
}

export function deleteOwnPost(state: MockState, postId: string, userId: string): Transition<boolean> {
  const post = state.communityPosts.find(item => item.id === postId)
  if (!post || post.authorUserId !== userId) return { state, result: false }
  return {
    state: {
      ...state,
      communityPosts: state.communityPosts.filter(item => item.id !== postId)
    },
    result: true
  }
}

export function deleteOwnReply(
  state: MockState,
  postId: string,
  replyId: string,
  userId: string
): Transition<boolean> {
  const post = state.communityPosts.find(item => item.id === postId)
  const reply = post?.replies.find(item => item.id === replyId)
  if (!post || !reply || reply.authorUserId !== userId) return { state, result: false }

  return {
    state: {
      ...state,
      communityPosts: state.communityPosts.map(item => item.id === postId
        ? { ...item, replies: item.replies.filter(entry => entry.id !== replyId) }
        : item)
    },
    result: true
  }
}

function currentUser(state: MockState) {
  if (!state.currentUserId) return null
  return state.users.find(user => user.id === state.currentUserId) ?? null
}

function isStoredSnapshot(value: unknown): value is { version: 1, state: MockState } {
  if (!isRecord(value)) return false
  return value.version === mockStoreVersion && isMockState(value.state)
}

function isMockState(value: unknown): value is MockState {
  if (!isRecord(value)) return false
  return isArrayOf(value.users, isUser)
    && isArrayOf(value.makerProfiles, isMakerProfile)
    && isArrayOf(value.products, isProduct)
    && isArrayOf(value.inquiries, isInquiry)
    && isArrayOf(value.communityPosts, isCommunityPost)
    && (value.currentUserId === null || typeof value.currentUserId === 'string')
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.email === 'string'
    && typeof value.displayName === 'string'
    && typeof value.password === 'string'
    && value.attested === true
    && typeof value.isMaker === 'boolean'
}

function isMakerProfile(value: unknown): value is MakerProfile {
  if (!isRecord(value)) return false
  return typeof value.userId === 'string'
    && typeof value.place === 'string'
    && isLocaleString(value.bio)
    && typeof value.portraitImageUrl === 'string'
}

function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.makerId === 'string'
    && isLocaleString(value.title)
    && isLocaleString(value.description)
    && isProductCategory(value.category)
    && (value.price === undefined || isPrice(value.price))
    && isArrayOf(value.imageUrls, isString)
    && typeof value.createdAt === 'string'
}

function isInquiry(value: unknown): value is Inquiry {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.productId === 'string'
    && typeof value.makerUserId === 'string'
    && typeof value.inquirerUserId === 'string'
    && typeof value.createdAt === 'string'
    && isArrayOf(value.messages, isInquiryMessage)
}

function isInquiryMessage(value: unknown): value is InquiryMessage {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.authorUserId === 'string'
    && typeof value.body === 'string'
    && typeof value.createdAt === 'string'
}

function isCommunityPost(value: unknown): value is CommunityPost {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.authorUserId === 'string'
    && isCommunityTag(value.tag)
    && typeof value.title === 'string'
    && typeof value.body === 'string'
    && typeof value.createdAt === 'string'
    && isArrayOf(value.replies, isCommunityReply)
}

function isCommunityReply(value: unknown): value is CommunityReply {
  if (!isRecord(value)) return false
  return typeof value.id === 'string'
    && typeof value.authorUserId === 'string'
    && typeof value.body === 'string'
    && typeof value.createdAt === 'string'
}

function isLocaleString(value: unknown): value is LocaleString {
  if (!isRecord(value)) return false
  return typeof value.en === 'string' && typeof value.de === 'string'
}

function isPrice(value: unknown): value is Price {
  if (!isRecord(value)) return false
  return typeof value.amount === 'number'
    && Number.isFinite(value.amount)
    && isCurrency(value.currency)
}

function isProductCategory(value: unknown): value is ProductCategory {
  return typeof value === 'string' && (productCategories as readonly string[]).includes(value)
}

function isCommunityTag(value: unknown): value is CommunityTag {
  return typeof value === 'string' && (communityTags as readonly string[]).includes(value)
}

function isCurrency(value: unknown): value is Price['currency'] {
  return typeof value === 'string' && (currencies as readonly string[]).includes(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function isArrayOf<T>(value: unknown, guard: (item: unknown) => item is T): value is T[] {
  return Array.isArray(value) && value.every(guard)
}
