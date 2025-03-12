import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:phone_form_field/phone_form_field.dart';
import 'package:flutter_contacts/flutter_contacts.dart';
import './internatonal_topup_plan.dart';

class InternationalTopupScreen extends StatefulWidget {
  const InternationalTopupScreen({super.key});

  @override
  State<InternationalTopupScreen> createState() =>
      _InternationalTopupScreenState();
}

class _InternationalTopupScreenState extends State<InternationalTopupScreen> {
  late final phoneController =
      PhoneController(initialValue: PhoneNumber(isoCode: IsoCode.BE, nsn: ''));

  bool _isValidPhone = false;

  @override
  void initState() {
    super.initState();
    phoneController.addListener(_updatePhoneValidation);
    PhoneFormField.preloadFlags();
  }

  void _updatePhoneValidation() {
    if (mounted) {
      setState(() {
        _isValidPhone = phoneController.value.isValid() &&
            phoneController.value.nsn.isNotEmpty;
      });
    }
  }

  @override
  void dispose() {
    phoneController.removeListener(_updatePhoneValidation);
    phoneController.dispose();
    super.dispose();
  }

  Future<void> _pickContact() async {
    try {
      final hasPermission =
          await FlutterContacts.requestPermission(readonly: true);
      if (!hasPermission) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Contacts permission is required')),
          );
        }
        return;
      }

      final contact = await FlutterContacts.openExternalPick();
      if (contact != null) {
        final fullContact = await FlutterContacts.getContact(contact.id);
        if (fullContact != null && fullContact.phones.isNotEmpty) {
          String phoneNumber = fullContact.phones.first.number;
          phoneNumber = phoneNumber.replaceAll(RegExp(r'[^\d+]'), '');

          if (mounted) {
            try {
              phoneController.value = PhoneNumber.parse(phoneNumber);
              _updatePhoneValidation();
            } catch (e) {
              debugPrint('Error parsing phone number: $e');
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Invalid mobile number format')),
                );
              }
            }
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                  content: Text('Selected contact has no mobile number')),
            );
          }
        }
      }
    } catch (e) {
      debugPrint('Error picking contact: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking contact: ${e.toString()}')),
        );
      }
    }
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
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const SizedBox(height: 30),
            Text(
              'Enter the mobile number you want to top-up',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[900],
              ),
            ),
            const SizedBox(height: 12),
            PhoneFormField(
              key: const Key('phone-field'),
              controller: phoneController,
              isCountrySelectionEnabled: true,
              isCountryButtonPersistent: true,
              countryButtonStyle: const CountryButtonStyle(),
              decoration: InputDecoration(
                hintText: 'Enter mobile number',
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
                if (!phone.isValid()) {
                  return 'Please enter a valid mobile number';
                }
                return null;
              },
              keyboardType: TextInputType.phone,
              autocorrect: true,
              enabled: true,
              autovalidateMode: AutovalidateMode.onUserInteraction,
              onChanged: (PhoneNumber? number) {
                if (number != null) {
                  setState(() {
                    _isValidPhone = number.isValid() && number.nsn.isNotEmpty;
                  });
                }
              },
            ),
            const Spacer(),
            GestureDetector(
              onTap: _pickContact,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Text(
                  'Pick from your contacts',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey[500],
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            SizedBox(
              width: double.infinity,
              child: TextButton(
                onPressed: _isValidPhone
                    ? () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => InternationalTopupPlanScreen(
                              phoneNumber: phoneController.value,
                            ),
                          ),
                        );
                      }
                    : null,
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.all(16),
                  backgroundColor: const Color(0xFF05E27E),
                  disabledBackgroundColor: Colors.grey[300],
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
        ),
      ),
    );
  }
}
