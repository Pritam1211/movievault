# Release build

## Signing setup

Three pieces in three places, deliberately:

| What | Where | In git? |
|---|---|---|
| Keystore file | `android/app/movievault-release.keystore` | No — `*.keystore` ignored |
| Credentials | `~/.gradle/gradle.properties` | No — outside the repo entirely |
| Gradle wiring | `android/app/build.gradle` | Yes — names only, no values |

The credentials live in `~/.gradle/gradle.properties` rather than
`android/gradle.properties` because the latter is tracked by git (it holds
`newArchEnabled`, JVM args and similar). Keeping secrets outside the repo is
stronger than gitignoring them, because it doesn't depend on a rule staying
correct.

`build.gradle` guards the release config with `project.hasProperty(...)`. Without
that guard a clone lacking the credentials fails to *configure*, which breaks
`assembleDebug` too — not just release builds. This is also what lets CI build
debug variants before signing secrets are added.

## Upload certificate

| | |
|---|---|
| Alias | `movievault` |
| Owner | `CN=Pritam Gaikwad, O=Movievault, C=IN` |
| Algorithm | RSA 2048, SHA256withRSA |
| Valid | 2026-09-27 → 2054-02-12 |
| SHA256 | `3F:64:88:94:35:76:5E:25:00:15:42:86:20:E8:70:00:27:BD:A2:6D:83:26:E6:5C:8D:DC:E7:98:93:5F:7E:28` |

The SHA256 fingerprint is needed for Play App Signing enrolment and for any
Google API allowlist (Sign-In, Maps).

## Building

Signed AAB, for Play:

    cd android && ./gradlew bundleRelease
    # → android/app/build/outputs/bundle/release/app-release.aab

Signed APK, for sideloading or sharing directly:

    cd android && ./gradlew assembleRelease
    # → android/app/build/outputs/apk/release/app-release.apk

An AAB cannot be installed directly — it needs `bundletool`. Use the APK when
distributing outside Play.

Verify which key signed an artifact:

    keytool -printcert -jarfile <path to .aab or .apk> | grep Owner

`CN=Android Debug` means it was signed with the debug key and Play will reject it.

## ProGuard

Currently off (`enableProguardInReleaseBuilds = false`, build.gradle line 60),
which is React Native's default. Enabling it shrinks the download but breaks
reflection-based code in ways that only appear at runtime in production. Worth
revisiting once the app is live and stable, not before.

## Recovery

If `movievault-release.keystore` is lost, updates to an existing Play listing
become impossible — no recovery, no support path. The only way forward is a new
app listing at a new URL, with every user reinstalling manually.

Back up the keystore file AND its password somewhere off this machine.

## Version bumps

Play rejects an upload whose `versionCode` is not higher than the last one.
Both live in `android/app/build.gradle` `defaultConfig`:

- `versionCode` — integer, must increase every upload
- `versionName` — the string users see ("1.0", "1.1")
