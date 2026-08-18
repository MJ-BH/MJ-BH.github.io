import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class HybridWebViewBridgeScreen extends StatefulWidget {
  final String targetUrl;
  final String userJwtToken;

  const HybridWebViewBridgeScreen({
    Key? key,
    required this.targetUrl,
    required this.userJwtToken,
  }) : super(key: key);

  @override
  State<HybridWebViewBridgeScreen> createState() => _HybridWebViewBridgeScreenState();
}

class _HybridWebViewBridgeScreenState extends State<HybridWebViewBridgeScreen> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'AppNativeBridge',
        onMessageReceived: (JavaScriptMessage message) {
          final payload = jsonDecode(message.message);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Native Received JS Message: ${payload["action"]}')),
          );
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (NavigationRequest request) {
            if (request.url.contains('/payment-success')) {
              Navigator.pop(context, true);
              return NavigationDecision.prevent;
            }
            return NavigationDecision.navigate;
          },
        ),
      );

    _controller.loadRequest(
      Uri.parse(widget.targetUrl),
      headers: {
        'Authorization': 'Bearer ${widget.userJwtToken}',
        'X-Client-Platform': 'Flutter-Hybrid-Bridge',
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hybrid WebView Bridge')),
      body: WebViewWidget(controller: _controller),
    );
  }
}
