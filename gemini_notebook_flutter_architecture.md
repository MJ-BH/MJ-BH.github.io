# Gemini Notebook Source: Enterprise Flutter Clean Architecture & Monorepo Blueprint

> **Document Type:** Comprehensive Knowledge Base Source for Gemini Notebook / NotebookLM  
> **Author:** Mouhamed Jihed BENHASSEN (*Senior Full-Stack & Mobile Developer*)  
> **GitHub Repository:** [https://github.com/MJ-BH/blueprint-project-flutter](https://github.com/MJ-BH/blueprint-project-flutter)  
> **Architectural Standard:** Inspired by Very Good Ventures (VGV) Flutter Architecture

---

## 1. Overview & Core Philosophy

This source document details the software engineering principles, architectural patterns, monorepo directory layouts, error-handling conventions, and dependency injection strategies used in the **`blueprint-project-flutter`** repository.

### Key Philosophy Statement
*"Build once. Configure intelligently. Enforce strict contracts. Own it through production."*

The architecture is designed to support:
1. **High-Scale Applications:** Applications serving 1M+ active users with reactive BLoC state streams and zero UI freezing.
2. **White-Label Ecosystems:** Multi-tenant codebases where 100% of data, core, and design logic is shared across distinct client entry points (`main_client_a.dart`, `main_client_b.dart`).
3. **Resilient Failure Handling:** Zero crash policy via immutable `Result<S, E>` error states and background auth token refresh loops.

---

## 2. Directory & Package Structure (VGV Monorepo Layout)

```
blueprint-project-flutter/
├── RULES.md                    # Strict architectural governance rules
├── packages/                   # Standalone local packages
│   ├── core/                   # Shared framework infrastructure
│   │   ├── lib/src/errors/     # ServerFailure, NetworkFailure, AuthFailure
│   │   ├── lib/src/logging/    # Logger & LogOptions system
│   │   ├── lib/src/mappers/    # BaseMapper<Entity, Dto> interface
│   │   ├── lib/src/network/    # BaseApiService & ApiConfig
│   │   ├── lib/src/repository/ # BaseRepository wrapper
│   │   └── lib/src/result/     # Result<S, E> pattern
│   ├── app_ui/                 # Design system tokens, theme extensions, dynamic components
│   └── explorer_repository/   # Feature data repository & Fake API client
├── lib/
│   ├── main.dart               # Generic Demo App entry point
│   ├── main_client_a.dart      # Client A Target entry point (Alpha Brand)
│   ├── main_client_b.dart      # Client B Target entry point (Beta Brand)
│   ├── core/                   # App-level routing (AppRouter), context extensions, AppBlocObserver
│   └── features/
│       └── explorer/           # Presentation feature module
│           ├── bloc/           # ExplorerBloc & ExplorerState
│           └── ui/             # ExplorerPage & ExplorerView
└── test/                       # Unit & Widget tests
```

---

## 3. Detailed Component Reference

### A. Shared Core Package (`packages/core`)

#### 1. Result Pattern (`Result<S, E extends Exception>`)
* **Purpose:** Provides explicit, type-safe return types for repository and API calls instead of throwing unhandled runtime exceptions.
* **API:**
  ```dart
  final result = await repository.getItems(folderId: id);
  result.fold(
    (successData) => emit(ExplorerLoaded(items: successData)),
    (failureError) => emit(ExplorerError(failureError.toString())),
  );
  ```

#### 2. Base API Service (`BaseApiService`)
* **Purpose:** Wraps network HTTP/Dio executions, handles log tagging, and converts raw JSON responses into typed Result containers.
* **API:**
  ```dart
  class FakeExplorerApi extends BaseApiService {
    FakeExplorerApi() : super(null);

    Future<Result<List<Map<String, dynamic>>, Exception>> fetchItems({String? folderId}) async {
      return handleResponse(
        apiCall: () async => _mockDatabase.where((i) => i['parentId'] == folderId).toList(),
        onSuccess: (data) => Result.success(data),
        logTag: 'FakeExplorerApi.fetchItems',
      );
    }
  }
  ```

#### 3. Base Repository (`BaseRepository`)
* **Purpose:** Serves as the central logging and transaction handling boundary between domain use cases and remote/local data sources.

#### 4. Base Mapper (`BaseMapper<Entity, Dto>`)
* **Purpose:** Guarantees deterministic bi-directional mapping between network JSON Data Transfer Objects (DTOs) and Domain Entities (`mapToEntity`, `mapToDto`, `mapToEntityList`).

#### 5. Logging System (`Logger` & `LogOptions`)
* **Purpose:** Provides structured logging with levels (`debug`, `info`, `warning`, `error`), timestamp formatting, emoji tags, and configurable release mode output.

---

### B. App-Level Core (`lib/core`)

#### 1. App Navigation Router (`AppRouter`)
* Centralized route table in `lib/core/routing/app_router.dart` (`AppRoutes.home`, `AppRoutes.explorer`) using `onGenerateRoute`.

#### 2. Context Extensions (`ContextExtensions`)
* Helper extensions on `BuildContext` for theme shortcuts (`context.theme`, `context.colorScheme`), screen width/height, and floating snackbars (`context.showSnackBar()`).

#### 3. Global BLoC Observer (`AppBlocObserver`)
* Attached in `main.dart` via `Bloc.observer = AppBlocObserver()`. Automatically prints state change transitions (`currentState ➡️ nextState`) and logs uncaught exceptions.

---

### C. Dependency Injection Strategy (Global vs. Scoped)

* **Global Root Injection (`main.dart`):** Used only for global singletons (e.g. Authentication State, Global Logger, App Configuration).
* **Scoped On-Demand Injection (`Page` / `View` Boundary):** Repositories and Blocs are injected at the feature page entrypoint (`ExplorerPage` wrapping `ExplorerView`).
* **Memory Lifecycle:** When the page route is closed, the Cubit/BLoC and repository instances are automatically collected by Garbage Collection.

---

### D. Multi-Flavor White-Label Strategy

* **Concept:** Single core codebase in `packages/` powering multiple client targets in `lib/`.
* **Entry Points:** `lib/main_client_a.dart` (Client A / Brand Alpha) and `lib/main_client_b.dart` (Client B / Brand Beta).
* **Execution Commands:**
  ```bash
  flutter run -t lib/main_client_a.dart --flavor clientA
  flutter run -t lib/main_client_b.dart --flavor clientB
  ```

---

## 4. Key Questions & Answers for Gemini Notebook

**Q: How does this architecture prevent unhandled app crashes during network errors?**  
*A: Every API call is wrapped inside `BaseApiService.handleResponse` and returned as a `Result<S, E>`. Repositories and BLoCs consume results via `.fold()`, ensuring that network failures map explicitly to an `ExplorerError` UI state rather than triggering unhandled runtime exceptions.*

**Q: What is the benefit of extracting `packages/core` and `packages/app_ui` into separate directories?**  
*A: Physical package isolation ensures that presentation widgets inside `lib/` cannot bypass domain rules or access raw database drivers. It also enables 100% code reuse across white-label client apps (`main_client_a.dart` and `main_client_b.dart`).*

**Q: Where should dependency injection occur in this architecture?**  
*A: Dependencies are injected at the feature page boundary (`ExplorerPage` wrapping `ExplorerView` with `RepositoryProvider` and `BlocProvider`). This ensures scoped, on-demand memory allocation and automatic disposal upon route popping.*
