/** User-facing copy stored in both supported locales. */
export type LocaleString = {
  en: string
  de: string
}

export type LocaleCode = keyof LocaleString

/**
 * Demo account stored in the mock client.
 * `password` is plain text so login can compare it. This is not real authentication.
 */
export type User = {
  id: string
  email: string
  displayName: string
  password: string
  attested: true
  isMaker: boolean
}

/** Extra profile for a user with `isMaker`. `userId` is that user's id. */
export type MakerProfile = {
  userId: string
  place: string
  bio: LocaleString
  portraitImageUrl: string
}

export const currencies = ['EUR', 'KES'] as const

export type Currency = (typeof currencies)[number]

export type Price = {
  amount: number
  currency: Currency
}

export const productCategories = [
  'Ceramics',
  'Textiles',
  'Jewelry',
  'Wood',
  'Print & Paper',
  'Food & Preserve',
  'Fiber & Basketry',
  'Care & Beauty'
] as const

export type ProductCategory = (typeof productCategories)[number]

export type Product = {
  id: string
  /** User id of the maker (`User.id` where `isMaker` is true). */
  makerId: string
  title: LocaleString
  description: LocaleString
  category: ProductCategory
  price?: Price
  imageUrls: string[]
  /** ISO-8601 timestamp. */
  createdAt: string
}

export type InquiryMessage = {
  id: string
  authorUserId: string
  body: string
  createdAt: string
}

export type Inquiry = {
  id: string
  productId: string
  makerUserId: string
  inquirerUserId: string
  createdAt: string
  messages: InquiryMessage[]
}

export const communityTags = [
  'Skills',
  'Opportunities',
  'Stories',
  'Questions'
] as const

export type CommunityTag = (typeof communityTags)[number]

/** A reply is a single level. It has no nested replies. */
export type CommunityReply = {
  id: string
  authorUserId: string
  body: string
  createdAt: string
}

export type CommunityPost = {
  id: string
  authorUserId: string
  tag: CommunityTag
  title: string
  body: string
  createdAt: string
  replies: CommunityReply[]
}
