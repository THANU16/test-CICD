import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';

class LanguageDrawer extends StatefulWidget {
  const LanguageDrawer({super.key});

  @override
  State<LanguageDrawer> createState() => _LanguageDrawerState();
}

class _LanguageDrawerState extends State<LanguageDrawer> {
  String selectedLanguage = 'en';

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
        Provider.of<LanguageProvider>(context, listen: false).setLanguage(locale);
        Navigator.pop(context);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
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

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    Center(
                      child: Text(
                        'Language',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                    ),
                    Positioned(
                      right: 0,
                      top: -2,
                      child: GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            Icons.close,
                            size: 20,
                            color: Colors.grey[600],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Divider(
                  color: Colors.grey[300],
                  thickness: 1,
                ),
                const SizedBox(height: 16),
                _buildLanguageOption(
                  flag: 'germany.png',
                  language: "Dutch",
                  locale: 'de',
                ),
                _buildLanguageOption(
                  flag: 'nederlands.png',
                  language: "Nederlands",
                  locale: 'nl',
                ),
                _buildLanguageOption(
                  flag: 'uk.png',
                  language: "English",
                  locale: 'en',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}