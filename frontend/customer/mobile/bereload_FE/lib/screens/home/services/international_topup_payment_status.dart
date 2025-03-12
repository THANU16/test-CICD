import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class InternationalPaymentSuccessScreen extends StatelessWidget {
  final String amount;
  final VoidCallback onDone;
  final String phoneNumber;
  final String planName;
  final String paymentMethod;
  final bool isDataPlan;
  final String countryFlag;

  const InternationalPaymentSuccessScreen({
    super.key,
    required this.amount,
    required this.onDone,
    required this.phoneNumber,
    required this.planName,
    required this.paymentMethod,
    required this.countryFlag,
    this.isDataPlan = false,
  });

  @override
  Widget build(BuildContext context) {
    final DateTime now = DateTime.now();
    final String dateTime =
        "${now.day} ${_getMonthName(now.month)} ${now.year}, ${now.hour.toString().padLeft(2, '0')}.${now.minute.toString().padLeft(2, '0')}";
    final String reference =
        "#${(20000000 + now.millisecondsSinceEpoch % 10000000).toString()}";

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    children: [
                      const SizedBox(height: 100),
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: const Color(0xFF05E27E).withAlpha(20),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: const Color(0xFF05E27E),
                            width: 1,
                          ),
                        ),
                        child: const Icon(
                          Icons.check_circle,
                          color: Color(0xFF05E27E),
                          size: 50,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Payment successful!',
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Thank you for your purchase. Your top-up has been processed successfully.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Divider(
                        color: Colors.grey[300],
                        thickness: 1,
                      ),
                      const SizedBox(height: 20),

                      _buildDetailRow('Date & Time', dateTime),
                      const SizedBox(height: 12),
                      _buildDetailRow('Reference', reference),
                      const SizedBox(height: 12),
                      _buildDetailRow('Payment method', paymentMethod),
                      const SizedBox(height: 12),
                      _buildDetailRow('Purchased',
                          isDataPlan ? '$planName - €$amount' : '€$amount'),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Mobile number',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[600],
                            ),
                          ),
                          Row(
                            children: [
                              Text(
                                countryFlag,
                                style: const TextStyle(
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                phoneNumber,
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey[900],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(32),
                  topRight: Radius.circular(32),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(15),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              padding: const EdgeInsets.fromLTRB(16, 22, 16, 30),
              child: Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () {
                      },
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: Colors.grey[900]!,
                            width: 1,
                          ),
                        ),
                      ),
                      child: Text(
                        'Share',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextButton(
                      onPressed: onDone,
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.all(16),
                        backgroundColor: const Color(0xFF05E27E),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        'Back to Home',
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
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 16,
            color: Colors.grey[600],
          ),
        ),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.grey[900],
          ),
        ),
      ],
    );
  }

  String _getMonthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[month - 1];
  }
}
