import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../home/home_page.dart';
import '../../profile/auth_data.dart';

enum AuthFlow {
  email,
  phone,
}

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

class DobPage extends StatefulWidget {
  final AuthFlow flow;
  const DobPage({
    super.key,
    required this.flow,
  });

  @override
  State<DobPage> createState() => _DobPageState();
}

class _DobPageState extends State<DobPage> {
  DateTime? selectedDate;

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: const Color(0xFF05E27E),
              onPrimary: Colors.white,
              onSurface: Colors.grey[900]!,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
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
      body: Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Add your Date of Birth',
                  style: GoogleFonts.inter(
                    fontSize: 30,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey[900],
                  ),
                ),
                const SizedBox(height: 32),
                GestureDetector(
                  onTap: () => _selectDate(context),
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: Colors.grey[300]!,
                        width: 1,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      color: Colors.white,
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            border: Border(
                              right: BorderSide(
                                color: Colors.grey[300]!,
                                width: 1,
                              ),
                            ),
                            color: Colors.grey[50],
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(12),
                              bottomLeft: Radius.circular(12),
                            ),
                          ),
                          child: Icon(
                            Icons.calendar_today,
                            color: Colors.grey[600],
                          ),
                        ),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Text(
                              selectedDate != null
                                  ? _formatDate(selectedDate!)
                                  : 'Select your date of birth',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: selectedDate != null
                                    ? Colors.grey[900]
                                    : Colors.grey[400],
                              ),
                            ),
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
                      if (selectedDate != null) {
                        AuthDataProvider().setDateOfBirth(selectedDate);
                        Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(
                            builder: (context) =>
                                HomePage(authFlow: widget.flow),
                          ),
                          (route) => false,
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
                      'Continue',
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
                  child: TextButton(
                    onPressed: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => HomePage(authFlow: widget.flow),
                        ),
                        (route) => false,
                      );
                    },
                    child: Text(
                      'Skip for now',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[900],
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
            child: ScreenIndicator(
              totalScreens: widget.flow == AuthFlow.email ? 3 : 5,
              currentScreen: widget.flow == AuthFlow.email ? 2 : 4,
            ),
          ),
        ],
      ),
    );
  }
}
