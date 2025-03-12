import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:phone_form_field/phone_form_field.dart';
import './simswap_status_screen.dart';
import './sim_swap_service.dart';

class SimSwapScreen extends StatefulWidget {
  const SimSwapScreen({super.key});

  @override
  State<SimSwapScreen> createState() => _SimSwapScreen();
}

class _SimSwapScreen extends State<SimSwapScreen> {
  int _selectedTab = 0;
  String _selectedReason = '';
  bool _termsAccepted = false;
  late final oldPhoneController =
      PhoneController(initialValue: PhoneNumber(isoCode: IsoCode.BE, nsn: ''));
  late final newPhoneController =
      PhoneController(initialValue: PhoneNumber(isoCode: IsoCode.BE, nsn: ''));
  final simSerialController = TextEditingController();
  final frequentDialingController = TextEditingController();
  final _simSwapService = SimSwapService();

  @override
  void initState() {
    super.initState();
    PhoneFormField.preloadFlags();
  }

  @override
  void dispose() {
    oldPhoneController.dispose();
    newPhoneController.dispose();
    simSerialController.dispose();
    frequentDialingController.dispose();
    super.dispose();
  }

  void _addNewRequest() {
    final now = DateTime.now();
    final formattedDate =
        '${now.day.toString().padLeft(2, '0')} ${_getMonthName(now.month)} ${now.year}';

    _simSwapService.addRequest({
      'date': formattedDate,
      'status': 'Pending',
      'oldNumber': oldPhoneController.value.nsn ,
      'newNumber': newPhoneController.value.nsn ,
      'reason': _selectedReason,
    });
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

  Widget _buildPhoneField(PhoneController controller, String hintText) {
    return PhoneFormField(
      controller: controller,
      isCountrySelectionEnabled: true,
      isCountryButtonPersistent: true,
      countryButtonStyle: const CountryButtonStyle(),
      decoration: InputDecoration(
        hintText: hintText,
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
        if (!phone.isValid()) return 'Please enter a valid mobile number';
        return null;
      },
      keyboardType: TextInputType.phone,
      autocorrect: true,
      enabled: true,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }

  Widget _buildReasonOption(String reason) {
    final isSelected = _selectedReason == reason;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        border: Border.all(
          color: isSelected ? const Color(0xFF05E27E) : Colors.grey[300]!,
          width: isSelected ? 2 : 1,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: RadioListTile(
        title: Text(
          reason,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.grey[900],
          ),
        ),
        value: reason,
        groupValue: _selectedReason,
        activeColor: const Color(0xFF05E27E),
        onChanged: (String? value) {
          setState(() {
            _selectedReason = value!;
          });
        },
        contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'SIM Swap',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.grey[900],
          ),
        ),
        leading: Padding(
          padding: const EdgeInsets.only(left: 16.0, top: 8.0, bottom: 8.0),
          child: Container(
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[300]!, width: 1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: IconButton(
              icon: const Icon(Icons.chevron_left, size: 24),
              padding: EdgeInsets.zero,
              color: Colors.black,
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTab = 0;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _selectedTab == 0
                              ? const Color(0xFF05E27E)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'New request',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[900],
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTab = 1;
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _selectedTab == 1
                              ? const Color(0xFF05E27E)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'All request',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[900],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
                child: _selectedTab == 0
                    ? SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 24),
                            Text(
                              'Provide the necessary details to process your SIM swap request and activate the new SIM.',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[900],
                              ),
                            ),
                            const SizedBox(height: 24),
                            Text(
                              'Old number',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 8),
                            _buildPhoneField(oldPhoneController, ""),
                            const SizedBox(height: 20),
                            Text(
                              'New SIM number',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 8),
                            _buildPhoneField(newPhoneController, ""),
                            const SizedBox(height: 20),
                            Text(
                              'New SIM serial number',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 8),
                            Container(
                              decoration: BoxDecoration(
                                border: Border.all(
                                    color: Colors.grey[300]!, width: 1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 16,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[50],
                                      border: Border(
                                        right: BorderSide(
                                          color: Colors.grey[300]!,
                                          width: 1,
                                        ),
                                      ),
                                      borderRadius: const BorderRadius.only(
                                        topLeft: Radius.circular(12),
                                        bottomLeft: Radius.circular(12),
                                      ),
                                    ),
                                    child: Text(
                                      '89320600',
                                      style: GoogleFonts.inter(
                                        color: Colors.grey[600],
                                        fontSize: 16,
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    child: TextFormField(
                                      controller: simSerialController,
                                      decoration: InputDecoration(
                                        hintText: '(+32)',
                                        hintStyle: GoogleFonts.inter(
                                          color: Colors.grey[400],
                                        ),
                                        border: InputBorder.none,
                                        contentPadding:
                                            const EdgeInsets.symmetric(
                                          horizontal: 16,
                                        ),
                                      ),
                                      keyboardType: TextInputType.number,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              'Frequent dialing number',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 8),
                            TextFormField(
                              controller: frequentDialingController,
                              decoration: InputDecoration(
                                hintText: 'Eg: +32 495 54 55 78',
                                hintStyle: GoogleFonts.inter(
                                  color: Colors.grey[400],
                                ),
                                filled: true,
                                fillColor: Colors.white,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(
                                    color: Colors.grey[300]!,
                                    width: 1,
                                  ),
                                ),
                                enabledBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(
                                    color: Colors.grey[300]!,
                                    width: 1,
                                  ),
                                ),
                                focusedBorder: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide(
                                    color: Colors.grey[500]!,
                                    width: 1,
                                  ),
                                ),
                                contentPadding: const EdgeInsets.all(16),
                              ),
                              keyboardType: TextInputType.phone,
                            ),
                            const SizedBox(height: 20),
                            Text(
                              'Reasons for SIM swap',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey[600],
                              ),
                            ),
                            const SizedBox(height: 8),
                            _buildReasonOption('SIM damaged'),
                            _buildReasonOption('SIM lost'),
                            _buildReasonOption('Network issue'),
                            _buildReasonOption('Other'),
                            const SizedBox(height: 24),
                            Row(
                              children: [
                                SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: Checkbox(
                                    value: _termsAccepted,
                                    onChanged: (bool? value) {
                                      setState(() {
                                        _termsAccepted = value ?? false;
                                      });
                                    },
                                    fillColor: MaterialStateProperty
                                        .resolveWith<Color>(
                                      (Set<MaterialState> states) {
                                        if (states
                                            .contains(MaterialState.selected)) {
                                          return const Color(0xFF0AD97C);
                                        }
                                        return Colors.transparent;
                                      },
                                    ),
                                    side: BorderSide(
                                      color: Colors.grey[300]!,
                                      width: 1,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: RichText(
                                    text: TextSpan(
                                      text: 'I agree to the ',
                                      style: GoogleFonts.inter(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.grey[600],
                                      ),
                                      children: [
                                        TextSpan(
                                          text: 'Terms and conditions',
                                          style: GoogleFonts.inter(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w500,
                                            color: Colors.grey[600],
                                            decoration:
                                                TextDecoration.underline,
                                          ),
                                        ),
                                        TextSpan(
                                          text: '.',
                                          style: GoogleFonts.inter(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w500,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),
                            SizedBox(
                              width: double.infinity,
                              child: TextButton(
                                onPressed:
                                    _termsAccepted && _selectedReason.isNotEmpty
                                        ? () {
                                            if (oldPhoneController.value.isValid() == true &&
                                                newPhoneController
                                                        .value
                                                        .isValid() ==
                                                    true &&
                                                simSerialController
                                                    .text.isNotEmpty &&
                                                frequentDialingController
                                                    .text.isNotEmpty) {
                                              _addNewRequest();
                                              Navigator.of(context).push(
                                                MaterialPageRoute(
                                                  builder: (context) =>
                                                      const SimSwapSuccessScreen(),
                                                ),
                                              );
                                            } else {
                                              ScaffoldMessenger.of(context)
                                                  .showSnackBar(
                                                const SnackBar(
                                                  content: Text(
                                                      'Please fill in all required fields'),
                                                  backgroundColor: Colors.red,
                                                ),
                                              );
                                            }
                                          }
                                        : null,
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.all(16),
                                  backgroundColor: _termsAccepted &&
                                          _selectedReason.isNotEmpty
                                      ? const Color(0xFF05E27E)
                                      : Colors.grey[300],
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: Text(
                                  'Send Request',
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: _termsAccepted &&
                                            _selectedReason.isNotEmpty
                                        ? Colors.black
                                        : Colors.grey[500],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                        ),
                      )
                    : Expanded(
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 0, vertical: 24),
                          child: Column(
                            children: _simSwapService.requests.isEmpty
                                ? [
                                    Center(
                                      child: Text(
                                        "It looks like you haven't submitted any SIM swap requests yet.",
                                        textAlign: TextAlign.center,
                                        style: GoogleFonts.inter(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.grey[500],
                                        ),
                                      ),
                                    )
                                  ]
                                : _simSwapService.requests
                                    .map((request) => SimRequestCard(
                                          date: request['date']!,
                                          status: request['status']!,
                                          oldNumber: request['oldNumber']!,
                                          newNumber: request['newNumber']!,
                                          reason: request['reason']!,
                                        ))
                                    .toList(),
                          ),
                        ),
                      )),
          ],
        ),
      ),
    );
  }
}

class SimRequestCard extends StatelessWidget {
  final String date;
  final String status;
  final String oldNumber;
  final String newNumber;
  final String reason;

  const SimRequestCard({
    super.key,
    required this.date,
    required this.status,
    required this.oldNumber,
    required this.newNumber,
    required this.reason,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!, width: 1),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                date,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.grey[500],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 2,
                ),
                decoration: BoxDecoration(
                  color: status == 'Completed'
                      ? Colors.green[50]
                      : Colors.yellow[100],
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  status,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: status == 'Completed'
                        ? Colors.green[800]
                        : Colors.yellow[900],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            height: 1,
            color: Colors.grey[300],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'OLD SIM NUMBER',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
              Text(
                'NEW SIM NUMBER',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                oldNumber,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.grey[900],
                ),
              ),
              Text(
                newNumber,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.grey[900],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Reason',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.grey[700],
                ),
              ),
              Text(
                reason,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[900],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
