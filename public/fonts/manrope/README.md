# Manrope (local font)

- Author: The Manrope Project Authors, https://github.com/sharanda/manrope
- Distribution: Fontsource, `@fontsource-variable/manrope` version **5.3.0**.
- Download: https://registry.npmjs.org/@fontsource-variable/manrope/-/manrope-5.3.0.tgz
- Original archive path: `package/files/manrope-latin-wght-normal.woff2`.
- Local filename: `manrope-latin-variable.woff2` (font contents unchanged).
- License: **SIL Open Font License 1.1**, included verbatim in `OFL.txt`.
- Retrieved: 2026-11-10. The archive was verified against the npm registry's SHA-512 integrity value before extraction.
- Font SHA-256: `a30ddcd349703aff7464c34bef3fffdff405ee50c113440d7c8693c02d210972`.

The normal-style variable font covers weights 200–800. Fontsource declares the Latin subset to include U+0000–00FF (including ÄÖÜäöüß) and U+20AC (€). Other scripts and extended Latin characters may use the system fallback until additional subsets are provided.

`app/assets/css/main.css` declares the font with `font-display: swap` and a system fallback. Nuxt Fonts automatic resolution is disabled in `nuxt.config.ts`; no external font service is required. No font package was added as a dependency.
