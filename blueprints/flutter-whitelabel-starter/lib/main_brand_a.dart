// lib/main_brand_a.dart
import 'package:flutter/material.dart';

class AppConfig {
  final String brandName;
  final Color primaryColor;
  final String apiBaseUrl;
  final bool enableTaxiModule;

  AppConfig({
    required this.brandName,
    required this.primaryColor,
    required this.apiBaseUrl,
    required this.enableTaxiModule,
  });
}

void main() {
  final config = AppConfig(
    brandName: 'Alpha Hotel & Mobility',
    primaryColor: const Color(0xFF1E3A8A),
    apiBaseUrl: 'https://api.alpha-travel.com/v1',
    enableTaxiModule: true,
  );

  runApp(WhiteLabelApp(config: config));
}

class WhiteLabelApp extends StatelessWidget {
  final AppConfig config;

  const WhiteLabelApp({Key? key, required this.config}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: config.brandName,
      theme: ThemeData(
        primaryColor: config.primaryColor,
        useMaterial3: true,
      ),
      home: Scaffold(
        appBar: AppBar(
          title: Text(config.brandName),
          backgroundColor: config.primaryColor,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.flight_takeoff, size: 64, color: Colors.blueAccent),
              const SizedBox(height: 16),
              Text(
                'Welcome to ${config.brandName}',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text('API Endpoint: ${config.apiBaseUrl}'),
              if (config.enableTaxiModule)
                const Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Chip(
                    avatar: Icon(Icons.local_taxi),
                    label: Text('Taxi & Mobility Enabled'),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
