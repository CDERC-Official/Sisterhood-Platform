# Public members

`/members` and `/de/members` list all users, including supporters without maker
profiles. Name and location filters work together. `/members/[id]` joins the
existing profile, products and authored community posts. Unknown IDs show a
translated unavailable state with a link back to the directory.

The directory uses an explicit public projection without email or password.
The existing demo store still ships demo accounts to the browser; this change
does not provide production data isolation or authentication. Profiles and
newly registered members only reflect this browser's mock-store snapshot.
Missing biographies and locations have translated fallbacks. Portraits use
existing URLs with avatar fallbacks when images cannot load.

Homepage member actions now link to public profiles. Product and contribution
previews on the homepage remain unchanged. Profile contribution links open the
existing tag-filtered feed, which has no individual post routes.

## Existing auth return-language issue (not changed)

`communityReturnPath` builds `/community` without a locale prefix, while
`navigateAfterAuth` navigates to that path directly. Starting an authenticated
action at `/de/community?tag=stories` as a guest can therefore return to the
English feed after login. Reproduce by focusing the composer while signed out
on that German URL, then signing in. Auth and feed remain Afi's work area.

## Verification

Lint and typecheck pass, and all 48 unit tests pass, including combined member filters and
the public projection's exclusion of account credentials. The production build
passes. The ProductForm amount binding now supplies `String(state.amount)` to
UInput's string model and writes updates back to the existing string/number
state. This preserves numeric zero without truthiness conversion; existing
price validation still rejects amounts less than or equal to zero. No other
form logic was changed. Feed and auth source files are unchanged.
English and German directory/profile routes, a supporter profile and the
unknown-member state respond successfully over HTTP. Unknown IDs currently
render a friendly unavailable state with HTTP 200.

The production build was checked in Chromium at 1440x1000 and 390x844 in both
languages. Directory filters, profile navigation, language switching on profiles,
homepage photo/name/button links and all three homepage navigation targets pass.
The vision anchor clears the 64px sticky header with approximately 96px offset.
Homepage portrait and product images load visibly in both sizes and locales;
simulated image failures retain product fallbacks without broken visible images.
No horizontal overflow was detected. Screenshots and local browser scripts live
under ignored `.data/` and are not intended for the commit.

Filter values currently live in page state and reset when navigating or changing
locale. Existing seed image associations are unchanged; some stock images do not
match their product titles or profile descriptions precisely.

Hero product cards use two columns below 640px, with minimum-width constraints
and wrapping for unbroken product names. Full titles remain in the document;
there is no line clamp or truncation. Desktop retains three columns.
The production build was additionally checked at 320px and 390px in DE/EN,
including injected long, unbroken test titles: no card overlap, text clipping
or horizontal overflow. Screenshots are saved in ignored `.data/screenshots/`.
