import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:dotted_border/dotted_border.dart';
import 'package:url_launcher/url_launcher.dart';

class PaymentSuccessScreen extends StatelessWidget {
  final String amount;
  final List<String> topUpCodes;
  final VoidCallback onDone;
  final String email;
  final String planName;
  final String paymentMethod;
  final bool isDataPlan;

  const PaymentSuccessScreen({
    super.key,
    required this.amount,
    required this.topUpCodes,
    required this.onDone,
    required this.email,
    required this.planName,
    required this.paymentMethod,
    this.isDataPlan = false,
  });

  Widget _buildCodeDisplay(String code, bool isCopyButton) {
    return DottedBorder(
      borderType: BorderType.RRect,
      radius: const Radius.circular(12),
      color: const Color(0xFF059669),
      strokeWidth: 3,
      dashPattern: const [8, 4],
      padding: EdgeInsets.zero,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: const Color(0xFFDCFCE7),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              code,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: const Color(0xFF059669),
              ),
            ),
            Icon(
              isCopyButton ? Icons.copy : Icons.phone,
              size: 24,
              color: const Color(0xFF059669),
            ),
          ],
        ),
      ),
    );
  }

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
                      const SizedBox(height: 24),
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
                        'Thank you for your purchase. Recharge code has been sent to the delivery email address that you provided.',
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
                      _buildDetailRow('Deliver to', email),
                      const SizedBox(height: 12),
                      _buildDetailRow('Purchased',
                          isDataPlan ? '$planName - €$amount' : '€$amount'),
                      const SizedBox(height: 24),
                      Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Redeem code',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[900],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...topUpCodes
                          .expand((code) => [
                                _buildCodeDisplay(code, false),
                                const SizedBox(height: 12),
                                _buildCodeDisplay(code, true),
                                const SizedBox(height: 12),
                              ])
                          .toList(),
                      const SizedBox(height: 24),
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
                      onPressed: () {},
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
