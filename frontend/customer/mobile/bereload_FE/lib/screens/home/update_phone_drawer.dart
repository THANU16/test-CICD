

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:phone_form_field/phone_form_field.dart';
import 'package:pinput/pinput.dart';
import '../profile/auth_data.dart';
import 'dart:async';

class PhoneVerificationState {
  static bool isVerified = false;
}

class UpdatePhoneDrawer extends StatefulWidget {
  const UpdatePhoneDrawer({super.key});

  @override
  State<UpdatePhoneDrawer> createState() => _UpdatePhoneDrawerState();
}

class _UpdatePhoneDrawerState extends State<UpdatePhoneDrawer> {
  final PageController _pageController = PageController();
  late final phoneController = PhoneController(
    initialValue: PhoneNumber(isoCode: IsoCode.BE, nsn: ''),
  );
  final pinController = TextEditingController();
  bool _isValidPhone = false;
  bool _isValidOtp = false;
  int _timeRemaining = 60;
  Timer? _timer;
  String? _phoneNumber;

  @override
  void dispose() {
    phoneController.dispose();
    pinController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void startTimer() {
    _timer?.cancel();
    setState(() {
      _timeRemaining = 60;
    });
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_timeRemaining > 0) {
        setState(() {
          _timeRemaining--;
        });
      } else {
        _timer?.cancel();
      }
    });
  }

  void _onSendOTP() {
    final phoneNumber = phoneController.value;
    _phoneNumber = '+${phoneNumber.countryCode} ${phoneNumber.nsn}';
    startTimer();
    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  Widget _buildPhoneInputPage() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Text(
                'Update phone number',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[900],
                ),
              ),
            ),
            const SizedBox(height: 12),
            Divider(color: Colors.grey[300], thickness: 1),
            const SizedBox(height: 24),
            Text(
              'Provide the mobile number you wish to update, and we will send an OTP for verification.',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[900],
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Phone number',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
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
                  borderSide: BorderSide(color: Colors.grey[300]!, width: 1),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[300]!, width: 1),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey[500]!, width: 1),
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
              validator: (PhoneNumber? phone) {
                if (phone == null) return 'Please enter a mobile number';
                if (!phone.isValid()) {
                  return 'Please enter a valid mobile number';
                }
                return null;
              },
              onChanged: (PhoneNumber? number) {
                setState(() {
                  _isValidPhone =
                      number?.isValid() == true && number!.nsn.isNotEmpty;
                });
              },
            ),
            const SizedBox(height: 30),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isValidPhone ? _onSendOTP : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF05E27E),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  disabledBackgroundColor: Colors.grey[300],
                ),
                child: Text(
                  'Send OTP',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: _isValidPhone ? Colors.grey[900] : Colors.grey[600],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOTPVerificationPage() {
    final defaultPinTheme = PinTheme(
      width: 56,
      height: 56,
      textStyle: GoogleFonts.inter(
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: Colors.grey[900],
      ),
      decoration: BoxDecoration(
        border: Border.all(
          color: Colors.grey[900]!,
          width: 1.2,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
    );

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                IconButton(
                  icon: const Icon(
                    Icons.chevron_left,
                    size: 24,
                  ),
                  padding: EdgeInsets.zero,
                  color: Colors.black,
                  onPressed: () {
                    _pageController.previousPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    );
                  },
                ),
                Expanded(
                  child: Transform.translate(
                    offset: Offset(-24, 0),
                    child: Center(
                      child: Text(
                        'Update phone number',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                    ),
                  ),
                )
              ],
            ),
            const SizedBox(height: 0),
            Divider(color: Colors.grey[300], thickness: 1),
            const SizedBox(height: 24),
            Text(
              'Enter the verification code we just sent to $_phoneNumber',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w400,
                color: Colors.grey[500],
              ),
            ),
            const SizedBox(height: 32),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Pinput(
                controller: pinController,
                length: 4,
                defaultPinTheme: defaultPinTheme,
                onChanged: (pin) {
                  setState(() {
                    _isValidOtp = pin.length == 4;
                  });
                },
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: Text.rich(
                TextSpan(
                  text: 'Time remaining: ',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    color: Colors.grey[900],
                  ),
                  children: [
                    TextSpan(
                      text: '$_timeRemaining',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[900],
                      ),
                    ),
                    TextSpan(
                      text: 's',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[900],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isValidOtp
                    ? () {
                        if (_phoneNumber != null) {
                          PhoneVerificationState.isVerified = true;
                          AuthDataProvider().setPhoneNumber(
                              _phoneNumber!); 
                          Navigator.pop(context);
                        }
                      }
                    : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF05E27E),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  disabledBackgroundColor: Colors.grey[300],
                ),
                child: Text(
                  'Verify',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: _isValidOtp ? Colors.grey[900] : Colors.grey[600],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Center(
              child: GestureDetector(
                onTap: _timeRemaining == 0 ? startTimer : null,
                child: RichText(
                  text: TextSpan(
                    text: "Didn't receive the code? ",
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                      color: Colors.grey[900],
                    ),
                    children: [
                      TextSpan(
                        text: 'Re-send',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: _timeRemaining == 0
                              ? Colors.grey[900]
                              : Colors.grey[400],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.52,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      child: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(),
        children: [
          _buildPhoneInputPage(),
          _buildOTPVerificationPage(),
        ],
      ),
    );
  }
}

