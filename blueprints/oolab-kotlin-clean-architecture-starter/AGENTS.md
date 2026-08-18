# Oolab Kotlin Architecture & Agent Rules

1. **Clean Architecture Separation**:
   - `domain`: Pure Kotlin entities and repository interfaces. No Android dependencies.
   - `data`: Ktor network clients, DTOs, Mappers, and Repository implementations.
   - `ui`: Jetpack Compose views, ViewModels (Koin DI), and Sealed UI states.

2. **Sealed UI State Interface**:
   ```kotlin
   sealed interface UiState<out T> {
       object Loading : UiState<Nothing>
       data class Success<T>(val data: T) : UiState<T>
       data class Error(val message: String) : UiState<Nothing>
       object Empty : UiState<Nothing>
   }
   ```

3. **Dependency Injection**:
   - Use **Koin** (`koinViewModel()`) for ViewModels and Repositories.

4. **Zero Crash Policy**:
   - Gracefully handle HTTP 401, 404, 500, network timeouts, and offline states.
