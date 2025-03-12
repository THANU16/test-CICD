import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pinput/pinput.dart';
import 'package:flutter/gestures.dart';
import 'dart:async';
import '../common/dob_page.dart';

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

class EmailOtpPage extends StatefulWidget {
  final String email;

  const EmailOtpPage({
    super.key,
    required this.email,
  });

  @override
  State<EmailOtpPage> createState() => _EmailOtpPageState();
}

class _EmailOtpPageState extends State<EmailOtpPage> {
  final pinController = TextEditingController();
  bool _isValidOtp = false;
  int _timeRemaining = 60;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    startTimer();
  }

  void startTimer() {
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

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final defaultPinTheme = PinTheme(
      width: MediaQuery.of(context).size.width * 0.18,
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
                      'OTP Verification',
                      style: GoogleFonts.inter(
                        fontSize: 30,
                        fontWeight: FontWeight.w700,
                        color: Colors.grey[900],
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Enter the verification code we just sent on ${widget.email}',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                        color: Colors.grey[500],
                      ),
                    ),
                    const SizedBox(height: 32),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 0),
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
                    const SizedBox(height: 8),
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
                      child: TextButton(
                        onPressed: () {
                          if (_isValidOtp) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    const DobPage(flow: AuthFlow.email),
                              ),
                            );
                          }
                        },
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
                    const SizedBox(height: 16),
                    Center(
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
                                color: Colors.grey[900],
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () {
                                  setState(() {
                                    _timeRemaining = 60;
                                  });
                                  startTimer();
                                },
                            ),
                          ],
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
                  totalScreens: 3,
                  currentScreen: 1,
                ),
              ),
            ],
          ),
        ))));
  }
}
