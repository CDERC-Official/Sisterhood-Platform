# About page and prototype metadata

`/about` and `/de/about` explain the draft vision without claiming a founding
history, team, partnerships, membership figures or real activities. They clearly
separate the proposed Graz–New Zealand direction from the fictional Kenya and
Europe seed content. No media or dependencies were added.

The page uses existing Manrope, Forest, Porcelain and Sage tokens. It provides
separate localized links to the community feed and member directory. The home
vision button still targets its own `#vision` section.

Public pages own their translated titles, descriptions and Open Graph text.
`usePublicSeo` shares the metadata shape for about, directory, profiles, products,
community and demo authentication. Home retains its existing SEO structure with
an explicit prototype description. App-level metadata only supplies the existing
language, viewport, favicon and Twitter card format. No production domain,
canonical URL or social image is assumed.

A shared visible demo notice identifies fictional profiles, products and posts,
browser-local accounts and simulated messages. The existing AI illustration
caption remains unchanged. No seed, auth, feed or form behavior was changed.

Before publication, agree the final project description, regional scope, media
rights and production hosting/SEO requirements. The demo remains a client-side
mock with account records included in its payload; it is not a production service.

## Verification

Lint, typecheck, all 48 existing unit tests and the production build pass.
Chromium checks cover direct English/German about routes at 320, 390 and 1440px,
localized navigation, language switching, document language, one H1, heading
order, keyboard focus and absence of horizontal overflow. Screenshots are stored
under ignored `.data/screenshots/about-{width}-{locale}.png`.

Fourteen additional public routes (seven in each language) were checked for
unique title, description and Open Graph text plus the visible demo notice.
The existing home vision anchor and AI illustration alt text remain intact.
No dependencies, seed records or business behavior were changed.
