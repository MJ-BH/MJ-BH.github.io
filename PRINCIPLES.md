# Mouhamed Jihed BENHASSEN — Engineering Principles & Core Philosophy

> **"Build once. Configure intelligently. Enforce strict contracts. Own it through production."**  
> *Architectural principles based on the [Very Good Ventures (VGV) Flutter Architecture](https://verygood.ventures/blog/very-good-flutter-architecture/) and enterprise project experiences.*

---

## 🏛️ 1. Architectural Baseline (Very Good Ventures Standards)
* **VGV Monorepo Package Strategy:** Shared infrastructure (`packages/core`), design systems (`packages/app_ui`), and repositories (`packages/*_repository`) reside in independent local packages under `packages/`.
* **Explicit Rules & Governance:** Every repository contains a non-negotiable `RULES.md` or `AGENTS.md` governing state management, UI isolation, and git workflows.
* **UI Isolation:** UI views (Flutter Widgets / Jetpack Compose) must **NEVER** directly invoke network APIs, Dio/Ktor clients, or external SDKs. All data flows exclusively through Repositories and ViewModels / BLoC / Cubits.

---

## 📦 2. Monorepo Modularization & Clean Architecture
* **Strict Layering:**
  ```
  Domain (Pure Entities, Use Cases, Repository Interfaces)
    ▲
  Data (DTOs, Mappers, Ktor/Dio Clients, Local Cache)
    ▲
  Presentation (BLoC / Cubit / StateFlow ViewModels, Sealed UI States)
  ```
* **Type-Safe Routing:** Navigation paths use type-safe serialization (`@Serializable` / `AppRouter` typed routes).

---

## ⚡ 3. Reactive State Management (Result Pattern & Sealed UI States)
* **Single Source of Truth:** State flows exclusively via `BLoC`/`Cubit` in Flutter or `StateFlow<UiState>` in Kotlin.
* **Result Pattern Error Handling:** Explicit `Result<S, E>` error handling for predictable data flow.

---

## 🛡️ 4. Zero-Crash Resilience & Security
* **Transparent Auth Refresh:** Network interceptors handle 401 Unauthorized responses by automatically refreshing JWT/OAuth2 tokens in the background without dropping user context.
* **Dynamic Configuration:** Zero hardcoded base URLs, API keys, or magic string literals.

---

## 🎨 5. "Premium UI" & Dynamic White-Label Systems
* **Centralized Design System:** All typography, spacing, color palettes, and component variants reside in `packages/app_ui`.
* **Theme Extensions:** Dynamic multi-brand applications utilize `ThemeExtension` to swap brand aesthetics seamlessly without altering business logic.

---

## 🧪 6. Testing & CI/CD Discipline
* **Mandatory Automated Verification:** Every feature PR must include unit tests for Blocs/ViewModels/Repositories and widget/UI tests for critical screens.
