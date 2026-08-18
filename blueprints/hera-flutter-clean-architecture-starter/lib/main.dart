import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:app_ui/app_ui.dart';

abstract class AuthState {}
class AuthInitial extends AuthState {}
class AuthLoading extends AuthState {}
class AuthAuthenticated extends AuthState { final String userId; AuthAuthenticated(this.userId); }

class AuthCubit extends Cubit<AuthState> {
  AuthCubit() : super(AuthInitial());

  void login(String username, String password) async {
    emit(AuthLoading());
    await Future.delayed(const Duration(seconds: 1));
    emit(AuthAuthenticated('usr_12345'));
  }
}

void main() {
  runApp(
    BlocProvider(
      create: (_) => AuthCubit(),
      child: const HeraApp(),
    ),
  );
}

class HeraApp extends StatelessWidget {
  const HeraApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: AppTheme.darkTheme,
      home: Scaffold(
        appBar: AppBar(title: const Text('Hera Clean Architecture')),
        body: BlocBuilder<AuthCubit, AuthState>(
          builder: (context, state) {
            if (state is AuthLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state is AuthAuthenticated) {
              return Center(child: Text('Welcome, ${state.userId}!'));
            }
            return Center(
              child: ElevatedButton(
                onPressed: () => context.read<AuthCubit>().login('jihed', 'secret'),
                child: const Text('Login'),
              ),
            );
          },
        ),
      ),
    );
  }
}
