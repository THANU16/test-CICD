export 'mobile_topup.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import './topup_checkout_screen.dart';

class MobileTopupScreen extends StatefulWidget {
  const MobileTopupScreen({super.key});

  @override
  State<MobileTopupScreen> createState() => _MobileTopupScreenState();
}

class _MobileTopupScreenState extends State<MobileTopupScreen> {
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
    _searchController.dispose();
    super.dispose();
  }

  static const redeemInstructions = [
    {
      'title': 'Purchase a Plan',
      'description':
          'Choose your desired plan from the available options and complete the purchase.',
    },
    {
      'title': 'Receive your Redeem Code',
      'description':
          'Check your email for the unique redemption code provided after your purchase.',
    },
    {
      'title': 'Redeem your Code',
      'description':
          'Once the code is validated, your plan will be activated instantly. You\'ll receive a confirmation message via email or SMS',
    },
  ];

  Widget _buildTopUpCard(String amount) {
    return Stack(
      children: [
        Container(
          height: 120,
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
                  top: -50,
                  right: -55,
                  child: Container(
                    width: 190,
                    height: 190,
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(190, 245, 245, 245),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                Positioned(
                  top: -38,
                  right: -38,
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '€$amount',
                        style: GoogleFonts.inter(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[900],
                        ),
                      ),
                      Align(
                        alignment: Alignment.bottomRight,
                        child: GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => CheckoutScreen(
                                  isDataPlan: false,
                                  amount: amount,
                                  planName: 'Top-up',
                                  subTotal: amount,
                                  quantity: 1
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
                              'Top-up now',
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Colors.grey[900],
                              ),
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
        ),
        Positioned(
          left: 1,
          top: 16,
          child: Container(
            width: 4.5,
            height: 30,
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
    );
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
                              builder: (context) => CheckoutScreen(
                                isDataPlan: true,
                                amount: price,
                                subTotal: price,
                                planName: planName,
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
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                  child: Image.asset(
                'images/LycaLogo.png',
                cacheWidth: 300,
                cacheHeight: 300,
              )),
              const SizedBox(height: 8),
              Center(
                child: Text(
                  'Lycamobile Recharge',
                  style: GoogleFonts.inter(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[900],
                  ),
                ),
              ),
              Center(
                child: Text(
                  'Mobile Top-up',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                'Mobile Top-up',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  SizedBox(
                    width: (MediaQuery.of(context).size.width - 48) / 2,
                    child: _buildTopUpCard('5.00'),
                  ),
                  SizedBox(
                    width: (MediaQuery.of(context).size.width - 48) / 2,
                    child: _buildTopUpCard('10.00'),
                  ),
                  SizedBox(
                    width: (MediaQuery.of(context).size.width - 48) / 2,
                    child: _buildTopUpCard('15.00'),
                  ),
                  SizedBox(
                    width: (MediaQuery.of(context).size.width - 48) / 2,
                    child: _buildTopUpCard('20.00'),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              Text(
                '30 Days - Monthly Plans',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 16),
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
                  isPopular: true),
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
              const SizedBox(height: 32),
              Text(
                'Redeem Instructions',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 16),
              Column(
                children: [
                  ...redeemInstructions.map((instruction) => Column(
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              FaIcon(
                                FontAwesomeIcons.check,
                                color: const Color(0xFF05E27E),
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      instruction['title']!,
                                      style: GoogleFonts.inter(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      instruction['description']!,
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        color: Colors.grey[500],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          if (instruction != redeemInstructions.last)
                            const SizedBox(height: 16),
                        ],
                      )),
                ],
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  'For assistance, contact our customer support team anytime.',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Divider(
                color: Colors.grey[400],
                thickness: 1,
              ),
              const SizedBox(height: 24),
              Text(
                'Terms and Conditions',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[900],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Lyca Mobile has established itself as a go-to choice for affordable mobile services in Belgium, offering flexible prepaid options that cater to diverse communication needs. Whether you\'re looking to recharge Lyca Mobile Belgium for yourself or send a Lyca recharge to loved ones, the process is simple and convenient.',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.grey[500],
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'For residents, a Lyca Mobile top-up provides an easy way to stay connected locally and internationally without long-term commitments. Students, expatriates, and frequent travelers particularly appreciate the ability to control spending while enjoying reliable coverage.',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.grey[500],
                ),
              ),
              const SizedBox(height: 16),
              Divider(
                color: Colors.grey[400],
                thickness: 1,
              ),
              const SizedBox(height: 32),
              GestureDetector(
                onTap: () async {
                  final Uri url =
                      Uri.parse('https://www.lycamobile.be/en/termscondition/');
                  if (await canLaunchUrl(url)) {
                    await launchUrl(url);
                  }
                },
                child: RichText(
                  text: TextSpan(
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.grey[500],
                    ),
                    children: [
                      const TextSpan(
                        text:
                            'By using this service, you consent to the terms and conditions of Lycamobile. To view these, please visit ',
                      ),
                      TextSpan(
                        text: 'https://www.lycamobile.be/en/termscondition/',
                        style: const TextStyle(
                          decoration: TextDecoration.underline,
                        ),
                      ),
                      const TextSpan(text: '.'),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }
}
