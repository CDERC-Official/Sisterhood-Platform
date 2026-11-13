import type { MakerProfile, User } from '#shared/types'

export function publicMembers(users: User[], profiles: MakerProfile[]) {
  return users.map((user) => {
    const profile = profiles.find(item => item.userId === user.id)
    return {
      id: user.id,
      displayName: user.displayName,
      place: profile?.place ?? '',
      bio: profile?.bio ?? { en: '', de: '' },
      portraitImageUrl: profile?.portraitImageUrl ?? ''
    }
  }).sort((first, second) => first.displayName.localeCompare(second.displayName))
}

export function filterMembers(members: ReturnType<typeof publicMembers>, name: string, place: string) {
  const query = name.trim().toLocaleLowerCase()
  return members.filter(member => member.displayName.toLocaleLowerCase().includes(query)
    && (!place || member.place === place))
}
