# MovieVault

Personal film catalogue. React Native 0.87 (bare CLI), **Android only** — no Xcode, no
iOS, no CocoaPods. TMDB for content, Supabase for auth and the user's watchlist.

Portfolio project: it ships to the Play Store, so polish and finished states matter as
much as features.

## Design

Full spec: `docs/design-spec.html` — open it in a browser.

Discover is a **grid** (browsing is visual); Search is a **list** (search results
share titles, so year and rating are needed to tell them apart). The difference is
deliberate — don't "fix" it into consistency.

**The idea:** the UI is the dark room, the posters are the light. Film artwork is loud;
the chrome stays quiet so it doesn't compete. All colour on screen comes from the
posters.

Palette lives in `src/theme/colors.ts`:

| token | hex | use |
|---|---|---|
| ink | `#0B0F14` | ground (blue-black, not neutral grey) |
| raised | `#151C24` | inputs, surfaces |
| line | `#232C36` | borders |
| bulb | `#E8B44A` | **accent — primary action and focused input only** |
| chalk | `#EDEAE4` | primary text |
| dim | `#7C8794` | secondary text |
| alert | `#E05D52` | errors |

`bulb` is never decoration and never a heading colour. If it's amber, it's tappable.

Gutter 28. Radius: 10 inputs/buttons, 5 posters, 99 pills. No uppercase labels.
Negative letter-spacing only above ~20px.

### Two hard rules

**Never `<Text>` directly — use `<AppText variant="...">`** from `src/components/`.
A bare `<Text>` defaults to black and is invisible on `ink`. The wrapper makes the
default correct; its `style` prop still merges for one-off overrides.

**Never a raw hex — import from `src/theme/colors.ts`.** Same for type: variants come
from `src/theme/typography.ts`. `<TextInput>` cannot use `AppText`, so it takes the raw
object: `style={[typography.body, styles.input]}`.

Variants are named by **role**, not size — `title`, `label`, `strong`, `body`,
`caption`. Renaming the scale must never make a variant name lie.

**Motion answers actions, never mounts.** Press-scale on primary buttons, shake on
failed auth, fade errors in. No staggered entrance animations — they read as generated.

Every screen needs its loading, empty and error states built, not added later.

## Structure

```
src/
  config/     env.ts (gitignored), env.example.ts
  lib/        supabase.ts, tmdb.ts, queryClient.ts
  theme/      colors.ts
  navigation/
  components/ shared, presentational only
  features/<feature>/{screens,hooks,components}/ + api.ts + types.ts
  domain/     pure TS, zero imports, unit-tested
```

Rules: if one feature uses it, it lives in that feature — promote to `components/` only
on second use. `api.ts` per feature keeps data access out of screens. `domain/` stays
import-free so it tests in milliseconds with no emulator.

## Supabase

- Table `movies.watchlist`, custom schema — query with `supabase.schema('movies')`,
  not the default `public`.
- **RLS is the entire authorization layer.** Every table gets it. `using` for rows you
  can see, `with check` for rows you write; `update` needs both or a user can reassign
  `user_id`.
- Only the **anon** key ships. `service_role` bypasses RLS and must never be in the app.
- Sessions persist via MMKV. `useAuth` needs both `getSession()` (restores) and
  `onAuthStateChange` (stays current).
- `AppState` listener drives `startAutoRefresh` / `stopAutoRefresh`, or a backgrounded
  app returns with an expired token.

## Gotchas already paid for

- **`SafeAreaProvider` applies no padding** — it only provides context. Use
  `SafeAreaView`, and give it `flex: 1` or it sizes to its content.
- **Reanimated's Babel entry goes in `plugins`, not `presets`**, and is
  `react-native-worklets/plugin`. Restart Metro with `--reset-cache` after touching
  `babel.config.js`.
- **MMKV 4 needs `react-native-nitro-modules`** installed separately. Gradle naming a
  project path you don't recognise = a missing peer dependency.
- Native module installed or `android/` edited → `run-android`, not `start`.
- `java17` before any Gradle command; `JAVA_HOME` is unset and defaults to Java 23.

## Commands

```bash
java17 && npx react-native run-android      # after native changes
npx react-native start                       # JS-only changes
npx tsc --noEmit && npx jest                 # before committing
adb exec-out screencap -p > screen.png       # for design review
```
