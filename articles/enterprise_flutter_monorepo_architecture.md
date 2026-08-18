# Architecting Enterprise Monorepo Flutter Applications: VGV Package Strategy, Result Pattern & Scoped Dependency Injection

**Author:** Mouhamed Jihed BENHASSEN (*Senior Full-Stack & Mobile Developer*)  
**Repository:** [https://github.com/MJ-BH/blueprint-project-flutter](https://github.com/MJ-BH/blueprint-project-flutter)  
**Topics:** `Flutter` `Dart` `Clean Architecture` `Very Good Ventures` `BLoC` `Monorepo` `Result Pattern`

---

## Executive Summary

When developing large-scale mobile applications serving millions of active users or managing multi-tenant white-label ecosystems, software teams often struggle with code duplication, monolithic `lib/` directory bloat, unhandled runtime crashes, and rigid dependency wiring.

The **Blueprint Project Flutter** repository establishes an enterprise-grade architectural blueprint. Inspired by the **Very Good Ventures (VGV) Flutter Architecture**, it combines:
1. **Independent Monorepo Packages (`packages/`):** Isolating core framework utilities, design systems, and feature repositories.
2. **Result Pattern & Base Infrastructure (`packages/core`):** Safe, predictable data flow (`Result<S, E>`), central logging (`Logger`), base APIs (`BaseApiService`), and base repositories (`BaseRepository`).
3. **Scoped Contextual Dependency Injection:** Injecting dependencies on-demand at feature `Page`/`View` boundaries rather than clogging the global root `main.dart`.
4. **Multi-Entrypoint White-Label Support:** Deploying distinct brand targets (`main_client_a.dart`, `main_client_b.dart`) from a single codebase.

---

## 1. Monorepo Package Isolation (The VGV Package Strategy)

Rather than keeping all data logic, network clients, models, and UI widgets inside `lib/`, the application extracts shared capabilities into independent local Dart packages inside `packages/`:

```
blueprint-project-flutter/
├── RULES.md                    # Strict architectural governance rules
├── packages/                   # Standalone local packages
│   ├── core/                   # Shared framework infrastructure
│   ├── app_ui/                 # Design system tokens, theme extensions, dynamic UI components
│   └── explorer_repository/   # Feature repository & Fake API client
├── lib/
│   ├── main.dart               # Generic Demo App entry point
│   ├── main_client_a.dart      # Client A Target entry point
│   ├── main_client_b.dart      # Client B Target entry point
│   ├── core/                   # App-level routing (AppRouter) & context extensions
│   └── features/
│       └── explorer/           # Presentation feature module
```

---

## 2. Core Infrastructure & Result Pattern (`packages/core`)

### Predictable Error Propagation (`Result<S, E>`)
Exceptions are caught at network/repository boundaries and returned as immutable `Result` values:

```dart
abstract class Result<S, E extends Exception> extends Equatable {
  const Result();
  static Result<S, E> success<S, E extends Exception>(S data) => Success(data);
  static Result<S, E> failure<S, E extends Exception>(E error) => FailureResult(error);

  T fold<T>(T Function(S success) onSuccess, T Function(E failure) onFailure) {
    if (this is Success<S, E>) return onSuccess((this as Success<S, E>).data);
    if (this is FailureResult<S, E>) return onFailure((this as FailureResult<S, E>).error);
    throw Exception('Unhandled Result state');
  }
}
```

### Deterministic DTO-to-Entity Mapping (`BaseMapper`)
```dart
abstract class BaseMapper<Entity, Dto> {
  const BaseMapper();
  Entity mapToEntity(Dto dto);
  Dto mapToDto(Entity entity);
  List<Entity> mapToEntityList(List<Dto> dtos) => dtos.map(mapToEntity).toList();
}
```

---

## 3. Step-by-Step Feature Implementation Guide (6-Step Walkthrough)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. API Layer (packages/feature_repository/lib/src/api/)    │
│    Extends BaseApiService & returns Result<Data, Exception> │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Mapper Layer (packages/feature_repository/lib/src/mappers)│
│    Extends BaseMapper<Entity, Dto>                          │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. Repository Layer (packages/feature_repository/lib/src/)  │
│    Extends BaseRepository & maps DTOs to Domain Entities   │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 4. BLoC Layer (lib/features/feature/bloc/)                  │
│    Emits Loading, Loaded, Error using result.fold()         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 5. UI Layer & Scoped DI (lib/features/feature/ui/)          │
│    FeaturePage wraps RepositoryProvider & BlocProvider      │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: API Layer Implementation (`BaseApiService`)
Create `packages/new_feature_repository/lib/src/api/new_feature_api.dart`:
```dart
class NewFeatureApi extends BaseApiService {
  NewFeatureApi({dynamic client}) : super(client);

  Future<Result<List<Map<String, dynamic>>, Exception>> fetchFeatureData() async {
    return handleResponse(
      apiCall: () async {
        final response = await client.get('/api/v1/new-feature');
        return Result.success<List<Map<String, dynamic>>, Exception>(response.data);
      },
      onSuccess: (result) => result as Result<List<Map<String, dynamic>>, Exception>,
      logTag: 'NewFeatureApi.fetchFeatureData',
    );
  }
}
```

### Step 2: DTO & Mapper Implementation (`BaseMapper`)
Create `packages/new_feature_repository/lib/src/mappers/feature_mapper.dart`:
```dart
class FeatureMapper extends BaseMapper<FeatureEntity, FeatureDto> {
  const FeatureMapper();
  @override
  FeatureEntity mapToEntity(FeatureDto dto) => FeatureEntity(id: dto.id, title: dto.title);
  @override
  FeatureDto mapToDto(FeatureEntity entity) => FeatureDto(id: entity.id, title: entity.title);
}
```

### Step 3: Repository Layer Implementation (`BaseRepository`)
Create `packages/new_feature_repository/lib/src/new_feature_repository.dart`:
```dart
class NewFeatureRepositoryImpl extends BaseRepository implements NewFeatureRepository {
  final NewFeatureApi _api;
  final FeatureMapper _mapper;

  NewFeatureRepositoryImpl({NewFeatureApi? api, FeatureMapper? mapper})
      : _api = api ?? NewFeatureApi(),
        _mapper = mapper ?? const FeatureMapper();

  @override
  Future<Result<List<FeatureEntity>, Exception>> getFeatureData() async {
    return handleRepositoryCall(
      call: () async {
        final result = await _api.fetchFeatureData();
        return result.fold(
          (jsonList) {
            final dtos = jsonList.map((j) => FeatureDto.fromJson(j)).toList();
            return Result.success(_mapper.mapToEntityList(dtos));
          },
          (failure) => Result.failure(failure),
        );
      },
      logTag: 'NewFeatureRepositoryImpl.getFeatureData',
    );
  }
}
```

### Step 4: BLoC / Cubit Layer Implementation (`flutter_bloc`)
Create `lib/features/new_feature/bloc/new_feature_cubit.dart`:
```dart
class NewFeatureCubit extends Cubit<NewFeatureState> {
  final NewFeatureRepository repository;
  NewFeatureCubit({required this.repository}) : super(NewFeatureInitial());

  Future<void> loadData() async {
    emit(NewFeatureLoading());
    final result = await repository.getFeatureData();
    result.fold(
      (entities) => emit(NewFeatureLoaded(entities)),
      (failure) => emit(NewFeatureError(failure.toString())),
    );
  }
}
```

### Step 5: UI Layer & Scoped On-Demand DI Implementation
Create `lib/features/new_feature/ui/new_feature_page.dart`:
```dart
class NewFeaturePage extends StatelessWidget {
  const NewFeaturePage({super.key});

  @override
  Widget build(BuildContext context) {
    return RepositoryProvider<NewFeatureRepository>(
      create: (context) => NewFeatureRepositoryImpl(),
      child: BlocProvider<NewFeatureCubit>(
        create: (context) => NewFeatureCubit(
          repository: context.read<NewFeatureRepository>(),
        )..loadData(),
        child: const NewFeatureView(),
      ),
    );
  }
}
```

### Step 6: Route Registration in AppRouter
```dart
class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.newFeature:
        return MaterialPageRoute(builder: (_) => const NewFeaturePage());
      default:
        return MaterialPageRoute(builder: (_) => const Scaffold());
    }
  }
}
```

---

## 4. Multi-Flavor White-Label Strategy

Deploying Client A (`Alpha Brand`) vs Client B (`Beta Brand`) using dedicated entry points in `lib/`:

```dart
// lib/main_client_a.dart
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  Bloc.observer = AppBlocObserver();

  final config = AppConfig(
    brandName: 'Alpha Brand (Client A)',
    apiBaseUrl: 'https://api.alpha-brand.com/v1',
    primaryColor: const Color(0xFF1E3A8A),
    enableMobilityModule: true,
  );

  runApp(ClientApp(config: config));
}
```

---

## Conclusion & Repository Access

By combining VGV package isolation, Result pattern error handling, BLoC state management, and scoped dependency injection, this architecture delivers a resilient, clean, and highly scalable Flutter codebase.

* **Open-Source Repository:** [https://github.com/MJ-BH/blueprint-project-flutter](https://github.com/MJ-BH/blueprint-project-flutter)
