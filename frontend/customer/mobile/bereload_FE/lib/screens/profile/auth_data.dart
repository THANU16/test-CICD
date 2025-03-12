import 'package:flutter/material.dart';

class AuthDataProvider extends ChangeNotifier {
  static final AuthDataProvider _instance = AuthDataProvider._internal();
  factory AuthDataProvider() => _instance;
  AuthDataProvider._internal();

  String? _email;
  String? _phoneNumber;
  DateTime? _dateOfBirth;

  String? get email => _email;
  String? get phoneNumber => _phoneNumber;
  DateTime? get dateOfBirth => _dateOfBirth;

  void setEmail(String email) {
    _email = email;
    notifyListeners();
  }

  void setPhoneNumber(String phoneNumber) {
    _phoneNumber = phoneNumber;
    notifyListeners();
  }

  void setDateOfBirth(DateTime? dob) {
    _dateOfBirth = dob;
    notifyListeners();
  }
}