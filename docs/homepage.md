# Homepage integration

The homepage branch changes `app/pages/index.vue` and adds components under
`app/components/home/` plus homepage-only copy in `app/data/home-copy.ts`.
It leaves the shared seed, domain types, mock store, auth, feature translations,
navigation data and dependency files unchanged.

## Shared data

- Profiles: `useMakers().makers`, joining the existing user and maker profile.
- Products: `useProducts().products`, linked by `makerId`.
- Contributions: `useCommunity().posts`, linked by `authorUserId`.
- Bilingual seed fields: `useLocaleText().localeText()`.
- Author names: shared `useMockStore().state.users`.

The Graz profile is featured when available; two other profiles follow.
One existing product per featured maker is selected. Contributions tagged
`Stories` are shown first, followed by other community contributions, up to three.
No seeded record is copied or modified. Stored changes are reflected on mount.

## Locales and previews

The existing i18n routing is preserved: `/` is English, `/de` is German.
Homepage UI copy supports both. Community posts are English-only in the existing
types, so they retain their original text and `lang="en"` on German pages.

Member cards now link to `/members/[id]` with the active locale. Product and
contribution cards still open read-only preview dialogs. These do not
implement the other developer's routes, sign-in or inquiry flow. Homepage calls
to action open the localized community feed or the same-page `#vision` anchor.
The member section includes a localized link to the full member directory.
The vision section retains `scroll-mt-24` to clear the sticky header.
Replace preview actions with agreed feature routes when those are integrated.

## Images and regional content

Member cards, including the hero cards, load the existing shared portrait URLs.
The same MemberPortrait component renders square, centered crops on the
homepage, directory and profile. Missing or failed images fall back to initials
with a translated accessible label. Photo and name links preserve the locale.
Product cards and hero previews use `imageUrls[0]`, matching the product catalog
and initial product detail image. A shared HomeProductImage keeps its fallback
until the image loads successfully, and retains it on missing or failed images.
Both sizes use centered 4:3 crops and the localized product title as alt text.
Shared seed records remain unchanged.

The hero uses `public/images/home/workshop-hero.png`, an original image generated
with OpenAI image generation for this prototype on 2026-11-10. It is a fictional
shared workshop illustration, not a photograph of seeded members or a real
Sisterhood event. The user-supplied reference informed the composition only;
its screenshot, text and portraits were not extracted. The visible caption
identifies the generated illustration in both languages. Source generation:
`/workspace/generated_images/exec-d60479e5-0dd6-4a41-b85b-e86373475f85.png`.

Graz–New Zealand remains the draft project vision. The actual seeded profiles
are in Kenya and Europe, with EUR and KES prices. This difference is disclosed
on the page; there are no invented New Zealand profiles or converted prices.

The explicitly requested DE/EN switcher uses the existing i18n route helpers.
Header/footer copy lives in `app/data/layout-copy.ts`, separate from the feature
translations. Home links preserve the locale and the current homepage entry is
marked active in both languages. The default locale and route availability stay
unchanged. Sign-in can still be added to the header's right slot alongside the
language switcher by the responsible developer.

The switcher's `UButton` links use `locale="false"` (bound as a boolean): their
targets are already resolved by `useSwitchLocalePath`. Without this override,
Nuxt UI would localise the unprefixed English target back into German.
