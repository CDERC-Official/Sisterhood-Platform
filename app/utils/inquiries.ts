/**
 * Pure helpers for inquiry lists and access checks.
 * Pages and components own locale copy; this module only shapes store data.
 */
import type { Inquiry, InquiryMessage, Product, User } from '#shared/types'

export function lastInquiryMessage(inquiry: Inquiry): InquiryMessage | undefined {
  return inquiry.messages[inquiry.messages.length - 1]
}

export function inquiryActivityAt(inquiry: Inquiry): string {
  return lastInquiryMessage(inquiry)?.createdAt ?? inquiry.createdAt
}

export function sortInquiriesNewestFirst(inquiries: Inquiry[]): Inquiry[] {
  return inquiries
    .slice()
    .sort((a, b) => inquiryActivityAt(b).localeCompare(inquiryActivityAt(a)))
}

export function inquiriesStartedBy(inquiries: Inquiry[], userId: string): Inquiry[] {
  return sortInquiriesNewestFirst(
    inquiries.filter(inquiry => inquiry.inquirerUserId === userId)
  )
}

export function inquiriesForMakerInbox(inquiries: Inquiry[], makerUserId: string): Inquiry[] {
  return sortInquiriesNewestFirst(
    inquiries.filter(inquiry => inquiry.makerUserId === makerUserId)
  )
}

export function canViewInquiryAsInquirer(inquiry: Inquiry, userId: string): boolean {
  return inquiry.inquirerUserId === userId
}

export function canViewInquiryAsMaker(inquiry: Inquiry, userId: string): boolean {
  return inquiry.makerUserId === userId
}

export function isOwnProductInquiry(product: Product, userId: string): boolean {
  return product.makerId === userId
}

export function displayNameFor(users: User[], userId: string): string {
  return users.find(user => user.id === userId)?.displayName ?? ''
}

export function messagePreview(body: string, maxLength = 120): string {
  const trimmed = body.trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, Math.max(0, maxLength - 1))}…`
}

export function formatInquiryTime(iso: string, locale: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat(locale === 'de' ? 'de-AT' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

export function findInquiryById(inquiries: Inquiry[], id: string): Inquiry | undefined {
  return inquiries.find(inquiry => inquiry.id === id)
}

export function findProductForInquiry(products: Product[], inquiry: Inquiry): Product | undefined {
  return products.find(product => product.id === inquiry.productId)
}
