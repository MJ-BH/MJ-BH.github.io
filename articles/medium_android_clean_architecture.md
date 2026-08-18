# How to Architect Enterprise Android Apps: Jetpack Compose, Koin DI, Ktor & Product Flavors

## A complete step-by-step Kotlin engineering guide to building crash-resilient, white-label Android apps with StateFlow and Clean Architecture.

**By Mouhamed Jihed BENHASSEN**  
*Senior Full-Stack & Mobile Developer*  
*GitHub Blueprint:* [https://github.com/MJ-BH/android-basic-clean-architecture](https://github.com/MJ-BH/android-basic-clean-architecture)

---

> **Medium Recommended Tags:** `Android` | `Kotlin` | `Jetpack Compose` | `Clean Architecture` | `Software Architecture`

---

![Android Cover Banner](https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1200&auto=format&fit=crop)  
*Photo: Building scalable, modern Android applications with Jetpack Compose and Clean Architecture.*

---

## Introduction: Modernizing Enterprise Android Development

Modern Android app development has evolved beyond XML layouts, legacy AsyncTask/LiveData components, and monolithic `app/` packages. Building applications that scale to millions of users or power multi-tenant white-label ecosystems requires strict separation between UI rendering and business logic.

To solve this, we created **[android-basic-clean-architecture](https://github.com/MJ-BH/android-basic-clean-architecture)**, an open-source Kotlin blueprint combining:
1. **Domain & Layer Isolation:** Pure Kotlin models, repository contracts, and zero Android SDK dependencies in domain modules.
2. **Result Container Error Handling (`Result<T, E>`):** Safe, functional error propagation eliminating unhandled UI main-thread crashes.
3. **Koin Dependency Injection (`4.0.0`):** Pure Kotlin DSL injection without annotation processing (kapt/ksp) build overhead.
4. **Gradle Product Flavors White-Label Strategy:** Single codebase powering multi-client deployments (`clientA`, `clientB`).

---

## 1. Modular Clean Architecture Layer Isolation

```
android-basic-clean-architecture/
├── AGENTS.md                   # Non-negotiable Android development rules
└── app/src/main/java/com/android/basiccleanarchitecture/
    ├── core/result/            # Result<T, E> sealed interface
    ├── data/
    │   ├── api/                # FakeExplorerApi (Ktor simulation)
    │   ├── dto/                # FileItemDto serialization
    │   ├── mapper/             # FileItemMapper (DTO-to-Domain)
    │   └── repository/         # ExplorerRepositoryImpl implementation
    ├── di/                     # AppModule.kt (Koin DI)
    ├── domain/
    │   ├── model/              # FileItem & FileItemType pure Kotlin models
    │   └── repository/         # ExplorerRepository interface
    └── ui/
        ├── explorer/           # ExplorerViewModel & Compose Screen
        └── state/              # UiState<T> sealed interface
```

---

## 2. Core Infrastructure & Result Pattern (`Result<T, E>`)

Instead of throwing uncaught exceptions up to the UI main thread, asynchronous operations return a sealed `Result` interface:

```kotlin
sealed interface Result<out T, out E : Throwable> {
    data class Success<out T>(val data: T) : Result<T, Nothing>
    data class Failure<out E : Throwable>(val error: E) : Result<Nothing, E>

    inline fun <R> fold(
        onSuccess: (T) -> R,
        onFailure: (E) -> R
    ): R = when (this) {
        is Success -> onSuccess(data)
        is Failure -> onFailure(error)
    }
}
```

---

## 3. How to Add a Feature (5-Step Android Clean Architecture Flow)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DTO & API Layer (data/dto/ & data/api/)                  │
│    FileItemDto & FakeExplorerApi returning Result<T, E>     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Mapper Layer (data/mapper/)                              │
│    FileItemMapper converting DTOs to Pure Domain Models      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. Repository Layer (domain/repository/ & data/repository/) │
│    ExplorerRepository interface & ExplorerRepositoryImpl    │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 4. ViewModel Layer (ui/feature/)                            │
│    ExplorerViewModel managing StateFlow<UiState<T>>        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 5. Jetpack Compose UI (ui/feature/)                         │
│    Composable screen reacting to UiState                    │
└─────────────────────────────────────────────────────────────┘
```

### Step 1: DTO & API Layer
```kotlin
@Serializable
data class NewFeatureDto(val id: String, val title: String)
```

### Step 2: DTO-to-Domain Mapper
```kotlin
class NewFeatureMapper {
    fun mapToDomain(dto: NewFeatureDto): NewFeatureEntity {
        return NewFeatureEntity(id = dto.id, title = dto.title)
    }
}
```

### Step 3: Repository Implementation
```kotlin
class NewFeatureRepositoryImpl(
    private val api: FakeExplorerApi,
    private val mapper: NewFeatureMapper
) : NewFeatureRepository {
    override suspend fun getFeatureData(): Result<List<NewFeatureEntity>, Throwable> {
        return withContext(Dispatchers.IO) {
            when (val result = api.fetchFeatureData()) {
                is Result.Success -> Result.Success(result.data.map { mapper.mapToDomain(it) })
                is Result.Failure -> Result.Failure(result.error)
            }
        }
    }
}
```

### Step 4: ViewModel Layer (`StateFlow<UiState<T>>`)
```kotlin
class NewFeatureViewModel(
    private val repository: NewFeatureRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState<List<NewFeatureEntity>>>(UiState.Loading)
    val uiState: StateFlow<UiState<List<NewFeatureEntity>>> = _uiState.asStateFlow()

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            repository.getFeatureData().fold(
                onSuccess = { items ->
                    _uiState.value = if (items.isEmpty()) UiState.Empty else UiState.Success(items)
                },
                onFailure = { error ->
                    _uiState.value = UiState.Error(error.message ?: "Failed to load data")
                }
            )
        }
    }
}
```

### Step 5: Koin DI Registration
```kotlin
val appModule = module {
    single { NewFeatureMapper() }
    single<NewFeatureRepository> { NewFeatureRepositoryImpl(get(), get()) }
    viewModel { NewFeatureViewModel(get()) }
}
```

---

## 4. Gradle Product Flavors & White-Label Strategy

Deploying Client A (`Alpha Brand`) vs Client B (`Beta Brand`) using Gradle product flavors in `app/build.gradle.kts`:

```kotlin
android {
    flavorDimensions += "brand"
    productFlavors {
        create("clientA") {
            dimension = "brand"
            applicationId = "com.android.clienta"
            resValue("string", "app_name", "Alpha Brand (Client A)")
            buildConfigField("String", "BASE_URL", "\"https://api.alpha-brand.com/v1\"")
        }
        create("clientB") {
            dimension = "brand"
            applicationId = "com.android.clientb"
            resValue("string", "app_name", "Beta Brand (Client B)")
            buildConfigField("String", "BASE_URL", "\"https://api.beta-brand.fr/v1\"")
        }
    }
}
```

Build commands:
```bash
./gradlew assembleClientADebug
./gradlew assembleClientBDebug
```

---

## Conclusion

By adopting Kotlin Clean Architecture, safe **Result Pattern** error handling, lightweight **Koin DI**, and **Gradle Product Flavors**, you eliminate monolithic code debt and build production-ready Android apps for enterprise scale.

### 🌟 Try it out on GitHub:
Check out the complete working implementation on GitHub:  
👉 **[github.com/MJ-BH/android-basic-clean-architecture](https://github.com/MJ-BH/android-basic-clean-architecture)**
