# Sisterhood MVP — GitHub stories

Implementation batch for account, product listings, inquiries, and community. Split from the MVP plan into stories that can be pasted into GitHub issues.

The MVP plan file stays unchanged. This batch does not include the homepage, header, footer, or design tokens.

## How to use this file

- One story = one GitHub issue. Title is the issue title.
- Build in the order below. A story lists the issues it depends on.
- Labels: `story` plus the epic label (`mock-data`, `account`, `products`, `inquiries`, `community`).

## Stack for every story

- Nuxt 4, TypeScript, Nuxt UI, Tailwind CSS.
- Prefer Nuxt UI components (`UForm`, `UFormField`, `UInput`, `UTextarea`, `USelect`, `UCheckbox`, `UButton`, `UCard`, `UBadge`, `UAvatar`, `UModal`, `UEmpty`, `UAlert`, `UNavigationMenu`, `UTabs`, `UContainer`).
- Use Tailwind for layout only: page width, stack, grid, gap, alignment.
- Keep the current Nuxt UI theme. Do not add color tokens, fonts, or a custom `app.config` palette in this batch.
- Leave [`app/app.vue`](app/app.vue) header and footer as they are. Reach new pages by URL, and by links inside the account section.
- Mock only. No database, email, OAuth, payments, cart, file storage, or admin moderation.
- Done when `pnpm typecheck` and `pnpm lint` pass, and the acceptance checks work in the running app.

## Suggested order

| Order | ID | Issue title |
|------:|----|-------------|
| 1 | S1.1 | Add domain types for users, listings, inquiries, and community |
| 2 | S1.2 | Add bilingual seed data |
| 3 | S1.3 | Add a client mock store that survives refresh |
| 4 | S1.4 | Add en/de i18n for feature pages |
| 5 | S2.1 | Register, log in, and log out with mock auth |
| 6 | S2.2 | Gate guest actions and return to the previous page |
| 7 | S2.3 | Edit the signed-in profile at /account |
| 8 | S2.4 | Add account navigation and empty section routes |
| 9 | S3.1 | Browse the product catalog |
| 10 | S3.2 | View a product |
| 11 | S3.3 | Create, edit, and delete products in the maker studio |
| 12 | S4.1 | Start a private inquiry from a product |
| 13 | S4.2 | Read and reply in My inquiries |
| 14 | S4.3 | Read and reply in the maker inbox |
| 15 | S5.1 | Browse the community feed by tag |
| 16 | S5.2 | Publish a community post |
| 17 | S5.3 | Reply once and delete your own community posts |

## Out of scope for this batch

- Homepage, including the hero, maker shelf, workshop shelf, and story band.
- Header, footer, logo, and locale switcher in the shell.
- Design tokens, Fraunces, Karla, and any replacement of the Nuxt UI palette.
- Public maker directory (`/makers`, `/makers/[id]`). Product pages show the maker’s name and place as text.
- Playwright smoke tests and the CI e2e job.
- Payments, cart, OAuth, outgoing email, admin moderation, real database, forums, and direct messages other than inquiry threads.

---

## Epic: Mock data

Shared types, seed content, and the client store that account, listings, inquiries, and community all read.

### S1.1 — Add domain types for users, listings, inquiries, and community

**Labels:** `story`, `mock-data`
**Depends on:** none

**Description**

Add the TypeScript types for the mock domain so later stories share one model.

**Acceptance criteria**

- [ ] Types live in `shared/types/` and are imported by later seed and composables.
- [ ] `LocaleString` is `{ en: string, de: string }` for user-facing text on seed entities.
- [ ] User: id, email, display name, password (demo only), `attested: true`, `isMaker`.
- [ ] Maker profile: user id, place, bio (`LocaleString`), portrait image URL. A maker is a user with `isMaker`.
- [ ] Product: id, maker id, title and description (`LocaleString`), category, optional price `{ amount, currency }` where currency is `EUR` or `KES`, image URLs, created at.
- [ ] Categories are a fixed union: Ceramics, Textiles, Jewelry, Wood, Print & Paper, Food & Preserve, Fiber & Basketry, Care & Beauty.
- [ ] Inquiry: id, product id, maker user id, inquirer user id, created at, messages.
- [ ] Inquiry message: id, author user id, body, created at.
- [ ] Community post: id, author user id, tag, title, body, created at, replies.
- [ ] Community reply: id, author user id, body, created at. Replies have no nested replies.
- [ ] Community tags are a fixed union: Skills, Opportunities, Stories, Questions.
- [ ] `pnpm typecheck` passes.

**Notes**

No pages in this story. Passwords exist only so the demo login can compare them. Add a short comment on the user type that this is not real authentication.

---

### S1.2 — Add bilingual seed data

**Labels:** `story`, `mock-data`
**Depends on:** S1.1

**Description**

Seed enough makers, products, posts, and one inquiry thread that every later page has something to render before the user creates their own data.

**Acceptance criteria**

- [ ] Seed is typed against S1.1 and lives in `app/data/seed.ts` (or `server/data/seed.ts` if that matches the Nuxt 4 layout). It is the only source of initial content.
- [ ] 6–8 makers, mix of DACH and Kenya, each with place, bilingual bio, and a stable image URL (Unsplash or Pexels).
- [ ] Each maker has 3–5 products across more than one category. Some products have a price, some do not. Prices use `EUR` or `KES`.
- [ ] At least one community post for each tag (Skills, Opportunities, Stories, Questions), including at least one post that already has a reply.
- [ ] Two demo accounts, documented at the top of the seed file:
  - Maker: `amara@sisterhood.test`
  - Supporter: `lena@sisterhood.test`
  - Shared demo password: `sisterhood`
- [ ] The maker demo account owns a subset of the seeded products. The supporter demo account is the inquirer on one seeded thread about one of that maker’s products, with at least two messages.
- [ ] Image fields are URL strings. No local binary assets.
- [ ] Every bilingual field has both `en` and `de` copy.

**Notes**

Copy should sound like makers talking about their work. No homepage marketing blocks in the seed.

---

### S1.3 — Add a client mock store that survives refresh

**Labels:** `story`, `mock-data`
**Depends on:** S1.1, S1.2

**Description**

Expose the seed through composables. Reads and writes stay in memory for the session and are written to `localStorage`, so a refresh keeps demo edits.

**Acceptance criteria**

- [ ] Composables: `useAuth`, `useMakers`, `useProducts`, `useInquiries`, `useCommunity`. They share one store rather than each holding a private copy of the seed.
- [ ] Initial state is the seed. After the first write, `localStorage` is the source on the next load.
- [ ] A small reset helper restores the seed and clears the stored snapshot. It does not need a page yet; it can be a composable function called from the account page in S2.3.
- [ ] Mutations needed by later stories are real functions, not placeholders:
  - register, login, logout, update profile, update maker profile
  - create, update, delete product
  - create inquiry, append inquiry message
  - create community post, append one reply, delete own post, delete own reply
- [ ] Creating an entity assigns an id and a timestamp.
- [ ] Navigating between pages keeps the new data. Reloading the browser keeps it too.
- [ ] No `fetch` to a backend and no new server routes.

**Notes**

Guard `localStorage` so server render does not throw. Hydrate on the client. `useState` is the in-app cache.

---

### S1.4 — Add en/de i18n for feature pages

**Labels:** `story`, `mock-data`
**Depends on:** S1.1

**Description**

Install i18n so account, product, inquiry, and community pages can ship English and German copy. The locale switcher in the header is not part of this story.

**Acceptance criteria**

- [ ] `@nuxtjs/i18n` is added and registered in `nuxt.config.ts`.
- [ ] Locales are `en` (default) and `de`. Strategy is `prefix_except_default`: English stays `/products`, German is `/de/products`. The same rule applies to `/account`, `/auth`, and `/community`.
- [ ] Message files exist at `i18n/locales/en.json` and `de.json`. They can start with a small shared set (actions such as save, cancel, delete, and empty-state labels). Each later story adds its own keys to both files.
- [ ] A typed helper or documented pattern resolves `LocaleString` with the active locale.
- [ ] Changing the URL from `/products` to `/de/products` changes the active locale. No header control is added.
- [ ] Homepage strings in the starter page are left as they are.

**Notes**

Later UI stories must not hard-code feature copy in the template. They use `t()` for UI chrome and the locale helper for seed fields.

---

## Epic: Account

Mock registration and login, the signed-in profile, and the account section that inquiries, inbox, and the studio plug into.

### S2.1 — Register, log in, and log out with mock auth

**Labels:** `story`, `account`
**Depends on:** S1.3, S1.4

**Description**

A visitor can create a demo account or sign in as a seeded user. The session is the user id in the mock store.

**Acceptance criteria**

- [ ] `/auth` is one page with a Nuxt UI form. The visitor can switch between Join and Log in without a route change (`UTabs` or two buttons).
- [ ] Join collects email, password, display name, a required self-attest checkbox, and an optional “I am a maker” checkbox. Submit stays disabled until attest is checked.
- [ ] Join rejects a duplicate email and shows the error on the form (`UAlert` or `UFormField` error). A successful join signs the user in.
- [ ] A new maker also gets an empty maker profile (place and bio can be blank).
- [ ] Log in accepts the seeded accounts (`amara@sisterhood.test` / `sisterhood`, `lena@sisterhood.test` / `sisterhood`) and any account registered in this browser.
- [ ] A wrong password or unknown email shows an error and does not start a session.
- [ ] Log out clears the session. It is available on `/auth` when a session exists, and from the account page in S2.3.
- [ ] Reload keeps the session.
- [ ] Copy is translated in `en` and `de`.
- [ ] No email is sent. No password reset.

**Notes**

Build the form with `UForm`, `UFormField`, `UInput`, `UCheckbox`, and `UButton`. Tailwind only for the page stack (`UContainer`, max width, gap).

---

### S2.2 — Gate guest actions and return to the previous page

**Labels:** `story`, `account`
**Depends on:** S2.1

**Description**

Guests who open a signed-in page are sent to `/auth` and brought back after a successful join or log in.

**Acceptance criteria**

- [x] `app/middleware/auth.ts` protects `/account` and everything under it.
- [x] A guest opening a protected URL is redirected to `/auth?returnTo=<path>`. `returnTo` is a relative path on this site. Other values are ignored and the user lands on `/account`.
- [x] After join or log in, the app navigates to `returnTo` when it is present, otherwise to `/account`.
- [x] A signed-in user opening `/auth` is sent to `/account`.
- [x] The German prefix is preserved (`/de/auth`, `/de/account`).
- [x] The middleware reads the same session as `useAuth`.

**Notes**

Inquiry and community stories will call this same redirect. Do not build those buttons here. Add a tiny helper, for example `redirectToAuth(returnTo)`, that they can reuse.

---

### S2.3 — Edit the signed-in profile at /account

**Labels:** `story`, `account`
**Depends on:** S2.2

**Description**

The signed-in user can see who they are and update their profile. Makers can also update the public-facing maker fields that product pages will read.

**Acceptance criteria**

- [ ] `/account` requires auth.
- [ ] The page shows email (read-only), display name, and the maker flag.
- [ ] Display name can be edited and saved. The new name is still there after refresh.
- [ ] When the user is a maker, the page also edits place, bilingual bio, and portrait URL. Saving updates the maker record used by product pages.
- [ ] A supporter does not see maker fields. They can turn on “I am a maker”, save, and then see the maker fields.
- [ ] Turning the maker flag off is not required. Leave the flag one-way for this story so studio products keep an owner.
- [ ] Validation: display name is required. Portrait, when present, is a URL string. Bio may be empty.
- [ ] Success and error feedback use Nuxt UI (`UAlert` or a toast if the app already has one).
- [ ] A log out button on this page clears the session and sends the user to `/auth`.
- [ ] A “Reset demo data” control calls the store reset from S1.3, then sends the user to `/auth` because the session user may no longer match.
- [ ] Copy is translated in `en` and `de`.

**Notes**

`UForm` + `UFormField`. Two textareas or a locale field for bio `en` and `de`, using `USelect` or `UTabs` to pick which language is being edited. Do not build the inquiries, inbox, or studio pages in this story.

---

### S2.4 — Add account navigation and empty section routes

**Labels:** `story`, `account`
**Depends on:** S2.3

**Description**

The account area has a stable navigation and the routes later stories will fill. Empty routes render an empty state so the links are not 404s.

**Acceptance criteria**

- [ ] A shared account nav (`UNavigationMenu` or `UTabs`) is used by every page under `/account`.
- [ ] Items:
  - Profile → `/account` (the S2.3 page)
  - My inquiries → `/account/inquiries`
  - Inbox → `/account/inbox` (makers only)
  - Studio → `/account/studio` (makers only)
- [ ] Supporters do not see Inbox or Studio.
- [ ] `/account/inquiries`, `/account/inquiries/[id]`, `/account/inbox`, `/account/inbox/[id]`, and `/account/studio` exist, require auth, and render `UEmpty` with one sentence that the section is not filled in yet.
- [ ] A supporter who opens `/account/inbox` or `/account/studio` directly is redirected to `/account`.
- [ ] The active item matches the current route, including nested inquiry and inbox ids.
- [ ] German URLs work (`/de/account/studio`, and the rest).
- [ ] Nav labels are translated.

**Notes**

Do not implement lists, threads, or the product form here. Those are S3.3, S4.2, and S4.3. This story only reserves the routes and the navigation.

---

## Epic: Products

Public catalog and product page, plus the maker studio forms that create and change listings. Images are URLs, same as the seed.

### S3.1 — Browse the product catalog

**Labels:** `story`, `products`
**Depends on:** S1.3, S1.4

**Description**

Anyone can open `/products` and scan listings from the mock store, including products a maker adds later in the studio.

**Acceptance criteria**

- [ ] `/products` lists every product in the store.
- [ ] Each item shows image, localized title, maker display name, place, category, and price when the product has one. Products without a price do not show a fake amount.
- [ ] Category filters use the fixed category list. One category can be selected at a time, plus “All”. Filters are `UButton` or `UBadge` toggles, not a custom chip component.
- [ ] A search box (`UInput`) filters by localized title and maker name for the active locale.
- [ ] Search and category combine. No matches shows `UEmpty`.
- [ ] Each item links to `/products/[id]`.
- [ ] The list updates when a product is created, edited, or deleted in the same session.
- [ ] Layout is a responsive grid (one column on small screens, more from `md` up) using Tailwind. Cards are `UCard`.
- [ ] Copy, category labels, and product text follow the active locale.

**Notes**

No homepage shelf. No header link; the page is opened by URL until the shell is designed. Do not add sort, pagination, or a cart.

---

### S3.2 — View a product

**Labels:** `story`, `products`
**Depends on:** S3.1

**Description**

`/products/[id]` is the listing page a visitor lands on before they inquire.

**Acceptance criteria**

- [ ] The page shows the image set, localized title and description, category, maker display name, maker place, and price when present.
- [ ] More than one image can be viewed. A row of buttons or thumbnails swaps the large image. One image does not show a useless control.
- [ ] An unknown id renders `UEmpty` (or `UAlert`) and a link back to `/products`. It does not throw.
- [ ] A primary `UButton` labeled for inquiry is visible. It does not create a thread in this story. S4.1 wires it. Until then it can be disabled, or it can call `redirectToAuth` only if that is already the S4.1 behavior and S4.1 is done.
- [ ] Maker name is text. Do not add `/makers/[id]`.
- [ ] Localized fields and UI chrome follow the active locale.
- [ ] After a studio edit, reopening this page shows the saved title, text, price, and images.

**Notes**

Use `UContainer`, heading, `UBadge` for the category, and Tailwind for the two-column layout from `lg` up (image, then text).

---

### S3.3 — Create, edit, and delete products in the maker studio

**Labels:** `story`, `products`
**Depends on:** S2.4, S3.1

**Description**

A maker manages their listings from `/account/studio`. Supporters never see this page (already redirected in S2.4).

**Acceptance criteria**

- [ ] `/account/studio` replaces the S2.4 empty state for makers.
- [ ] The page lists only the signed-in maker’s products, with image, localized title, category, and links to edit and view the public page.
- [ ] Empty studio uses `UEmpty` and a create action.
- [ ] Create lives at `/account/studio/products/new`. Edit lives at `/account/studio/products/[id]`. Both use one form component.
- [ ] Fields: title `en`, title `de`, description `en`, description `de`, category (`USelect`), optional price amount, currency (`USelect`: EUR or KES), one or more image URLs.
- [ ] Title in the active locale, category, and at least one image URL are required. Amount, if set, is a positive number. A price without a currency, or a currency without an amount, does not save.
- [ ] Save on create adds the product to the store, owned by the current maker, and opens the public product page or the studio list.
- [ ] Save on edit updates that product only. A maker cannot open another maker’s edit URL; they get the studio empty/error state.
- [ ] Delete asks for confirmation in a `UModal`, removes the product, and returns to `/account/studio`. The product is gone from `/products` and its public URL shows the unknown-id state.
- [ ] Changes survive refresh.
- [ ] Copy is translated, including validation errors.

**Notes**

“Upload” in this batch is adding an image URL and showing a preview (`UAvatar` or an `img`). No file input and no storage bucket. Prefer `UForm`. The studio list can stay a simple `UCard` stack.

Deleting a product that has inquiries: keep the inquiry threads, and let the thread story show the product title as unavailable if the product is missing. Do not cascade-delete conversations.

---

## Epic: Inquiries

A private thread between the person who asks and the maker of the product. Both account routes from S2.4 get their real UI here.

### S4.1 — Start a private inquiry from a product

**Labels:** `story`, `inquiries`
**Depends on:** S2.2, S3.2, S3.3

**Description**

The Inquire button on a product opens a short composer. Sending it creates a thread that only the inquirer and that product’s maker can see.

**Acceptance criteria**

- [ ] The product page Inquire button is enabled.
- [ ] A guest who uses it goes to `/auth?returnTo=` the product path, then returns to that product after join or log in.
- [ ] A signed-in user gets a `UModal` (or a small form on the page) with one required message field and a send button.
- [ ] Send creates an inquiry: product id, maker user id, current user id, and the first message.
- [ ] The inquirer is then taken to `/account/inquiries/[id]` for the new thread.
- [ ] The maker cannot inquire on their own product. The button is hidden or disabled, with a short translated explanation.
- [ ] Two inquiries from the same person on the same product are allowed. This story does not merge them.
- [ ] The new thread is in the store and still there after refresh.
- [ ] Copy is translated.

**Notes**

Do not build the list pages here. The detail route can keep the S2.4 empty state until S4.2, except that a direct open of a thread the user just created should already show the first message if that is cheap to do in this story. Prefer finishing the thread view in S4.2 and, in this story, navigating to the new id even if the page is still empty — only if S4.2 follows immediately. If this story is merged in review with S4.2, the thread must show the first message before the issue is closed.

Recommended: implement the thread body together with S4.2, and in S4.1 only create the record and route to that id.

---

### S4.2 — Read and reply in My inquiries

**Labels:** `story`, `inquiries`
**Depends on:** S4.1, S2.4

**Description**

The signed-in user can see every inquiry they started, open it, and send another message.

**Acceptance criteria**

- [ ] `/account/inquiries` replaces the empty state. It lists inquiries where the current user is the inquirer, newest first.
- [ ] Each row shows product title (localized), maker name, last message preview, and time. A missing product (deleted in the studio) still lists the thread, with a translated “listing no longer available” label.
- [ ] No inquiries shows `UEmpty`.
- [ ] `/account/inquiries/[id]` shows the product title (link to the product when it still exists), the message list in time order, author display name, and a reply box.
- [ ] Reply appends a message from the current user and stays on the thread. The list preview updates. Refresh keeps the message.
- [ ] Empty reply does not send.
- [ ] Opening an id that is not this user’s inquiry, or that does not exist, shows an error state and does not leak the other thread’s messages.
- [ ] The seeded supporter (`lena@sisterhood.test`) sees the seeded thread and can reply.
- [ ] Copy is translated.

**Notes**

`UCard` or a simple stack for messages. The reply field is `UTextarea` + `UButton`. This page is the inquirer’s view; the maker uses the inbox even if they were also a participant.

---

### S4.3 — Read and reply in the maker inbox

**Labels:** `story`, `inquiries`
**Depends on:** S4.2

**Description**

A maker reads and answers inquiries about their products. The thread is the same record as My inquiries.

**Acceptance criteria**

- [ ] `/account/inbox` replaces the empty state for makers. It lists inquiries whose maker user id is the current user, newest first.
- [ ] Each row shows product title, inquirer display name, last message preview, and time.
- [ ] `/account/inbox/[id]` shows the same messages as `/account/inquiries/[id]` for that thread, plus a reply box.
- [ ] A reply from the maker appears in the inquirer’s thread, and a reply from the inquirer appears in the inbox, without a second copy of the inquiry.
- [ ] A maker cannot open another maker’s inbox thread by id.
- [ ] A supporter cannot open the inbox routes (S2.4 redirect still holds).
- [ ] The seeded maker (`amara@sisterhood.test`) sees the seeded thread and can reply. After that reply, `lena@sisterhood.test` sees it under My inquiries.
- [ ] Deleted products still leave the thread readable.
- [ ] Copy is translated.

**Notes**

Reuse the thread component from S4.2. Only the back link and the list query differ (inbox vs my inquiries).

---

## Epic: Community

One feed, four tags, posts, and a single level of replies. Same auth gate as the rest of the account work.

### S5.1 — Browse the community feed by tag

**Labels:** `story`, `community`
**Depends on:** S1.3, S1.4

**Description**

Anyone can read `/community`. Posts are filtered by Skills, Opportunities, Stories, or Questions.

**Acceptance criteria**

- [ ] `/community` lists posts from the store, newest first.
- [ ] Each post shows tag, localized title, body, author display name, and time.
- [ ] Filter control offers All plus the four tags. The active tag is reflected in the `tag` query (`/community?tag=stories`). A bad query value falls back to All.
- [ ] Tags use `UBadge` or `UButton`. Names are translated, and the stored tag value stays the English union from S1.1.
- [ ] No posts for a filter shows `UEmpty`.
- [ ] Existing replies are visible under the post, one level only, with author and time.
- [ ] The seeded post for each tag is present.
- [ ] Locale switches the UI chrome. Post title and body are plain strings in this batch (not `LocaleString`), unless the seed already stored them as bilingual — if they are `LocaleString`, display the active locale.

**Notes**

S1.1 defines post title and body as strings, not `LocaleString`, so the author writes in one language. Do not add a composer in this story. A guest can read the whole feed.

If you would rather have bilingual posts, change S1.1 before building this page. Do not invent a second shape inside the page.

---

### S5.2 — Publish a community post

**Labels:** `story`, `community`
**Depends on:** S5.1, S2.2

**Description**

A signed-in user can add a post to the feed. Guests are sent through auth and brought back.

**Acceptance criteria**

- [ ] The feed shows a compose form for a signed-in user: tag (`USelect` with the four tags), title, body, and a publish button.
- [ ] A guest who focuses or submits the form goes to `/auth?returnTo=` the current community path, including the `tag` query, and lands back on the feed after auth.
- [ ] Title, body, and tag are required.
- [ ] Publish prepends the post to the feed, attributed to the current user, and clears the form.
- [ ] The new post survives refresh and shows up under its tag filter.
- [ ] Copy and validation errors are translated.

**Notes**

Put the form in a `UCard` above the list, or in a `UModal` opened by a `UButton`. Either is fine if it uses Nuxt UI form components. Do not add image upload. Do not add edits of a published post.

---

### S5.3 — Reply once and delete your own community posts

**Labels:** `story`, `community`
**Depends on:** S5.2

**Description**

A signed-in user can reply to a post, and can delete their own post or their own reply. Replies do not nest.

**Acceptance criteria**

- [ ] Each post has one reply box for a signed-in user. Replies do not have a reply box.
- [ ] A guest who tries to reply is sent to auth and returned to the same `/community` URL.
- [ ] A non-empty reply is stored on that post, shows under it, and survives refresh.
- [ ] The author of a post sees a delete action on that post. Confirm with `UModal`. Confirming removes the post and its replies.
- [ ] The author of a reply sees a delete action on that reply only. Confirming removes that reply and leaves the post.
- [ ] Other users do not see delete on someone else’s post or reply.
- [ ] The seeded author can delete the seeded content after logging in as that user, if the seed user ids match the demo accounts. If a seeded post belongs to a maker who is not a demo login, deletion still works for any post the current user created in S5.2.
- [ ] Copy is translated.

**Notes**

There is no edit flow and no moderation queue. Deleting is a store mutation from S1.3.

---

## Issue template

Paste this under each title when opening the GitHub issue. Fill the story id.

```markdown
## Story
S_. _

## Depends on
-

## Description
<from this file>

## Acceptance criteria
- [ ]

## Out of scope
Homepage, header, footer, design tokens, and anything this story does not list.
```
