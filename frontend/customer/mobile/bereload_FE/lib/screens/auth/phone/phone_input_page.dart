import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:phone_form_field/phone_form_field.dart';
import '../../profile/auth_data.dart';
import 'phone_otp_page.dart';

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

class PhoneInputPage extends StatefulWidget {
  const PhoneInputPage({super.key});

  @override
  State<PhoneInputPage> createState() => _PhoneInputPageState();
}

class _PhoneInputPageState extends State<PhoneInputPage> {
  bool _isValidPhone = false;
  late final phoneController = PhoneController(
    initialValue: PhoneNumber(isoCode: IsoCode.BE, nsn: ''),
  );

  @override
  void dispose() {
    phoneController.dispose();
    super.dispose();
  }

  void _handleSignIn() {
    if (_isValidPhone) {
      final phoneNumber = phoneController.value.international;
      AuthDataProvider().setPhoneNumber(phoneNumber);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => PhoneOtpPage(
            phoneNumber: phoneNumber,
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
                      'Welcome back!',
                      style: GoogleFonts.inter(
                        fontSize: 30,
                        fontWeight: FontWeight.w700,
                        color: Colors.grey[900],
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Glad to see you, Again!',
                      style: GoogleFonts.inter(
                        fontSize: 30,
                        fontWeight: FontWeight.w700,
                        color: Colors.grey[900],
                      ),
                    ),
                    const SizedBox(height: 48),
                    PhoneFormField(
                      key: const Key('phone-field'),
                      controller: phoneController,
                      isCountrySelectionEnabled: true,
                      isCountryButtonPersistent: true,
                      countryButtonStyle: const CountryButtonStyle(),
                      decoration: InputDecoration(
                        hintText: 'Enter mobile number',
                        hintStyle: GoogleFonts.inter(color: Colors.grey[400]),
                        filled: true,
                        fillColor: Colors.white,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide:
                              BorderSide(color: Colors.grey[300]!, width: 1),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide:
                              BorderSide(color: Colors.grey[300]!, width: 1),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide:
                              BorderSide(color: Colors.grey[500]!, width: 1),
                        ),
                        contentPadding: const EdgeInsets.all(16),
                      ),
                      validator: (PhoneNumber? phone) {
                        if (phone == null)
                          return 'Please enter a mobile number';
                        if (!phone.isValid()) {
                          return 'Please enter a valid mobile number';
                        }
                        return null;
                      },
                      keyboardType: TextInputType.phone,
                      autocorrect: true,
                      enabled: true,
                      autovalidateMode: AutovalidateMode.onUserInteraction,
                      onChanged: (PhoneNumber? number) {
                        if (number != null) {
                          setState(() {
                            _isValidPhone =
                                number.isValid() && number.nsn.isNotEmpty;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 32),
                    SizedBox(
                      width: double.infinity,
                      child: TextButton(
                        onPressed: _handleSignIn,
                        style: TextButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                          backgroundColor: const Color(0xFF05E27E),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Sign in',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text.rich(
                      TextSpan(
                        children: [
                          TextSpan(
                            text: 'By clicking on Sign in, I accept all the ',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                              color: Colors.grey[400],
                            ),
                          ),
                          TextSpan(
                            text: 'terms and conditions',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                              color: Colors.grey[400],
                              decoration: TextDecoration.underline,
                            ),
                          ),
                          TextSpan(
                            text: ' of Berelord.',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w400,
                              color: Colors.grey[400],
                            ),
                          ),
                        ],
                      ),
                      textAlign: TextAlign.center,
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
                  currentScreen: 0,
                ),
              ),
            ],
          ),
        ))));
  }
}
