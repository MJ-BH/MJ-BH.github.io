# Production-Grade Hybrid Flutter Apps: Bi-directional JavaScript Bridges, Session Sharing & Cookie Interception

**Author:** Mouhamed Jihed BENHASSEN (*Senior Full-Stack & Mobile Developer*)  
**Topics:** `Flutter` `WebView` `Hybrid Mobile` `OAuth2` `JavaScript Interop` `Security`

---

## Why Hybrid WebViews Are Critical in Travel & Enterprise Apps

In complex ecosystems like travel, booking engines, or telecom super-apps, certain legacy web modules (e.g. 3D-Secure payment portals, complex hotel reservation engines, or dynamic terms & agreements) are best rendered using web technologies while keeping core navigation and native features inside Flutter.

Building a **production-grade hybrid experience** requires solving:
1. **Single Sign-On (SSO):** Passing JWT/OAuth2 bearer tokens securely from Flutter to WebView cookies/headers.
2. **Bi-directional Bridge:** Calling Flutter native methods from JavaScript and calling JavaScript functions from Flutter.
3. **URL Interception & Navigation Controls:** Intercepting deep links, file downloads (PDF vouchers), and camera/location permission requests.

---

## 1. Injecting OAuth2 Bearer Tokens & Managing Cookie Persistence

Never require users to log in twice. Inject session cookies and auth headers into the `WebViewController`.

```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';

class HybridWebViewScreen extends StatefulWidget {
  final String targetUrl;
  final String userJwtToken;

  const HybridWebViewScreen({
    Key? key,
    required this.targetUrl,
    required this.userJwtToken,
  }) : super(key: key);

  @override
  State<HybridWebViewScreen> createState() => _HybridWebViewScreenState();
}

class _HybridWebViewScreenState extends State<HybridWebViewScreen> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.startsWith('https://example.com/payment-success')) {
              // Intercept Payment Completion
              Navigator.pop(context, true);
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      );

    // Inject Bearer Header and Cookie
    _controller.loadRequest(
      Uri.parse(widget.targetUrl),
      headers: {
        'Authorization': 'Bearer ${widget.userJwtToken}',
        'X-Client-Platform': 'Flutter-Hybrid-Mobile',
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Travel Booking')),
      body: WebViewWidget(controller: _controller),
    );
  }
}
```

---

## 2. Setting Up Bi-directional JavaScript Communication Channels

Enable in-app web pages to communicate back to native Flutter (e.g. triggering native device vibration, camera scan, or native push alerts).

### Flutter Native Listener (`addJavaScriptChannel`)
```dart
_controller.addJavaScriptChannel(
  'AppNativeBridge',
  onMessageReceived: (JavaScriptMessage message) {
    final payload = jsonDecode(message.message);
    switch (payload['action']) {
      case 'OPEN_CAMERA_SCANNER':
        _triggerNativeCameraScan();
        break;
      case 'SHARE_VOUCHER':
        _shareVoucherNative(payload['voucherUrl']);
        break;
      default:
        debugPrint('Unknown bridge message: ${message.message}');
    }
  },
);
```

### In-App Web Application JavaScript Snippet
```javascript
// Web App JS calling Native Flutter Bridge
function requestNativeCamera() {
  if (window.AppNativeBridge) {
    window.AppNativeBridge.postMessage(JSON.stringify({
      action: 'OPEN_CAMERA_SCANNER',
      timestamp: Date.now()
    }));
  } else {
    console.warn("Native Flutter Bridge not available");
  }
}
```

---

## Key Security Guidelines for Hybrid Flutter Apps

1. **Strict Origin Validation:** Always check domain origins before handling incoming JavaScript messages.
2. **Never Expose Raw DB Credentials:** Only pass short-lived JWT tokens or dynamic session keys across WebViews.
3. **Prevent Web Clickjacking:** Disable arbitrary external URL loading inside the primary WebView frame.
