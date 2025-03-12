import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:dotted_border/dotted_border.dart';
import 'order_model.dart';

class OrderDetailsScreen extends StatelessWidget {
  final Order order;

  const OrderDetailsScreen({super.key, required this.order});

  Widget _buildDetailRow(String label, String value, {Widget? customValue}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
          customValue ??
              Text(
                value,
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey[900],
                ),
              ),
        ],
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color statusColor;
    switch (status.toLowerCase()) {
      case 'completed':
        statusColor = const Color(0xFF05E27E);
        break;
      case 'cancelled':
        statusColor = const Color(0xFFEF4444);
        break;
      default:
        statusColor = const Color(0xFFFFA500);
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 12,
        vertical: 6,
      ),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        status,
        style: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: statusColor,
        ),
      ),
    );
  }

  Widget _buildRedeemCodeCard(String code, IconData icon) {
    return DottedBorder(
      borderType: BorderType.RRect,
      radius: const Radius.circular(12),
      color: Colors.grey[500]!,
      strokeWidth: 3,
      dashPattern: const [8, 4],
      padding: EdgeInsets.zero,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          color: Colors.grey[100]!,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              code,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[700]!,
              ),
            ),
            Icon(
              icon,
              size: 24,
              color: Colors.grey[500]!,
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildRedeemCodeSection() {
    if (order.redeemCode == null) return [];

    final codes = order.redeemCode!.split('|');

    List<Widget> widgets = [
      const SizedBox(height: 16),
      Divider(height: 1, color: Colors.grey[300]),
      const SizedBox(height: 16),
      Text(
        'Redeem code${codes.length > 1 ? 's' : ''}',
        style: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: Colors.grey[700],
        ),
      ),
      const SizedBox(height: 12),
    ];

    for (var code in codes) {
      widgets.addAll([
        _buildRedeemCodeCard(code, Icons.phone),
        const SizedBox(height: 12),
        _buildRedeemCodeCard(code, Icons.copy),
        if (code != codes.last) const SizedBox(height: 24),
      ]);
    }

    widgets.add(const SizedBox(height: 24));
    return widgets;
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
          'Order Details',
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
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Image.asset('images/LycaLogo2.png'),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      order.orderType == 'Mobile Top-up'
                          ? order.subType == 'Data Package'
                              ? 'Lycamobile - ${order.planName ?? ""}'
                              : '${order.quantity} x Lycamobile - €${order.planamount}'
                          : order.orderType == 'International Top-up'
                              ? order.subType == 'Manual Top-up'
                                  ? 'Lycamobile Top-up'
                                  : order.subType == 'Data Package'
                                      ? 'Lycamobile - ${order.planName ?? ""}'
                                      : '${order.quantity} x Lycamobile - €${(double.parse(order.subTotal) / order.quantity).toStringAsFixed(2)}'
                              : 'Lycamobile Top-up',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[900],
                      ),
                    ),
                  ),
                  Text(
                    '€${order.amount}',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[900],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              if (order.subType == 'Data Package') ...[
                Text(
                  '${order.gb} Data/ ${order.validity}',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey[500],
                  ),
                ),
                Text(
                  '${order.minutes} minutes & ${order.texts} texts',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey[500],
                  ),
                ),
              ],
              const SizedBox(height: 16),
              Divider(height: 1, color: Colors.grey[300]),
              const SizedBox(height: 16),
              _buildDetailRow(
                'Date & Time',
                DateFormat('MMM dd, yyyy • HH:mm').format(order.dateTime),
              ),
              _buildDetailRow('Reference', order.reference),
              _buildDetailRow('Payment Method', order.paymentMethod),
              _buildDetailRow(
                'Status',
                '',
                customValue: _buildStatusBadge(order.status),
              ),
              if (order.orderType != 'Data Package')
                _buildDetailRow('Quantity', order.quantity.toString()),
              _buildDetailRow('Purchased', '€${order.amount}'),
              _buildDetailRow(
                'Delivered to',
                order.orderType == 'Mobile Top-up'
                    ? order.email ?? 'N/A'
                    : order.phoneNumber ?? 'N/A',
              ),
              if (order.redeemCode != null) ...[
                const SizedBox(height: 16),
                const SizedBox(height: 12),
                ..._buildRedeemCodeSection(),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
