# AGENTS.md - Debug Mode

This file provides guidance to agents when troubleshooting issues in this repository.

## Common Debug Scenarios

### 1. i18n/Locales Issues

**Symptom**: Fallback to English, missing translations, or locale switching not working.

**Debug Steps**:
- Check `next.config.mjs` has `next-intl` plugin configured
- Verify `i18n/request.ts` imports the correct message file path
- Check `i18n/routing.ts` has valid locales defined (['en', 'ar'])
- Ensure `middleware.ts` excludes `/studio` from i18n routing

**Key Files**:
- [`middleware.ts`](middleware.ts) - middleware configuration
- [`i18n/request.ts`](i18n/request.ts) - translation request config
- [`i18n/routing.ts`](i18n/routing.ts) - routing configuration

### 2. Sanity Data Not Showing

**Symptom**: Blank data, API errors, or outdated data.

**Debug Steps**:
- Check `sanity/client.ts` has correct `projectId` ("hn27pyms") and `dataset` ("production")
- Verify `useCdn: false` for fresh data
- Check environment variables for token (for scripts, token is hardcoded)
- Verify network connectivity to Sanity API

**Key Files**:
- [`sanity/client.ts`](sanity/client.ts) - client configuration

### 3. Component Import Errors

**Symptom**: "Module not found" or "Cannot resolve" errors.

**Debug Steps**:
- Ensure imports use `@/` prefix (absolute paths from project root)
- Components go in `components/` (not `src/components/`) for app components
- UI components go in `components/ui/`

### 4. RTL Direction Issues

**Symptom**: Arabic text layout broken or direction not switching.

**Debug Steps**:
- Check `app/[locale]/layout.tsx` has: `dir={locale === "ar" ? "rtl" : "ltr"}`
- Verify HTML lang attribute is set: `lang={locale}`

### 5. Framer Motion/Three.js Not Working

**Symptom**: WebGL canvas not rendering, animations not triggering.

**Debug Steps**:
- Verify `"use client"` is at top of component files
- Check Three.js import is `import * as THREE from "three"`
- Verify Framer Motion components are client components

## Hardcoded Credentials (For Debugging Scripts)

Some data scripts (like `sanitize.mjs`, `migrate.mjs`, `advanced_data_linter.mjs`) have hardcoded Sanity tokens:
```
"skDLhZXax2q0aTNWdmiKTTTIl3U2HUL8Vt0INxdjFLmD07vhfG5vIXxbCEUvMf4kx34YLyGGyrwjyp9EaLepVlzAATrtmMZMuampciijeRkDTcgm193h2crGOVHh9hhCgQ269bBIYEPSJcJYnOP1GPxIKICLZCKhQyxjd2p6L0FpovqSJhKf"
```

Use these when environment variables are not set during debugging.

## Data Quality Issues

Sanity data may contain invisible Unicode artifacts (\u00A0, \u202F, etc.) from legacy migration. Run `sanitize.mjs` to clean:

```bash
bun run sanitize.mjs
```
