import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';
import '../screens/auth/sign_in_page.dart';

class LanguageSelectionScreen extends StatefulWidget {
  const LanguageSelectionScreen({super.key});

  @override
  State<LanguageSelectionScreen> createState() =>
      _LanguageSelectionScreenState();
}

class _LanguageSelectionScreenState extends State<LanguageSelectionScreen> {
  String? selectedLanguage;

  Widget _buildLanguageOption({
    required String flag,
    required String language,
    required String locale,
  }) {
    final isSelected = selectedLanguage == locale;

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedLanguage = locale;
        });

        Provider.of<LanguageProvider>(context, listen: false)
            .setLanguage(locale);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? const Color(0xFF05E27E) : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Image.asset(
              'images/$flag',
              width: 24,
              height: 24,
            ),
            const SizedBox(width: 12),
            Text(
              language,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[900],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleContinue() {
    if (selectedLanguage != null) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => const SignInPage(),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Please select a language to continue',
            style: GoogleFonts.inter(),
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Select your preferred language',
                style: GoogleFonts.inter(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 40),
              _buildLanguageOption(
                flag: 'germany.png',
                language: "Dutch",
                locale: 'de',
              ),
              const SizedBox(height: 12),
              _buildLanguageOption(
                flag: 'nederlands.png',
                language: "Nederlands",
                locale: 'nl',
              ),
              const SizedBox(height: 12),
              _buildLanguageOption(
                flag: 'uk.png',
                language: "English",
                locale: 'en',
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: _handleContinue,
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.all(16),
                    backgroundColor: const Color(0xFF05E27E),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Continue',
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
      ),
    );
  }
}
