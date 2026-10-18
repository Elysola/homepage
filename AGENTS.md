# Elysola Homepage

Tech stack: **Bun + TypeScript + Nuxt.js + Tailwind CSS**
Deploy target: **Cloudflare Pages**

## Commands

```bash
bun install          # install dependencies
bun dev              # start dev server (Nuxt)
bun run build        # build for production
bun run preview      # preview production build
bun run lint         # lint code (ESLint via @nuxt/eslint)
bun run format       # format code with Prettier
bun run typecheck    # type-check with vue-tsc
```

## Deployment

Deployed to Cloudflare Pages. Nuxt generates static output (`.output/public/`) which Cloudflare Pages serves. The `nitro` preset in `nuxt.config.ts` should be `"cloudflare-pages"` for proper output.

## Project structure (expected)

```
app.vue                  # root layout (nav, footer, <NuxtPage/>)
pages/
  index.vue              # homepage (hero + projects)
  team.vue               # team members page
nuxt.config.ts           # Nuxt configuration (cloudflare preset, Tailwind, i18n, fonts)
tailwind.config.ts       # Tailwind CSS configuration
tsconfig.json            # TypeScript configuration
package.json             # project manifest + scripts
eslint.config.mjs        # ESLint flat config
.prettierrc              # Prettier config
i18n/locales/
  en.json                # English translations
  zh-CN.json             # Chinese (simplified) translations
```

## Localization (i18n)

Powered by `@nuxtjs/i18n`. Default locale is `zh-CN`. Switch language via `useI18n().locale`. Locale strategy is `prefix_except_default` — the default locale (`zh-CN`) has no prefix; `en` routes are prefixed with `/en/`.

## Notes

- Use `bun` not `npm`/`pnpm`/`yarn` for all package management.
- The project does not use `nuxi` CLI directly—Nuxt commands go through `bun run`.
- Cloudflare Pages deployment expects the Nitro preset to be set to `"cloudflare-pages"` in `nuxt.config.ts`.
