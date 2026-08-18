# Hera Flutter Architecture Rules

These rules are **MANDATORY** for all feature implementations:

1. **Clean Architecture & BLoC/Cubit**:
   - UI views must NEVER access network clients or Firebase directly.
   - Use `flutter_bloc` (`Cubit` or `Bloc`) exclusively for state management.
   - Extracted repositories live in independent packages under `packages/` (e.g. `packages/authentication_repository`, `packages/app_ui`).
   - Inject repositories via `RepositoryProvider` at the root application level.

2. **Automated Testing**:
   - Every Cubit/Bloc and Repository MUST have unit tests in `test/`.
   - Major UI screens MUST have widget tests verifying state renders.

3. **Design System**:
   - UI colors, typography, and buttons MUST be imported from `packages/app_ui`.
