import { describe, expect, it } from 'vitest'
import { publicMembers, filterMembers } from './members'
import { users, makerProfiles } from '../data/seed'

describe('public member directory', () => {
  const members = publicMembers(users, makerProfiles)

  it('includes supporters without publishing account credentials', () => {
    expect(members).toHaveLength(users.length)
    expect(members.find(member => member.id === 'usr_lena')?.place).toBe('')
    for (const member of members) {
      expect(member).not.toHaveProperty('email')
      expect(member).not.toHaveProperty('password')
    }
  })

  it('combines trimmed case-insensitive name search with exact location filtering', () => {
    const amara = members.find(member => member.id === 'usr_amara')!
    expect(filterMembers(members, ' AMARA ', amara.place)).toEqual([amara])
    expect(filterMembers(members, 'Amara', 'missing')).toEqual([])
    expect(filterMembers(members, '', '')).toEqual(members)
    expect(filterMembers(members, 'missing', '')).toEqual([])
  })
})
