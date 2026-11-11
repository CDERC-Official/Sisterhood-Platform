import { describe, expect, it } from 'vitest'
import { communityTags } from '#shared/types'
import type { CommunityPost } from '#shared/types'
import { createCommunityPost, createSeedState } from '../data/mock-store'
import { demoMakerEmail } from '../data/seed'
import { displayNameFor } from './inquiries'
import {
  communityReturnPath,
  communityTagSlug,
  filterCommunityPostsByTag,
  formatCommunityTime,
  hasCommunityPostFormErrors,
  parseCommunityTagQuery,
  seededTagsPresent,
  sortCommunityPostsNewestFirst,
  validateCommunityPostForm
} from './community'

function post(partial: Partial<CommunityPost> & Pick<CommunityPost, 'id' | 'createdAt' | 'tag'>): CommunityPost {
  return {
    authorUserId: 'usr_x',
    title: 'Title',
    body: 'Body',
    replies: [],
    ...partial
  }
}

describe('community helpers', () => {
  it('maps tags to lowercase query slugs', () => {
    expect(communityTagSlug('Skills')).toBe('skills')
    expect(communityTagSlug('Stories')).toBe('stories')
    expect(communityTags.map(communityTagSlug)).toEqual([
      'skills',
      'opportunities',
      'stories',
      'questions'
    ])
  })

  it('parses the tag query and falls back to All for bad values', () => {
    expect(parseCommunityTagQuery(undefined)).toBe('all')
    expect(parseCommunityTagQuery('')).toBe('all')
    expect(parseCommunityTagQuery('stories')).toBe('Stories')
    expect(parseCommunityTagQuery('Stories')).toBe('Stories')
    expect(parseCommunityTagQuery('QUESTIONS')).toBe('Questions')
    expect(parseCommunityTagQuery('materials')).toBe('all')
    expect(parseCommunityTagQuery(['stories'])).toBe('all')
  })

  it('sorts posts newest first and filters by tag', () => {
    const older = post({
      id: 'post_old',
      tag: 'Skills',
      createdAt: '2026-01-01T00:00:00.000Z'
    })
    const newer = post({
      id: 'post_new',
      tag: 'Stories',
      createdAt: '2026-02-01T00:00:00.000Z'
    })
    const mid = post({
      id: 'post_mid',
      tag: 'Stories',
      createdAt: '2026-01-15T00:00:00.000Z'
    })

    expect(sortCommunityPostsNewestFirst([older, newer, mid]).map(item => item.id))
      .toEqual(['post_new', 'post_mid', 'post_old'])
    expect(filterCommunityPostsByTag([older, newer, mid], 'all').map(item => item.id))
      .toEqual(['post_new', 'post_mid', 'post_old'])
    expect(filterCommunityPostsByTag([older, newer, mid], 'Stories').map(item => item.id))
      .toEqual(['post_new', 'post_mid'])
    expect(filterCommunityPostsByTag([older, newer, mid], 'Questions')).toEqual([])
  })

  it('lists every seeded tag newest first and resolves authors', () => {
    const state = createSeedState()

    expect(seededTagsPresent(state.communityPosts)).toBe(true)
    for (const tag of communityTags) {
      const filtered = filterCommunityPostsByTag(state.communityPosts, tag)
      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(item => item.tag === tag)).toBe(true)
    }

    const feed = filterCommunityPostsByTag(state.communityPosts, 'all')
    expect(feed.map(item => item.id)).toEqual([
      'post_spoon_oil',
      'post_aunt_cowries',
      'post_plagwitz_market',
      'post_indigo_vat'
    ])

    const indigo = feed.find(item => item.id === 'post_indigo_vat')
    expect(indigo?.replies.length).toBe(1)
    expect(displayNameFor(state.users, indigo?.authorUserId ?? '')).toBe('Amara Okello')
    expect(displayNameFor(state.users, indigo?.replies[0]?.authorUserId ?? '')).toBe('Wanjiru Mwangi')
    expect(displayNameFor(state.users, 'missing')).toBe('')
  })

  it('formats community times', () => {
    expect(formatCommunityTime('2026-11-06T09:10:00.000Z', 'en')).toMatch(/\d/)
    expect(formatCommunityTime('not-a-date', 'en')).toBe('')
  })

  it('validates the compose form and builds return paths', () => {
    expect(validateCommunityPostForm({ tag: '', title: '', body: '' })).toEqual({
      tag: 'required',
      title: 'required',
      body: 'required'
    })
    expect(hasCommunityPostFormErrors(
      validateCommunityPostForm({ tag: '', title: '', body: '' })
    )).toBe(true)
    expect(validateCommunityPostForm({
      tag: 'Stories',
      title: '  Hello  ',
      body: '  World  '
    })).toEqual({})
    expect(hasCommunityPostFormErrors(
      validateCommunityPostForm({ tag: 'Stories', title: 'Hello', body: 'World' })
    )).toBe(false)
    expect(communityReturnPath('all')).toBe('/community')
    expect(communityReturnPath('Stories')).toBe('/community?tag=stories')
  })

  it('prepends a published post and keeps it under its tag filter', () => {
    const state = createSeedState()
    const author = state.users.find(user => user.email === demoMakerEmail)
    if (!author) throw new Error('Seed is missing the demo maker')

    const created = createCommunityPost(state, {
      authorUserId: author.id,
      tag: 'Stories',
      title: 'A fresh story',
      body: 'Written for the feed.'
    })
    const post = created.result
    if (!post) throw new Error('Post was not created')

    expect(created.state.communityPosts[0]?.id).toBe(post.id)
    expect(filterCommunityPostsByTag(created.state.communityPosts, 'all')[0]?.id).toBe(post.id)
    expect(
      filterCommunityPostsByTag(created.state.communityPosts, 'Stories').some(item => item.id === post.id)
    ).toBe(true)
    expect(
      filterCommunityPostsByTag(created.state.communityPosts, 'Skills').some(item => item.id === post.id)
    ).toBe(false)
  })
})
