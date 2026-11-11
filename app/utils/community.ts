/**
 * Pure helpers for the community feed.
 * Pages own locale copy; this module only shapes store data and the tag query.
 */
import { communityTags } from '#shared/types'
import type { CommunityPost, CommunityTag } from '#shared/types'

export type CommunityTagFilter = CommunityTag | 'all'

export function communityTagSlug(tag: CommunityTag): string {
  return tag.toLowerCase()
}

/** Map a `?tag=` query value to a filter. Unknown values fall back to All. */
export function parseCommunityTagQuery(value: unknown): CommunityTagFilter {
  if (typeof value !== 'string' || !value.trim()) return 'all'
  const slug = value.trim().toLowerCase()
  const match = communityTags.find(tag => communityTagSlug(tag) === slug)
  return match ?? 'all'
}

export function sortCommunityPostsNewestFirst(posts: CommunityPost[]): CommunityPost[] {
  return posts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function filterCommunityPostsByTag(
  posts: CommunityPost[],
  tag: CommunityTagFilter
): CommunityPost[] {
  const sorted = sortCommunityPostsNewestFirst(posts)
  if (tag === 'all') return sorted
  return sorted.filter(post => post.tag === tag)
}

export function formatCommunityTime(iso: string, locale: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale === 'de' ? 'de-AT' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

export function seededTagsPresent(posts: CommunityPost[]): boolean {
  return communityTags.every(tag => posts.some(post => post.tag === tag))
}

export type CommunityPostFormInput = {
  tag: CommunityTag | ''
  title: string
  body: string
}

export type CommunityPostFormErrors = {
  tag?: 'required'
  title?: 'required'
  body?: 'required'
}

/** Validate a compose draft. Empty fields return field-level required errors. */
export function validateCommunityPostForm(
  input: CommunityPostFormInput
): CommunityPostFormErrors {
  const errors: CommunityPostFormErrors = {}
  if (!input.tag || !(communityTags as readonly string[]).includes(input.tag)) {
    errors.tag = 'required'
  }
  if (!input.title.trim()) errors.title = 'required'
  if (!input.body.trim()) errors.body = 'required'
  return errors
}

export function hasCommunityPostFormErrors(errors: CommunityPostFormErrors): boolean {
  return !!(errors.tag || errors.title || errors.body)
}

/** Path (+ query) to send guests back to after auth, including the active tag. */
export function communityReturnPath(tag: CommunityTagFilter): string {
  if (tag === 'all') return '/community'
  return `/community?tag=${communityTagSlug(tag)}`
}
