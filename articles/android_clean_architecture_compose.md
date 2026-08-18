# Architecting Enterprise Android Applications with Jetpack Compose, Koin DI, Ktor & Product Flavors

**Author:** Mouhamed Jihed BENHASSEN (*Senior Full-Stack & Mobile Developer*)  
**Repository:** [https://github.com/MJ-BH/android-basic-clean-architecture](https://github.com/MJ-BH/android-basic-clean-architecture) (Public Open-Source)  
**Topics:** `Android` `Kotlin` `Jetpack Compose` `Koin` `Ktor` `Clean Architecture` `Product Flavors`

---

## Executive Summary

Modern Android application development has evolved beyond XML layouts, legacy AsyncTask/LiveData components, and monolithic `app/` modules. Building applications that scale to millions of users or power multi-tenant white-label ecosystems requires strict separation between UI rendering and business logic.

The **[android-basic-clean-architecture](https://github.com/MJ-BH/android-basic-clean-architecture)** repository establishes an enterprise-grade Kotlin blueprint combining:
1. **Clean Architecture Modularization (`:core:domain`, `:core:data`, `:core:ui`, `:app`):** Isolating domain models, network clients, DTO mappers, and Compose UI components.
2. **Result Container Error Handling (`Result<T, E>`):** Explicit `Result.Success` and `Result.Failure` containers for zero-crash exception handling.
3. **Koin Lightweight Dependency Injection (`4.0.0`):** Pure Kotlin DSL injection without annotation processing (kapt/ksp) build overhead.
4. **Gradle Product Flavors White-Label Strategy:** Single codebase powering multi-client deployments (`clientA`, `clientB`).

---

## 1. Modular Clean Architecture Layer Isolation

```
android-basic-clean-architecture/
├── AGENTS.md                   # Non-negotiable Android development rules
├── README.md                   # Technical documentation & guide
└── app/src/main/java/com/android/basiccleanarchitecture/
    ├── core/
    │   └── result/             # Result<T, E> sealed interface & fold extension
    ├── data/
    │   ├── api/                # FakeExplorerApi (Ktor Network Client simulation)
    │   ├── dto/                # FileItemDto data transfer objects
    │   ├── mapper/             # FileItemMapper (DTO-to-Domain mapping)
    │   └── repository/         # ExplorerRepositoryImpl implementation
    ├── di/                     # AppModule (Koin DI module definitions)
    ├── domain/
    │   ├── model/              # FileItem & FileItemType pure Kotlin domain models
    │   └── repository/         # ExplorerRepository domain interface
    └── ui/
        ├── explorer/           # ExplorerViewModel & Compose UI screens
        └── state/              # UiState<T> sealed interface (Loading, Success, Error, Empty)
```

---

## 2. Core Infrastructure & Result Pattern (`Result<T, E>`)

Instead of letting network exceptions bubble up to the main thread, asynchronous operations return a sealed `Result` interface:

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

## 3. Step-by-Step Feature Implementation Guide (5-Step Android Clean Architecture Flow)

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

### Step 1: Define DTO & API Layer (`data/dto/NewFeatureDto.kt`)
```kotlin
@Serializable
data class NewFeatureDto(val id: String, val title: String)
```

### Step 2: DTO-to-Domain Mapper (`data/mapper/NewFeatureMapper.kt`)
```kotlin
class NewFeatureMapper {
    fun mapToDomain(dto: NewFeatureDto): NewFeatureEntity {
        return NewFeatureEntity(id = dto.id, title = dto.title)
    }
}
```

### Step 3: Repository Interface & Implementation (`data/repository/`)
```kotlin
interface NewFeatureRepository {
    suspend fun getFeatureData(): Result<List<NewFeatureEntity>, Throwable>
}

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

### Step 4: ViewModel Layer (`ui/feature/NewFeatureViewModel.kt`)
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

### Step 5: Register DI Module in Koin (`di/AppModule.kt`)
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

## Conclusion & Public GitHub Access

This Kotlin Clean Architecture blueprint provides a robust baseline for high-scale Android apps.

* **Public GitHub Repository:** [https://github.com/MJ-BH/android-basic-clean-architecture](https://github.com/MJ-BH/android-basic-clean-architecture)
