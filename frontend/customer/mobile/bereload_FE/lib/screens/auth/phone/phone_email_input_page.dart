import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../profile/auth_data.dart';
import 'phone_email_otp_page.dart';

class ScreenIndicator extends StatelessWidget {
  final int totalScreens;
  final int currentScreen;

  const ScreenIndicator({
    super.key,
    required this.totalScreens,
    required this.currentScreen,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(
        totalScreens,
        (index) => Container(
          margin: const EdgeInsets.symmetric(horizontal: 3),
          width: index == currentScreen ? 18 : 8,
          height: 8,
          decoration: BoxDecoration(
            color: index == currentScreen
                ? const Color(0xFF111827)
                : const Color(0xFF05E27E),
            borderRadius: BorderRadius.circular(9),
          ),
        ),
      ),
    );
  }
}

class PhoneEmailPage extends StatefulWidget {
  const PhoneEmailPage({super.key});

  @override
  State<PhoneEmailPage> createState() => _PhoneEmailPageState();
}

class _PhoneEmailPageState extends State<PhoneEmailPage> {
  final _emailController = TextEditingController();
  bool _isValidEmail = false;
  bool _showError = false;

  void _validateEmail(String value) {
    setState(() {
      _isValidEmail =
          RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value);
      if (_showError) {
        _showError = !_isValidEmail;
      }
    });
  }

  void _handleVerify() {
    setState(() {
      _showError = !_isValidEmail;
    });

    if (_isValidEmail) {
      AuthDataProvider().setEmail(_emailController.text);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => PhoneEmailOtpPage(
            email: _emailController.text,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0, top: 8.0, bottom: 8.0),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: Colors.grey[300]!,
                width: 1,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: IconButton(
              icon: const Icon(
                Icons.chevron_left,
                size: 24,
              ),
              padding: EdgeInsets.zero,
              color: Colors.black,
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: SizedBox(
            height: MediaQuery.of(context).size.height -
                AppBar().preferredSize.height -
                MediaQuery.of(context).padding.top,
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Add Email Address',
                        style: GoogleFonts.inter(
                          fontSize: 30,
                          fontWeight: FontWeight.w700,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 32),
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        onChanged: _validateEmail,
                        decoration: InputDecoration(
                          hintText: 'Enter your email address',
                          hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color:
                                  _showError ? Colors.red : Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color:
                                  _showError ? Colors.red : Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color:
                                  _showError ? Colors.red : Colors.grey[300]!,
                              width: 1,
                            ),
                          ),
                          contentPadding: const EdgeInsets.all(16),
                          errorText: _showError
                              ? 'Please enter a valid email address'
                              : null,
                          errorStyle: GoogleFonts.inter(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        child: TextButton(
                          onPressed: _handleVerify,
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.all(16),
                            backgroundColor: const Color(0xFF05E27E),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            'Verify',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.black,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 32,
                  child: const ScreenIndicator(
                    totalScreens: 5,
                    currentScreen: 2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
