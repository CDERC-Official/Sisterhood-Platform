import { describe, expect, it } from 'vitest'
import type { Inquiry, Product } from '#shared/types'
import { createSeedState } from '../data/mock-store'
import { demoMakerEmail, demoSupporterEmail } from '../data/seed'
import {
  canViewInquiryAsInquirer,
  canViewInquiryAsMaker,
  displayNameFor,
  findInquiryById,
  findProductForInquiry,
  formatInquiryTime,
  inquiriesForMakerInbox,
  inquiriesStartedBy,
  inquiryActivityAt,
  isOwnProductInquiry,
  lastInquiryMessage,
  messagePreview,
  sortInquiriesNewestFirst
} from './inquiries'

function inquiry(partial: Partial<Inquiry> & Pick<Inquiry, 'id' | 'messages'>): Inquiry {
  return {
    productId: 'prd_x',
    makerUserId: 'usr_maker',
    inquirerUserId: 'usr_buyer',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...partial
  }
}

describe('inquiry helpers', () => {
  it('reads the last message and activity time', () => {
    const thread = inquiry({
      id: 'inq_1',
      messages: [
        {
          id: 'msg_1',
          authorUserId: 'usr_buyer',
          body: 'Hello',
          createdAt: '2026-01-01T00:00:00.000Z'
        },
        {
          id: 'msg_2',
          authorUserId: 'usr_maker',
          body: 'Hi',
          createdAt: '2026-01-02T00:00:00.000Z'
        }
      ]
    })

    expect(lastInquiryMessage(thread)?.id).toBe('msg_2')
    expect(inquiryActivityAt(thread)).toBe('2026-01-02T00:00:00.000Z')
  })

  it('sorts threads by newest activity first', () => {
    const older = inquiry({
      id: 'inq_old',
      createdAt: '2026-01-01T00:00:00.000Z',
      messages: [{
        id: 'msg_old',
        authorUserId: 'usr_buyer',
        body: 'Older',
        createdAt: '2026-01-01T00:00:00.000Z'
      }]
    })
    const newer = inquiry({
      id: 'inq_new',
      createdAt: '2026-01-01T00:00:00.000Z',
      messages: [{
        id: 'msg_new',
        authorUserId: 'usr_buyer',
        body: 'Newer',
        createdAt: '2026-01-03T00:00:00.000Z'
      }]
    })

    expect(sortInquiriesNewestFirst([older, newer]).map(item => item.id))
      .toEqual(['inq_new', 'inq_old'])
  })

  it('lists seeded inquiries for the supporter and the maker', () => {
    const state = createSeedState()
    const maker = state.users.find(user => user.email === demoMakerEmail)
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    if (!maker || !supporter) throw new Error('Seed is missing demo accounts')

    const mine = inquiriesStartedBy(state.inquiries, supporter.id)
    const inbox = inquiriesForMakerInbox(state.inquiries, maker.id)

    expect(mine.map(item => item.id)).toContain('inq_lena_brass_collar')
    expect(inbox.map(item => item.id)).toContain('inq_lena_brass_collar')
    expect(inquiriesStartedBy(state.inquiries, maker.id)).toEqual([])
  })

  it('gates thread access to the inquirer or the product maker', () => {
    const state = createSeedState()
    const thread = state.inquiries[0]
    if (!thread) throw new Error('Seed is missing its inquiry')

    expect(canViewInquiryAsInquirer(thread, thread.inquirerUserId)).toBe(true)
    expect(canViewInquiryAsInquirer(thread, thread.makerUserId)).toBe(false)
    expect(canViewInquiryAsMaker(thread, thread.makerUserId)).toBe(true)
    expect(canViewInquiryAsMaker(thread, thread.inquirerUserId)).toBe(false)
  })

  it('detects the maker of a product and resolves display names', () => {
    const state = createSeedState()
    const product = state.products[0] as Product
    const maker = state.users.find(user => user.id === product.makerId)
    const other = state.users.find(user => user.id !== product.makerId)
    if (!maker || !other) throw new Error('Seed is missing users')

    expect(isOwnProductInquiry(product, maker.id)).toBe(true)
    expect(isOwnProductInquiry(product, other.id)).toBe(false)
    expect(displayNameFor(state.users, maker.id)).toBe(maker.displayName)
    expect(displayNameFor(state.users, 'missing')).toBe('')
  })

  it('truncates long message previews', () => {
    expect(messagePreview('Short')).toBe('Short')
    expect(messagePreview('abcdefghij', 6)).toBe('abcde…')
  })

  it('formats inquiry times and finds records by id', () => {
    const state = createSeedState()
    const thread = state.inquiries[0]
    if (!thread) throw new Error('Seed is missing its inquiry')

    expect(formatInquiryTime(thread.createdAt, 'en')).toMatch(/\d/)
    expect(formatInquiryTime('not-a-date', 'en')).toBe('')
    expect(findInquiryById(state.inquiries, thread.id)?.id).toBe(thread.id)
    expect(findInquiryById(state.inquiries, 'missing')).toBeUndefined()
    expect(findProductForInquiry(state.products, thread)?.id).toBe(thread.productId)
  })

  it('keeps a started inquiry in the inquirer list when its product is gone', () => {
    const state = createSeedState()
    const supporter = state.users.find(user => user.email === demoSupporterEmail)
    const thread = state.inquiries[0]
    if (!supporter || !thread) throw new Error('Seed is missing inquiry data')

    const products = state.products.filter(product => product.id !== thread.productId)
    const mine = inquiriesStartedBy(state.inquiries, supporter.id)

    expect(mine.some(item => item.id === thread.id)).toBe(true)
    expect(findProductForInquiry(products, thread)).toBeUndefined()
  })
})
