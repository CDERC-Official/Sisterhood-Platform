export function usePublicSeo(title: () => string, description: () => string) {
  useSeoMeta({
    title: () => `${title()} | Sisterhood`,
    description,
    ogTitle: () => `${title()} | Sisterhood`,
    ogDescription: description
  })
}
