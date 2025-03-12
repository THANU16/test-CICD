import 'package:Bereload/screens/orders/orders_singleton.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:dotted_line/dotted_line.dart';
import 'package:flutter/services.dart';
import './international_topup_payment_status.dart';

class InternationalCheckoutScreen extends StatefulWidget {
  final bool isDataPlan;
  final bool isManualTopup;
  final String amount;
  final String planName;
  final String? gb;
  final String? validity;
  final String? minutes;
  final String? texts;
  final String countryFlag;
  final String phoneNumber;
  final String subTotal;
  final int quantity;
  final bool isFromOrders;

  const InternationalCheckoutScreen({
    super.key,
    required this.isDataPlan,
    required this.amount,
    required this.planName,
    required this.countryFlag,
    required this.phoneNumber,
    this.gb,
    this.validity,
    this.minutes,
    this.texts,
    this.isManualTopup = false,
    required this.subTotal,
    this.isFromOrders = false,
    required this.quantity,
  });

  @override
  State<InternationalCheckoutScreen> createState() =>
      _InternationalCheckoutScreenState();
}

class _InternationalCheckoutScreenState
    extends State<InternationalCheckoutScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController cardNumberController = TextEditingController();
  final TextEditingController expiryController = TextEditingController();
  final TextEditingController cvvController = TextEditingController();
  final TextEditingController houseController = TextEditingController();
  final TextEditingController streetController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController stateController = TextEditingController();
  final TextEditingController countryController = TextEditingController();
  final TextEditingController postalController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  bool isManualTopup = false;

  bool termsAccepted = false;
  late int quantity;
  String selectedPaymentMethod = 'visa';
  bool isCardDetailsConfirmed = false;

  @override
  void initState() {
    super.initState();
    if (!widget.isDataPlan) {
      _amountController.text = widget.amount.replaceAll('€', '');
      isManualTopup = widget.isManualTopup;
    }
    quantity = widget.isFromOrders ? widget.quantity : 1;
  }

  @override
  void dispose() {
    nameController.dispose();
    cardNumberController.dispose();
    expiryController.dispose();
    cvvController.dispose();
    houseController.dispose();
    streetController.dispose();
    cityController.dispose();
    stateController.dispose();
    countryController.dispose();
    postalController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  String? validateCardNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Card number is required';
    }
    if (value.replaceAll(' ', '').length != 16) {
      return 'Please enter a valid 16-digit card number';
    }
    return null;
  }

  String? validateExpiryDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Expiry date is required';
    }
    if (!RegExp(r'^\d{2}/\d{2}$').hasMatch(value)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    return null;
  }

  String? validateCVV(String? value) {
    if (value == null || value.isEmpty) {
      return 'CVV is required';
    }
    if (value.length < 3 || value.length > 4) {
      return 'Please enter a valid CVV';
    }
    return null;
  }

  String? validateRequired(String? value) {
    if (value == null || value.isEmpty) {
      return 'This field is required';
    }
    return null;
  }

  String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
      return 'Please enter a valid email';
    }
    return null;
  }

  double parseAmount(String amount) {
    try {
      String cleanAmount = amount.replaceAll('€', '').trim();
      if (cleanAmount.isEmpty) return 0.0;
      return double.parse(cleanAmount);
    } catch (e) {
      debugPrint('Error parsing amount: $amount');
      return 0.0;
    }
  }

  void _showCardDetailsForm(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      builder: (BuildContext context) {
        return FractionallySizedBox(
          heightFactor: 0.9,
          child: _buildCardDetailsSection(),
        );
      },
    );
  }

  void _showPaymentMethodDrawer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(32),
          topRight: Radius.circular(32),
        ),
      ),
      builder: (BuildContext context) {
        return FractionallySizedBox(
          heightFactor: 0.50,
          child: Padding(
            padding: const EdgeInsets.only(bottom: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                  child: Stack(
                    children: [
                      Positioned(
                        right: 0,
                        top: 0,
                        child: GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.grey[100],
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
                      Center(
                        child: Text(
                          'Payment method',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[900],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Divider(
                    color: Colors.grey[300],
                    thickness: 1,
                  ),
                ),
                const SizedBox(height: 24),
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(children: [
                      ...['visa', 'master', 'bancontact', 'paypal']
                          .map((method) {
                        bool isSelected = method == selectedPaymentMethod;
                        return GestureDetector(
                          onTap: () {
                            if (method == 'visa' || method == 'master') {
                              setState(() {
                                if (isCardDetailsConfirmed) {
                                  selectedPaymentMethod = method;
                                }
                              });
                              Navigator.pop(context);
                              if (!isCardDetailsConfirmed) {
                                _showCardDetailsForm(context);
                              }
                            } else {
                              //  Bancontact and PayPal
                              setState(() {
                                selectedPaymentMethod = method;
                                isCardDetailsConfirmed = false;
                              });
                              Navigator.pop(context);
                              // logic for Bancontact and PayPal
                            }
                          },
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: isSelected
                                    ? const Color(0xFF05E27E)
                                    : Colors.grey[300]!,
                                width: isSelected ? 2 : 1,
                              ),
                              borderRadius: BorderRadius.circular(18),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(12),
                              child: Row(
                                children: [
                                  Image.asset(
                                    'images/$method.png',
                                    height: 24,
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    method[0].toUpperCase() +
                                        method.substring(1),
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
                        );
                      }).toList(),
                    ]))
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildCardDetailsSection() {
    return StatefulBuilder(
      builder: (BuildContext context, StateSetter setState) {
        return Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 0),
                child: Stack(
                  children: [
                    Positioned(
                      right: 0,
                      top: 0,
                      child: GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
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
                    Center(
                      child: Text(
                        'Enter card details',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[900],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Divider(
                  color: Colors.grey[300],
                  thickness: 1,
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 13, vertical: 16),
                          child: TextFormField(
                            controller: nameController,
                            validator: validateRequired,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[900],
                            ),
                            decoration: InputDecoration(
                              hintText: 'Name as on card',
                              hintStyle: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.grey[500],
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 13, vertical: 16),
                          child: TextFormField(
                            controller: cardNumberController,
                            validator: validateCardNumber,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[900],
                            ),
                            decoration: InputDecoration(
                              hintText: 'Card number',
                              hintStyle: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.grey[500],
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                            keyboardType: TextInputType.number,
                            inputFormatters: [
                              FilteringTextInputFormatter.digitsOnly,
                              LengthLimitingTextInputFormatter(16),
                              _CardNumberInputFormatter(),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              flex: 3,
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: IntrinsicHeight(
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 14),
                                        decoration: BoxDecoration(
                                          color: Colors.grey[100],
                                          borderRadius: BorderRadius.only(
                                            topLeft: Radius.circular(11),
                                            bottomLeft: Radius.circular(11),
                                          ),
                                        ),
                                        child: Center(
                                          child: Icon(
                                            Icons.calendar_today,
                                            size: 22,
                                            color: Colors.grey[400],
                                          ),
                                        ),
                                      ),
                                      VerticalDivider(
                                        color: Colors.grey[300],
                                        width: 1,
                                        thickness: 1,
                                      ),
                                      Expanded(
                                          child: Padding(
                                        padding: const EdgeInsets.symmetric(
                                            vertical: 16),
                                        child: TextFormField(
                                          controller: expiryController,
                                          validator: validateExpiryDate,
                                          style: GoogleFonts.inter(
                                            fontSize: 16,
                                            color: Colors.grey[900],
                                          ),
                                          decoration: InputDecoration(
                                            hintText: 'Expiry date',
                                            hintStyle: GoogleFonts.inter(
                                              fontSize: 16,
                                              color: Colors.grey[500],
                                            ),
                                            border: InputBorder.none,
                                            isDense: true,
                                            contentPadding:
                                                EdgeInsets.symmetric(
                                                    horizontal: 12),
                                          ),
                                          keyboardType: TextInputType.number,
                                          inputFormatters: [
                                            FilteringTextInputFormatter
                                                .digitsOnly,
                                            LengthLimitingTextInputFormatter(4),
                                            _ExpiryDateInputFormatter(),
                                          ],
                                          onChanged: (value) {
                                            // Optional: Add any additional validation here
                                          },
                                        ),
                                      )),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              flex: 2,
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 13, vertical: 16),
                                child: TextFormField(
                                  controller: cvvController,
                                  validator: validateCVV,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey[900],
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'CVV',
                                    hintStyle: GoogleFonts.inter(
                                      fontSize: 16,
                                      color: Colors.grey[500],
                                    ),
                                    border: InputBorder.none,
                                    isDense: true,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                  keyboardType: TextInputType.number,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Billing address',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[900],
                          ),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 13, vertical: 16),
                          child: TextFormField(
                            controller: houseController,
                            validator: validateRequired,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[900],
                            ),
                            decoration: InputDecoration(
                              hintText: 'House/apt/extn number',
                              hintStyle: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.grey[500],
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 13, vertical: 16),
                          child: TextFormField(
                            controller: streetController,
                            validator: validateRequired,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              color: Colors.grey[900],
                            ),
                            decoration: InputDecoration(
                              hintText: 'Street name',
                              hintStyle: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.grey[500],
                              ),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 13, vertical: 16),
                                child: TextFormField(
                                  controller: cityController,
                                  validator: validateRequired,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey[900],
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'City',
                                    hintStyle: GoogleFonts.inter(
                                      fontSize: 16,
                                      color: Colors.grey[500],
                                    ),
                                    border: InputBorder.none,
                                    isDense: true,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 13, vertical: 16),
                                child: TextFormField(
                                  controller: stateController,
                                  validator: validateRequired,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey[900],
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'State',
                                    hintStyle: GoogleFonts.inter(
                                      fontSize: 16,
                                      color: Colors.grey[500],
                                    ),
                                    border: InputBorder.none,
                                    isDense: true,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 13, vertical: 16),
                                child: TextFormField(
                                  controller: countryController,
                                  validator: validateRequired,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey[900],
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Country',
                                    hintStyle: GoogleFonts.inter(
                                      fontSize: 16,
                                      color: Colors.grey[500],
                                    ),
                                    border: InputBorder.none,
                                    isDense: true,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey[300]!),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 13, vertical: 16),
                                child: TextFormField(
                                  controller: postalController,
                                  validator: validateRequired,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    color: Colors.grey[900],
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Postal code',
                                    hintStyle: GoogleFonts.inter(
                                      fontSize: 16,
                                      color: Colors.grey[500],
                                    ),
                                    border: InputBorder.none,
                                    isDense: true,
                                    contentPadding: EdgeInsets.zero,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            SizedBox(
                              width: 24,
                              height: 24,
                              child: Checkbox(
                                value: termsAccepted,
                                onChanged: (bool? value) {
                                  setState(() {
                                    termsAccepted = value ?? false;
                                  });
                                },
                                fillColor:
                                    MaterialStateProperty.resolveWith<Color>(
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
                                        decoration: TextDecoration.underline,
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
                            onPressed: termsAccepted
                                ? () {
                                    if (_formKey.currentState!.validate()) {
                                      setState(() {
                                        isCardDetailsConfirmed = true;
                                      });
                                      Navigator.pop(context);
                                      this.setState(() {});
                                    }
                                  }
                                : null,
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.all(16),
                              backgroundColor: termsAccepted
                                  ? const Color(0xFF05E27E)
                                  : Colors.grey[300],
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: Text(
                              'Confirm card details',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: termsAccepted
                                    ? Colors.black
                                    : Colors.grey[500],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 300),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
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
          'Checkout',
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
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 30),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Image.asset(
                          'images/LycaLogo2.png',
                          height: 40,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                widget.isDataPlan
                                    ? 'Lycamobile - ${widget.planName}'
                                    : widget.isManualTopup
                                        ? 'Lycamobile - Top-up'
                                        : 'Lycamobile - €${(double.parse(widget.subTotal) / widget.quantity).toStringAsFixed(2)}',
                                style: GoogleFonts.inter(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.grey[900],
                                ),
                              ),
                              if (widget.isDataPlan || widget.isManualTopup)
                                Text(
                                  widget.amount,
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey[900],
                                  ),
                                )
                              else
                                Row(
                                  children: [
                                    Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: IconButton(
                                        onPressed: () {
                                          if (quantity > 1) {
                                            setState(() => quantity--);
                                          }
                                        },
                                        icon: const Icon(Icons.remove),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                        iconSize: 16,
                                        color: Colors.black,
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12),
                                      child: Text(
                                        quantity.toString(),
                                        style: GoogleFonts.inter(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.grey[900],
                                        ),
                                      ),
                                    ),
                                    Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[200],
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: IconButton(
                                        onPressed: () {
                                          setState(() => quantity++);
                                        },
                                        icon: const Icon(Icons.add),
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                        iconSize: 16,
                                        color: Colors.black,
                                      ),
                                    ),
                                  ],
                                )
                            ],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(
                      height: widget.isDataPlan ? 10 : 20,
                    ),
                    if (widget.isDataPlan) ...[
                      Text(
                        '${widget.gb} Data / ${widget.validity}',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${widget.minutes} minutes & ${widget.texts} texts',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                    SizedBox(
                      height: widget.isDataPlan ? 10 : 0,
                    ),
                    Divider(
                      color: Colors.grey[300],
                      thickness: 1,
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Top-up to',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[700],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: Colors.grey[300]!,
                          width: 1,
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.all(8),
                      child: Row(
                        children: [
                          Text(
                            widget.countryFlag,
                            style: const TextStyle(
                              fontSize: 24,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            widget.phoneNumber,
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                              color: Colors.grey[900],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              FaIcon(
                                FontAwesomeIcons.paperPlane,
                                size: 18,
                                color: Colors.grey[500],
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Instant delivery',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey[500],
                                ),
                              ),
                            ],
                          ),
                          Row(
                            children: [
                              FaIcon(
                                FontAwesomeIcons.shieldHalved,
                                size: 18,
                                color: Colors.grey[500],
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Safe & secure',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey[500],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Payment method',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[700],
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            _showPaymentMethodDrawer(context);
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 2),
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
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        Image.asset(
                          'images/$selectedPaymentMethod.png',
                          height: 24,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          selectedPaymentMethod[0].toUpperCase() +
                              selectedPaymentMethod.substring(1),
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
                    const SizedBox(height: 20),
                    Text(
                      'Order summary',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[700],
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Subtotal',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                        ),
                        Text(
                          '€${widget.isManualTopup ? parseAmount(widget.amount).toStringAsFixed(2) : ((parseAmount(widget.subTotal) / widget.quantity) * quantity).toStringAsFixed(2)}',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[900],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Service fee',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                        ),
                        Text(
                          '€1.50',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.grey[900],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Discount',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.green[600],
                          ),
                        ),
                        Text(
                          '- €1.00',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.green[600],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    DottedLine(
                      direction: Axis.horizontal,
                      lineLength: double.infinity,
                      lineThickness: 1.0,
                      dashLength: 8.0,
                      dashColor: Colors.grey[300]!,
                      dashGapLength: 3.0,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Total',
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.grey[900],
                          ),
                        ),
                        Text(
                          '€${(widget.isManualTopup || widget.isDataPlan) ? (parseAmount(widget.amount) + 1.50 - 1.00).toStringAsFixed(2) : (((parseAmount(widget.subTotal) / widget.quantity) * quantity) + 1.50 - 1.00).toStringAsFixed(2)}',
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            color: Colors.grey[900],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
          SizedBox(
            width: double.infinity,
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 22, 16, 30),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(32),
                  topRight: Radius.circular(32),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withAlpha(13),
                    spreadRadius: 0,
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: TextButton(
                onPressed: () {
                  final totalAmount = (widget.isManualTopup ||
                          widget.isDataPlan)
                      ? (parseAmount(widget.amount) + 1.50 - 1.00)
                          .toStringAsFixed(2)
                      : (parseAmount(widget.amount) * quantity + 1.50 - 1.00)
                          .toStringAsFixed(2);

                  final subTotal = widget.isManualTopup
                      ? parseAmount(widget.amount).toStringAsFixed(2)
                      : (parseAmount(widget.amount) * quantity)
                          .toStringAsFixed(2);

                  OrdersSingleton().addOrder(
                    orderType: 'International Top-up',
                    subType: widget.isDataPlan
                        ? 'Data Package'
                        : (widget.isManualTopup
                            ? 'Manual Top-up'
                            : 'Normal Top-up'),
                    amount: totalAmount,
                    subTotal: subTotal,
                    status: 'Completed',
                    phoneNumber: widget.phoneNumber,
                    countryFlag: widget.countryFlag,
                    planName: widget.planName,
                    gb: widget.gb,
                    validity: widget.validity,
                    minutes: widget.minutes,
                    texts: widget.texts,
                    paymentMethod: selectedPaymentMethod[0].toUpperCase() +
                        selectedPaymentMethod.substring(1),
                    reference: 'ITU${DateTime.now().millisecondsSinceEpoch}',
                    quantity: quantity,
                  );

                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => InternationalPaymentSuccessScreen(
                        amount: totalAmount,
                        phoneNumber: widget.phoneNumber,
                        planName: widget.planName,
                        paymentMethod: selectedPaymentMethod[0].toUpperCase() +
                            selectedPaymentMethod.substring(1),
                        countryFlag: widget.countryFlag,
                        isDataPlan: widget.isDataPlan,
                        onDone: () {
                          Navigator.of(context)
                              .popUntil((route) => route.isFirst);
                        },
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
                  'Checkout',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}

class _ExpiryDateInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    var text = newValue.text;

    if (newValue.selection.baseOffset == 0) {
      return newValue;
    }

    var buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      var nonZeroIndex = i + 1;
      if (nonZeroIndex % 2 == 0 && nonZeroIndex != text.length) {
        buffer.write('/');
      }
    }

    var string = buffer.toString();
    return newValue.copyWith(
      text: string,
      selection: TextSelection.collapsed(offset: string.length),
    );
  }
}

class _CardNumberInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    var text = newValue.text;

    if (newValue.selection.baseOffset == 0) {
      return newValue;
    }

    text = text.replaceAll(' ', '');

    var buffer = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      buffer.write(text[i]);
      var nonZeroIndex = i + 1;
      if (nonZeroIndex % 4 == 0 && nonZeroIndex != text.length) {
        buffer.write(' ');
      }
    }

    var string = buffer.toString();
    return newValue.copyWith(
      text: string,
      selection: TextSelection.collapsed(offset: string.length),
    );
  }
}
