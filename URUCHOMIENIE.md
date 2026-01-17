# Jak uruchomić aplikację na telefonie

## ⚠️ Ważne: LiveKit wymaga Development Build

Aplikacja **NIE zadziała w Expo Go** - potrzebujesz development build, ponieważ LiveKit używa natywnych modułów WebRTC.

---

## Metoda 1: Lokalny Development Build (Szybsze)

### Krok 1: Przygotowanie

1. **Zainstaluj zależności** (jeśli jeszcze nie):

```bash
npm install
```

2. **Skonfiguruj zmienne środowiskowe** - utwórz plik `.env`:

```env
EXPO_PUBLIC_LIVEKIT_URL=wss://twoj-projekt.livekit.cloud
EXPO_PUBLIC_BACKEND_URL=https://twoj-backend.netlify.app/.netlify/functions
```

3. **Wygeneruj natywny kod**:

```bash
npx expo prebuild
```

### Krok 2: Uruchomienie na telefonie

#### Dla iOS (wymaga Mac):

1. **Podłącz iPhone przez USB** do komputera
2. **Zaufaj komputerowi** na telefonie (jeśli pojawi się pytanie)
3. **Uruchom aplikację**:

```bash
npx expo run:ios --device
```

Aplikacja zostanie zbudowana i zainstalowana na telefonie.

#### Dla Android:

1. **Włącz tryb deweloperski** na telefonie:
   - Ustawienia → O telefonie → Naciśnij 7 razy "Numer kompilacji/wersji"
2. **Włącz USB Debugging**:
   - Ustawienia → Opcje deweloperskie/programisty → USB Debugging
3. **Podłącz telefon przez USB**
4. **Uruchom aplikację**:

```bash
npx expo run:android
```

### Krok 3: Development Server

Po zainstalowaniu aplikacji na telefonie, uruchom development server:

```bash
npm start
```

Aplikacja na telefonie automatycznie połączy się z serwerem deweloperskim.

---

## Uruchomienie w Symulatorze Xcode (iOS Simulator)

### Krok 1: Przygotowanie (takie samo jak wyżej)

1. **Zainstaluj zależności** (jeśli jeszcze nie):

```bash
npm install
```

2. **Skonfiguruj zmienne środowiskowe** - utwórz plik `.env`:

```env
EXPO_PUBLIC_LIVEKIT_URL=wss://twoj-projekt.livekit.cloud
EXPO_PUBLIC_BACKEND_URL=https://twoj-backend.netlify.app/.netlify/functions
```

3. **Wygeneruj natywny kod**:

```bash
npx expo prebuild
```

### Krok 2: Uruchomienie w symulatorze

```bash
npx expo run:ios
```

**Bez flagi `--device`** - Expo automatycznie:

- Otworzy iOS Simulator
- Zbuduje aplikację
- Zainstaluje i uruchomi w symulatorze

### Wybór symulatora

Możesz też wybrać konkretny symulator:

```bash
# Lista dostępnych symulatorów
xcrun simctl list devices

# Uruchom na konkretnym symulatorze
npx expo run:ios --simulator="iPhone 15 Pro"
```

### ⚠️ Ważna uwaga o WebRTC w symulatorze

**WebRTC może nie działać poprawnie w symulatorze iOS!**

- Symulator iOS nie ma dostępu do mikrofonu
- WebRTC jest zaprojektowany dla fizycznych urządzeń
- **Zalecane:** Testuj na prawdziwym telefonie dla pełnej funkcjonalności LiveKit
- Symulator jest przydatny do testowania UI, ale nie do funkcji audio/WebRTC

### Krok 3: Development Server

W osobnym terminalu uruchom:

```bash
npm start
```

Aplikacja w symulatorze automatycznie połączy się z serwerem deweloperskim.

---

## Porównanie metod uruchomienia

| Metoda               | Komenda                     | Gdzie działa                   | WebRTC              | Zalecane dla       |
| -------------------- | --------------------------- | ------------------------------ | ------------------- | ------------------ |
| **Telefon iOS**      | `npx expo run:ios --device` | iPhone (podłączony przez USB)  | ✅ Działa           | Testowanie LiveKit |
| **Symulator iOS**    | `npx expo run:ios`          | MacBook (Xcode Simulator)      | ⚠️ Może nie działać | Testowanie UI      |
| **Telefon Android**  | `npx expo run:android`      | Android (podłączony przez USB) | ✅ Działa           | Testowanie LiveKit |
| **Emulator Android** | `npx expo run:android`      | MacBook (Android Studio)       | ⚠️ Może nie działać | Testowanie UI      |

---

## Metoda 2: EAS Build (Dla produkcji lub gdy nie masz Mac dla iOS)

### Krok 1: Zainstaluj EAS CLI

```bash
npm install -g eas-cli
```

### Krok 2: Zaloguj się do Expo

```bash
eas login
```

### Krok 3: Skonfiguruj projekt

```bash
eas build:configure
```

### Krok 4: Zbuduj aplikację

#### Dla iOS:

```bash
eas build --platform ios --profile development
```

#### Dla Android:

```bash
eas build --platform android --profile development
```

### Krok 5: Zainstaluj na telefonie

1. EAS wyśle Ci link do pobrania aplikacji
2. Otwórz link na telefonie
3. Zainstaluj aplikację (może wymagać zaufania dewelopera)

### Krok 6: Uruchom development server

```bash
npm start
```

Aplikacja na telefonie połączy się z serwerem deweloperskim.

---

## Rozwiązywanie problemów

### Problem: "Unable to resolve module"

**Rozwiązanie:** Upewnij się, że uruchomiłeś `npm install` i `npx expo prebuild`

### Problem: Aplikacja nie łączy się z development serverem

**Rozwiązanie:**

- Sprawdź czy telefon i komputer są w tej samej sieci WiFi
- Lub użyj tunelu: `npm start -- --tunnel`

### Problem: Błędy związane z LiveKit/WebRTC

**Rozwiązanie:**

- Upewnij się, że używasz development build (nie Expo Go)
- Sprawdź czy `npx expo prebuild` zakończył się sukcesem
- Sprawdź czy zmienne środowiskowe są poprawnie ustawione

### Problem: iOS - "Unable to install app"

**Rozwiązanie:**

- Sprawdź czy masz zainstalowany Xcode
- Sprawdź czy telefon jest zaufany w Xcode (Window → Devices and Simulators)
- Może być potrzebne podpisanie aplikacji w Xcode

### Problem: "No devices found" (iOS)

**Rozwiązanie:**

1. Sprawdź czy telefon jest podłączony przez USB
2. Otwórz Xcode → Window → Devices and Simulators
3. Sprawdź czy telefon jest widoczny i zaufany
4. Na telefonie: Ustawienia → Ogólne → VPN i zarządzanie urządzeniem → Zaufaj komputerowi

### Problem: "Unable to boot simulator"

**Rozwiązanie:**

1. Otwórz Xcode
2. Xcode → Settings → Platforms
3. Pobierz iOS Simulator (jeśli brakuje)
4. Lub uruchom ręcznie: Xcode → Open Developer Tool → Simulator

### Problem: WebRTC nie działa w symulatorze

**Rozwiązanie:**

- To normalne - WebRTC wymaga fizycznego urządzenia
- Symulator iOS nie ma dostępu do mikrofonu
- Użyj prawdziwego telefonu do testowania LiveKit

### Problem: Sandbox error - "deny(1) file-write-create" w DerivedData

**Błąd:**

```
error: Sandbox: bash(55370) deny(1) file-write-create /Users/.../DerivedData/.../ip.txt
CommandError: Failed to build iOS project. "xcodebuild" exited with error code 65.
```

**Rozwiązanie:**

1. **Wyczyść DerivedData:**

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

2. **Wyczyść build folder w projekcie:**

```bash
cd ios
rm -rf build
cd ..
```

3. **Zainstaluj ponownie CocoaPods:**

```bash
cd ios
pod deintegrate
pod install
cd ..
```

4. **Spróbuj ponownie:**

```bash
npx expo run:ios --device
```

**Alternatywne rozwiązanie (jeśli powyższe nie działa):**

1. **Otwórz projekt w Xcode:**

```bash
open ios/voxapp.xcworkspace
```

2. **W Xcode:**
   - Product → Clean Build Folder (Shift + Cmd + K)
   - File → Close Workspace
   - Zamknij Xcode

3. **Uruchom ponownie:**

```bash
npx expo run:ios --device
```

**Rozwiązanie zastosowane:**

Wyłączyłem sandboxing skryptów dla konfiguracji Debug w projekcie. To pozwala skryptom build phase działać podczas development build.

**Jeśli problem nadal występuje:**

1. **Wyczyść i spróbuj ponownie:**

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
cd ios
rm -rf build
pod install
cd ..
npx expo run:ios --device
```

2. **Alternatywnie - użyj prebuild --clean:**

```bash
npx expo prebuild --clean
cd ios
pod install
cd ..
npx expo run:ios --device
```

3. **Lub użyj EAS Build zamiast lokalnego builda:**

```bash
# To omija problem z sandboxem
eas build --platform ios --profile development --local
```

**Uwaga:** Sandboxing jest wyłączony tylko dla Debug build (development). Release build nadal ma włączony sandboxing dla bezpieczeństwa.

---

## Szybki start (TL;DR)

```bash
# 1. Zainstaluj zależności
npm install

# 2. Utwórz .env z konfiguracją
echo "EXPO_PUBLIC_LIVEKIT_URL=wss://twoj-projekt.livekit.cloud" > .env
echo "EXPO_PUBLIC_BACKEND_URL=https://twoj-backend.netlify.app/.netlify/functions" >> .env

# 3. Wygeneruj natywny kod
npx expo prebuild

# 4. Uruchom aplikację
# Telefon iOS:
npx expo run:ios --device

# Symulator iOS (MacBook):
npx expo run:ios

# Telefon Android:
npx expo run:android

# 5. W osobnym terminalu uruchom dev server
npm start
```

---

## Testowanie LiveKit

Po uruchomieniu aplikacji:

1. **Przewodnik:**
   - Wybierz "Przewodnik"
   - Zobaczysz wygenerowany kod pokoju
   - Udziel uprawnień mikrofonu
   - Kliknij "Mów" aby rozpocząć streaming

2. **Słuchacz:**
   - Na innym telefonie wybierz "Słuchacz"
   - Wpisz kod pokoju z telefonu przewodnika
   - Kliknij "Wejdź"
   - Powinieneś słyszeć audio od przewodnika

---

## Uwagi

- **WebRTC działa najlepiej na fizycznych urządzeniach** - symulatory/emulatory mogą mieć problemy
- **Upewnij się, że backend jest wdrożony** i zwraca prawidłowe tokeny
- **Sprawdź czy LiveKit server jest dostępny** (WebSocket URL)
- **Mikrofon wymaga uprawnień** - aplikacja poprosi o nie automatycznie
