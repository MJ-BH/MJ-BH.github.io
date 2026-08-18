# Architecting White-Label Flutter Applications: Flavors, Feature Flags, and Dynamic Design Systems

**Author:** Mouhamed Jihed BENHASSEN (*Senior Full-Stack & Mobile Developer*)  
**Topics:** `Flutter` `Dart` `White-Label Architecture` `Build Flavors` `Feature Flags` `Design Systems`

---

## The White-Label Challenge in Enterprise Apps

In rapidly scaling tech ecosystems, building separate codebases for different clients or regional sub-apps creates an unsustainable maintenance burden. The ideal strategy is: **One core codebase → Configurable targets → Multi-brand deployment.**

When building enterprise white-label Flutter applications, you must solve three main challenges:
1. **Dynamic Branding & UI:** Switching colors, typography, assets, strings, and icons at compile-time or runtime without `if (brand == 'A')` clutter.
2. **Target Isolation:** Managing separate Application IDs (`com.brand.app`), `google-services.json`, `Info.plist`, API base URLs, and app store configurations.
3. **Feature Governance:** Toggling features dynamically per tenant or subscription tier using Remote Config or feature flags.

---

## 1. Organizing Flutter Build Flavors

Flutter native flavors leverage Android Gradle Build Variants and iOS Xcode Schemes.

### Android Setup (`android/app/build.gradle`)
```groovy
android {
    ...
    flavorDimensions "brand"
    productFlavors {
        brandAlpha {
            dimension "brand"
            applicationId "com.example.brandalpha"
            resValue "string", "app_name", "Alpha Brand"
        }
        brandBeta {
            dimension "brand"
            applicationId "com.example.brandbeta"
            resValue "string", "app_name", "Beta Brand"
        }
    }
}
```

### Entry Points Isolation
Instead of a single `main.dart`, define dedicated entry points for each flavor target:

```
lib/
├── main_alpha.dart
├── main_beta.dart
└── core/
    ├── config/
    │   └── app_config.dart
    └── theme/
        └── dynamic_theme.dart
```

```dart
// lib/main_alpha.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  final config = AppConfig(
    brandName: 'Alpha Brand',
    apiBaseUrl: 'https://api.alpha-brand.com/v1',
    primaryColor: const Color(0xFF1E3A8A),
    secondaryColor: const Color(0xFF3B82F6),
    enableHospitalityModule: true,
    enableMobilityModule: false,
  );

  runApp(WhiteLabelApp(config: config));
}
```

---

## 2. Configuration-Driven Dynamic Design Systems

Avoid conditional styling inside widgets. Create an immutable `AppConfig` and extend Flutter’s `ThemeData` using `ThemeExtension`.

```dart
class BrandThemeExtension extends ThemeExtension<BrandThemeExtension> {
  final Color badgeBackgroundColor;
  final Color cardBorderColor;
  final String logoAssetPath;

  const BrandThemeExtension({
    required this.badgeBackgroundColor,
    required this.cardBorderColor,
    required this.logoAssetPath,
  });

  @override
  BrandThemeExtension copyWith({
    Color? badgeBackgroundColor,
    Color? cardBorderColor,
    String? logoAssetPath,
  }) {
    return BrandThemeExtension(
      badgeBackgroundColor: badgeBackgroundColor ?? this.badgeBackgroundColor,
      cardBorderColor: cardBorderColor ?? this.cardBorderColor,
      logoAssetPath: logoAssetPath ?? this.logoAssetPath,
    );
  }

  @override
  BrandThemeExtension lerp(ThemeExtension<BrandThemeExtension>? other, double t) {
    if (other is! BrandThemeExtension) return this;
    return BrandThemeExtension(
      badgeBackgroundColor: Color.lerp(badgeBackgroundColor, other.badgeBackgroundColor, t)!,
      cardBorderColor: Color.lerp(cardBorderColor, other.cardBorderColor, t)!,
      logoAssetPath: t < 0.5 ? logoAssetPath : other.logoAssetPath,
    );
  }
}
```

---

## 3. Remote Feature Flags & BLoC Integration

Feature flags allow runtime feature toggling without re-deploying to App Stores.

```dart
abstract class FeatureFlagEvent {}
class FetchFeatureFlags extends FeatureFlagEvent {}

class FeatureFlagState {
  final bool isBookingEnabled;
  final bool isPaymentGatewayActive;
  final bool isWebViewTaxiEnabled;

  const FeatureFlagState({
    required this.isBookingEnabled,
    required this.isPaymentGatewayActive,
    required this.isWebViewTaxiEnabled,
  });
}

class FeatureFlagBloc extends Bloc<FeatureFlagEvent, FeatureFlagState> {
  final RemoteConfigService _remoteConfigService;

  FeatureFlagBloc(this._remoteConfigService)
      : super(const FeatureFlagState(
          isBookingEnabled: true,
          isPaymentGatewayActive: true,
          isWebViewTaxiEnabled: false,
        )) {
    on<FetchFeatureFlags>((event, emit) async {
      final flags = await _remoteConfigService.getLatestFlags();
      emit(FeatureFlagState(
        isBookingEnabled: flags['enable_booking'] ?? true,
        isPaymentGatewayActive: flags['enable_payments'] ?? true,
        isWebViewTaxiEnabled: flags['enable_webview_taxi'] ?? false,
      ));
    });
  }
}
```

---

## Summary Best Practices

1. **Never hardcode brand strings or hex colors in UI widgets.**
2. **Keep asset bundles structured per flavor (`assets/brands/alpha/`, `assets/brands/beta/`).**
3. **Use CI/CD matrix builds (GitLab CI / GitHub Actions) to run parallel flavor builds.**
4. **Enforce strict BLoC separation for feature-flagged flows.**
