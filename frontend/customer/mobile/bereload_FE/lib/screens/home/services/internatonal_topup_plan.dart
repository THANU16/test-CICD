import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:phone_form_field/phone_form_field.dart';
import './international_topup_checkout.dart';

class InternationalTopupPlanScreen extends StatefulWidget {
  final PhoneNumber phoneNumber;

  const InternationalTopupPlanScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<InternationalTopupPlanScreen> createState() =>
      _InternationalTopupPlanScreenState();
}

class _InternationalTopupPlanScreenState
    extends State<InternationalTopupPlanScreen> {
  bool _isManualAmountChecked = false;
  final TextEditingController _amountController = TextEditingController();
  int _selectedTab = 0;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, String>> countries = [
    {'name': 'Belgium', 'flag': '🇧🇪'},
    {'name': 'France', 'flag': '🇫🇷'},
    {'name': 'Norway', 'flag': '🇳🇴'},
    {'name': 'Ukraine', 'flag': '🇺🇦'},
    {'name': 'Sri Lanka', 'flag': '🇱🇰'},
    {'name': 'India', 'flag': '🇮🇳'},
    {'name': 'Germany', 'flag': '🇩🇪'},
  ];

  List<Map<String, String>> get filteredCountries {
    if (_searchQuery.isEmpty) {
      return countries;
    }
    return countries
        .where((country) =>
            country['name']!.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  @override
  void dispose() {
    _amountController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Widget _buildCountrySearch() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(
              color: Colors.grey[300]!,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: TextField(
            controller: _searchController,
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            decoration: InputDecoration(
              hintText: 'Search countries',
              hintStyle: GoogleFonts.inter(
                fontSize: 14,
                color: Colors.grey[500],
              ),
              prefixIcon: Icon(
                Icons.search,
                color: Colors.grey[500],
              ),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 12,
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Column(
          children: filteredCountries.map((country) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  Text(
                    country['flag']!,
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    country['name']!,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  void _showPlanDetails(
    BuildContext context, {
    required String planName,
    required String gb,
    required String price,
    required String dataText,
    required String validityText,
    required List<String> features,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      builder: (BuildContext context) {
        final viewInsets = MediaQuery.of(context).viewInsets.bottom;
        return DraggableScrollableSheet(
          initialChildSize: 0.75,
          minChildSize: 0.5,
          maxChildSize: 0.95,
          expand: false,
          builder: (context, scrollController) {
            return Padding(
              padding: EdgeInsets.only(bottom: viewInsets),
              child: Container(
                padding: const EdgeInsets.only(
                  left: 16,
                  right: 16,
                  bottom: 30,
                  top: 18,
                ),
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: Colors.grey[300],
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      Center(
                        child: Text(
                          'Plan Details',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[900],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      Divider(
                        color: Colors.grey[300],
                        thickness: 1,
                      ),
                      const SizedBox(height: 40),
                      Text(
                        planName,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[500],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            gb,
                            style: GoogleFonts.inter(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey[900],
                            ),
                          ),
                          Text(
                            price,
                            style: GoogleFonts.inter(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey[900],
                            ),
                          ),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            dataText,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                          Text(
                            validityText,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Divider(
                        color: Colors.grey[300],
                        thickness: 1,
                      ),
                      const SizedBox(height: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: features
                            .map((feature) => Padding(
                                  padding: const EdgeInsets.only(bottom: 7),
                                  child: Row(
                                    children: [
                                      FaIcon(
                                        FontAwesomeIcons.check,
                                        color: const Color(0xFF05E27E),
                                        size: 20,
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          feature,
                                          style: GoogleFonts.inter(
                                            fontSize: 14,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ))
                            .toList(),
                      ),
                      const SizedBox(height: 24),
                      Text(
                        'Things you need to know',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Purchased online (via LycaMobile)',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[500],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '• ',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.grey[500],
                              ),
                            ),
                            Expanded(
                              child: Text(
                                'Data to use in Belgium or EU Roaming - 4GB New offline customers with auto-renew will get 4GB instead of 2GB upon bundle activation next cycle.',
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  color: Colors.grey[500],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          'Run out of data? Then automatically switch to our competitive Pay as you Go rates.',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Text(
                          'EU/EEA Roaming - For short holidays or business trips! These roaming services are intended for customers staying abroad for short periods, such as holidays or business trips. Note: Have you used up your EU data bundle? Then you will pay 0.00189 per MB.',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Divider(
                        color: Colors.grey[300],
                        thickness: 1,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Activation',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'To activate your bundle, credit and promotions, you must first register your new Lyca Mobile SIM Belgium',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[500],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Divider(
                        color: Colors.grey[300],
                        thickness: 1,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Available Countries',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 8),
                      _buildCountrySearch(),
                      const SizedBox(height: 8),
                      Divider(
                        color: Colors.grey[300],
                        thickness: 1,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Order your bundle',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Text 2001 to 3535 to activate your bundle with your',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildDataPackageCard({
    required String planName,
    required String gb,
    required String price,
    required String dataText,
    required String minutes,
    required String texts,
    required String validityText,
    required List<String> features,
    bool isPopular = false,
  }) {
    return Container(
      height: 280,
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(
          color: const Color(0xFF05E27E),
          width: 2,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          children: [
            Positioned(
              top: -130,
              right: -130,
              child: Container(
                width: 420,
                height: 420,
                decoration: BoxDecoration(
                  color: const Color.fromARGB(190, 245, 245, 245),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Positioned(
              top: -80,
              right: -80,
              child: Container(
                width: 250,
                height: 250,
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  shape: BoxShape.circle,
                ),
              ),
            ),
            if (isPopular)
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF4444),
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(6),
                      bottomLeft: Radius.circular(12),
                    ),
                  ),
                  child: Text(
                    'Most Popular',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    planName,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[500],
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        gb,
                        style: GoogleFonts.inter(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[900],
                        ),
                      ),
                      Text(
                        price,
                        style: GoogleFonts.inter(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[900],
                        ),
                      ),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        dataText,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        validityText,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Divider(
                    color: Colors.grey[300],
                    thickness: 1,
                  ),
                  const SizedBox(height: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: features
                        .map((feature) => Padding(
                              padding: const EdgeInsets.only(bottom: 7),
                              child: Row(
                                children: [
                                  FaIcon(
                                    FontAwesomeIcons.check,
                                    color: const Color(0xFF05E27E),
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    feature,
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ))
                        .toList(),
                  ),
                  const Spacer(),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GestureDetector(
                        onTap: () => _showPlanDetails(
                          context,
                          planName: planName,
                          gb: gb,
                          price: price,
                          dataText: dataText,
                          validityText: validityText,
                          features: features,
                        ),
                        child: Text(
                          'More details',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[500],
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => InternationalCheckoutScreen(
                                isDataPlan: true,
                                amount: price,
                                subTotal: price,
                                planName: planName,
                                countryFlag: String.fromCharCodes(
                                  widget.phoneNumber.isoCode.name.split('').map(
                                        (char) => char.codeUnitAt(0) + 127397,
                                      ),
                                ),
                                phoneNumber: widget.phoneNumber.international,
                                gb: gb,
                                validity: validityText,
                                minutes: minutes,
                                texts: texts,
                                quantity: 1,
                              ),
                            ),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF05E27E),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Get this plan',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey[900],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Positioned(
              left: 0,
              top: 50,
              child: Container(
                width: 4.5,
                height: 50,
                decoration: BoxDecoration(
                  color: const Color(0xFF09DB7C),
                  borderRadius: const BorderRadius.only(
                    topRight: Radius.circular(4),
                    bottomRight: Radius.circular(4),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopUpCard(String amount) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => InternationalCheckoutScreen(
              isDataPlan: false,
              isManualTopup: false,
              amount: amount,
              planName: 'Top Up',
              countryFlag: String.fromCharCodes(
                widget.phoneNumber.isoCode.name.split('').map(
                      (char) => char.codeUnitAt(0) + 127397,
                    ),
              ),
              phoneNumber: widget.phoneNumber.international,
              subTotal: amount,
              quantity: 1,
            ),
          ),
        );
      },
      child: Stack(
        children: [
          Container(
            height: 72,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(
                color: const Color(0xFF05E27E),
                width: 1,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Stack(
                children: [
                  Positioned(
                    top: -240,
                    right: -120,
                    child: Container(
                      width: 400,
                      height: 400,
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(190, 245, 245, 245),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Positioned(
                    top: -210,
                    right: -130,
                    child: Container(
                      width: 300,
                      height: 300,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Image.asset(
                              'images/LycaLogo2.png',
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Lycamobile',
                              style: GoogleFonts.inter(
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[900],
                              ),
                            ),
                          ],
                        ),
                        Text(
                          '€$amount',
                          style: GoogleFonts.inter(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey[900],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 1,
            top: 16,
            child: Container(
              width: 4.5,
              height: 40,
              decoration: const BoxDecoration(
                color: Color(0xFF09DB7C),
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(4),
                  bottomRight: Radius.circular(4),
                ),
              ),
            ),
          ),
        ],
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
          'International Top-up',
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
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              Text(
                'Confirm the mobile number and network provider, or update them if needed.',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Network provider',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.grey[500],
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Image.asset(
                    'images/LycaLogo2.png',
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Lycamobile',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[900],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    'Mobile number',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: Colors.grey[500],
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        'Change',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Text(
                    String.fromCharCodes(
                      widget.phoneNumber.isoCode.name.split('').map(
                            (char) => char.codeUnitAt(0) + 127397,
                          ),
                    ),
                    style: const TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    widget.phoneNumber.international,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[900],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Divider(
                color: Colors.grey[300],
                thickness: 1,
              ),
              const SizedBox(height: 16),
              Text(
                'Please enter the top-up amount manually or choose from the available options below.',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  SizedBox(
                    width: 24,
                    height: 24,
                    child: Checkbox(
                      value: _isManualAmountChecked,
                      onChanged: (bool? value) {
                        setState(() {
                          _isManualAmountChecked = value ?? false;
                        });
                      },
                      fillColor: MaterialStateProperty.resolveWith<Color>(
                        (Set<MaterialState> states) {
                          if (states.contains(MaterialState.selected)) {
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
                  Text(
                    'Enter top-up amount',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[900],
                    ),
                  ),
                ],
              ),
              if (_isManualAmountChecked) ...[
                const SizedBox(height: 16),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: IntrinsicHeight(
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.grey[50],
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(11),
                              bottomLeft: Radius.circular(11),
                            ),
                          ),
                          child: Center(
                            child: Icon(
                              Icons.euro_rounded,
                              size: 22,
                              color: Colors.grey[500],
                            ),
                          ),
                        ),
                        VerticalDivider(
                          color: Colors.grey[300],
                          width: 1,
                          thickness: 1,
                        ),
                        Expanded(
                          child: TextFormField(
                            controller: _amountController,
                            keyboardType: TextInputType.number,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[900],
                            ),
                            decoration: InputDecoration(
                              hintText: '0.00',
                              hintStyle: GoogleFonts.inter(
                                color: Colors.grey[400],
                                fontSize: 16,
                              ),
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(
                                vertical: 12,
                                horizontal: 12,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => InternationalCheckoutScreen(
                            isDataPlan: false,
                            amount: '€${_amountController.text}',
                            isManualTopup: true,
                            planName: 'Top Up',
                            countryFlag: String.fromCharCodes(
                              widget.phoneNumber.isoCode.name.split('').map(
                                    (char) => char.codeUnitAt(0) + 127397,
                                  ),
                            ),
                            phoneNumber: widget.phoneNumber.international,
                            subTotal: _amountController.text,
                            quantity: 1,
                          ),
                        ),
                      );
                    },
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                      backgroundColor: const Color(0xFF05E27E),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Top-up now',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: Divider(
                      color: Colors.grey[300],
                      thickness: 1,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: Container(
                      color: Colors.white,
                      child: Text(
                        'or',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Divider(
                      color: Colors.grey[300],
                      thickness: 1,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
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
                            'Top-up',
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
                            'Plans',
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
              const SizedBox(height: 24),
              _selectedTab == 0
                  ? Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildTopUpCard('5.00'),
                        const SizedBox(height: 16),
                        _buildTopUpCard('10.00'),
                        const SizedBox(height: 16),
                        _buildTopUpCard('15.00'),
                        const SizedBox(height: 16),
                        _buildTopUpCard('20.00'),
                      ],
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildDataPackageCard(
                          planName: 'Plan S',
                          gb: '10 GB',
                          price: '€10.00',
                          dataText: 'Data, Call and Texts',
                          validityText: '30 days validity',
                          minutes: "400",
                          texts: "500",
                          features: [
                            '400 minutes & 500 texts',
                            '4GB/EU Roaming',
                            'eSIM available',
                          ],
                          isPopular: true,
                        ),
                        const SizedBox(height: 20),
                        _buildDataPackageCard(
                          planName: 'Plan Star',
                          gb: '20 GB',
                          price: '€15.00',
                          dataText: 'Data, Call and Texts',
                          validityText: '30 days validity',
                          minutes: "750",
                          texts: "750",
                          features: [
                            '750 minutes & 750 texts',
                            '5GB/EU Roaming',
                            'eSIM available',
                          ],
                        ),
                        const SizedBox(height: 20),
                        _buildDataPackageCard(
                          planName: 'Plan M',
                          gb: '40 GB',
                          price: '€20.00',
                          dataText: 'Data, Call and Texts',
                          validityText: '30 days validity',
                          minutes: "Unlimited",
                          texts: "Unlimited",
                          features: [
                            'Unlimited minutes & texts',
                            '26GB EU Roaming',
                            'eSIM available',
                          ],
                        ),
                        const SizedBox(height: 20),
                        _buildDataPackageCard(
                          planName: 'Plan L',
                          gb: '100 GB',
                          price: '€30.00',
                          dataText: 'Data, Call and Texts',
                          validityText: '30 days validity',
                          minutes: "Unlimited",
                          texts: "Unlimited",
                          features: [
                            'Unlimited minutes & texts',
                            '39GB EU Roaming',
                            'eSIM available',
                          ],
                        ),
                        const SizedBox(height: 20),
                        _buildDataPackageCard(
                          planName: 'Plan XXL',
                          gb: '300 GB',
                          price: '€39.99',
                          dataText: 'Data, Call and Texts',
                          validityText: '30 days validity',
                          minutes: "Unlimited",
                          texts: "Unlimited",
                          features: [
                            'Unlimited minutes & texts',
                            '51GB EU Roaming',
                            'eSIM available',
                          ],
                        ),
                      ],
                    ),
              const SizedBox(height: 50),
            ],
          ),
        ),
      ),
    );
  }
}
