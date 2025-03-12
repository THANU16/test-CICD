import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/services.dart';

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

class CardDetails {
  final String cardHolderName;
  final String cardNumber;
  final String expiryDate;
  final String cvv;

  CardDetails({
    required this.cardHolderName,
    required this.cardNumber,
    required this.expiryDate,
    required this.cvv,
  });
}

class ManageCardScreen extends StatefulWidget {
  const ManageCardScreen({super.key});

  @override
  State<ManageCardScreen> createState() => _ManageCardScreenState();
}

class _ManageCardScreenState extends State<ManageCardScreen> {
  final _formKey = GlobalKey<FormState>();
  final nameController = TextEditingController();
  final cardNumberController = TextEditingController();
  final expiryController = TextEditingController();
  final cvvController = TextEditingController();
  final houseController = TextEditingController();
  final streetController = TextEditingController();
  final cityController = TextEditingController();
  final stateController = TextEditingController();
  final countryController = TextEditingController();
  final postalController = TextEditingController();
  bool termsAccepted = false;
  bool isCardDetailsConfirmed = false;
  String _selectedCard = 'xxxx xxxx xxxx 1234';

  Map<String, CardDetails> cardDetailsMap = {
    'xxxx xxxx xxxx 1234': CardDetails(
      cardHolderName: 'John Doe',
      cardNumber: '4111111111111234',
      expiryDate: '12/25',
      cvv: '123',
    ),
    'xxxx xxxx xxxx 5678': CardDetails(
      cardHolderName: 'Jane Smith',
      cardNumber: '4222222222225678',
      expiryDate: '03/26',
      cvv: '456',
    ),
    'xxxx xxxx xxxx 3456': CardDetails(
      cardHolderName: 'Mike Johnson',
      cardNumber: '4333333333333456',
      expiryDate: '09/24',
      cvv: '789',
    ),
  };

  String? validateRequired(String? value) {
    if (value == null || value.isEmpty) {
      return 'This field is required';
    }
    return null;
  }

  String? validateCardNumber(String? value) {
    if (value == null || value.isEmpty) {
      return 'Card number is required';
    }
    if (value.replaceAll(' ', '').length != 16) {
      return 'Invalid card number';
    }
    return null;
  }

  String? validateExpiryDate(String? value) {
    if (value == null || value.isEmpty) {
      return 'Expiry date is required';
    }
    if (!value.contains('/') || value.length != 5) {
      return 'Invalid expiry date';
    }
    return null;
  }

  String? validateCVV(String? value) {
    if (value == null || value.isEmpty) {
      return 'CVV is required';
    }
    if (value.length < 3 || value.length > 4) {
      return 'Invalid CVV';
    }
    return null;
  }

  Widget _buildCardDetailsDrawer(String cardNumber) {
    final cardDetails = cardDetailsMap[cardNumber]!;

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
                        'Card Details',
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
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 13, vertical: 16),
                  child: TextFormField(
                    controller:
                        TextEditingController(text: cardDetails.cardHolderName),
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: Colors.grey[900],
                    ),
                    decoration: InputDecoration(
                      hintText: 'Card holder name',
                      hintStyle: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.grey[500],
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 13, vertical: 16),
                  child: TextFormField(
                    controller:
                        TextEditingController(text: cardDetails.cardNumber),
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: Colors.grey[900],
                    ),
                    decoration: InputDecoration(
                      hintText: 'Card number',
                      hintStyle: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.grey[500],
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
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
                          controller: TextEditingController(
                              text: cardDetails.expiryDate),
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.grey[900],
                          ),
                          decoration: InputDecoration(
                            hintText: 'Expiry date',
                            hintStyle: GoogleFonts.inter(
                              fontSize: 14,
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
                          controller:
                              TextEditingController(text: cardDetails.cvv),
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.grey[900],
                          ),
                          decoration: InputDecoration(
                            hintText: 'CVV',
                            hintStyle: GoogleFonts.inter(
                              fontSize: 14,
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
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red[500],
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () {},
                        child: Text(
                          'Remove card',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF05E27E),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        child: Text(
                          'Update card',
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
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCardDetailsSection() {
    return StatefulBuilder(
      builder: (BuildContext context, StateSetter bottomSheetSetState) {
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
                      top: -8,
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
              const SizedBox(height: 12),
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
                                          onChanged: (value) {},
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
                                  bottomSheetSetState(() {
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
                                      final String fullCardNumber =
                                          cardNumberController.text
                                              .replaceAll(' ', '');
                                      final String maskedCardNumber =
                                          'xxxx xxxx xxxx ${fullCardNumber.substring(fullCardNumber.length - 4)}';

                                      setState(() {
                                        cardDetailsMap[maskedCardNumber] =
                                            CardDetails(
                                          cardHolderName: nameController.text,
                                          cardNumber: fullCardNumber,
                                          expiryDate: expiryController.text,
                                          cvv: cvvController.text,
                                        );
                                        _selectedCard = maskedCardNumber;
                                      });

                                      nameController.clear();
                                      cardNumberController.clear();
                                      expiryController.clear();
                                      cvvController.clear();
                                      houseController.clear();
                                      streetController.clear();
                                      cityController.clear();
                                      stateController.clear();
                                      countryController.clear();
                                      postalController.clear();

                                      Navigator.pop(context);
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
                        const SizedBox(height: 340),
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
          'Manage cards',
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
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ...cardDetailsMap.keys
                .map((maskedCardNumber) => _buildCardOption(maskedCardNumber)),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF05E27E),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  disabledBackgroundColor: Colors.grey[300],
                ),
                onPressed: () {
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
                },
                child: Text(
                  'Add new card',
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
    );
  }

  Widget _buildCardOption(String cardNumber) {
    final isSelected = _selectedCard == cardNumber;
    return GestureDetector(
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected ? const Color(0xFF05E27E) : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: RadioListTile(
          title: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      cardNumber,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[900],
                      ),
                    ),
                  ],
                ),
              ),
              Image.asset(
                'images/visa.png',
                width: 40,
                height: 24,
                fit: BoxFit.contain,
              ),
            ],
          ),
          value: cardNumber,
          groupValue: _selectedCard,
          activeColor: const Color(0xFF05E27E),
          onChanged: (String? value) {
            if (value != null) {
              setState(() {
                _selectedCard = value;
              });
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
                  return Padding(
                    padding: EdgeInsets.only(
                      bottom: MediaQuery.of(context).viewInsets.bottom,
                    ),
                    child: Container(
                      constraints: BoxConstraints(
                        maxHeight: MediaQuery.of(context).size.height * 0.85,
                        minHeight: MediaQuery.of(context).size.height * 0.5,
                      ),
                      child: _buildCardDetailsDrawer(value),
                    ),
                  );
                },
              );
            }
          },
          contentPadding: const EdgeInsets.symmetric(horizontal: 16),
        ),
      ),
    );
  }
}
