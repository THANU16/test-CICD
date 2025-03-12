import '../home/services/international_topup_checkout.dart';
import '../home/services/topup_checkout_screen.dart';
import './order_details_screen.dart';
import './order_model.dart';
import './orders_singleton.dart';
import '../home/home_page.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final OrdersSingleton _ordersSingleton = OrdersSingleton();

  void _navigateToOrderDetails(Order order) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OrderDetailsScreen(order: order),
      ),
    );
  }

  Widget _buildOrderCard(Order order) {
    Color statusColor;

    switch (order.status.toLowerCase()) {
      case 'completed':
        statusColor = const Color(0xFF05E27E);
        break;
      case 'cancelled':
        statusColor = const Color(0xFFEF4444);
        break;
      default:
        statusColor = const Color(0xFFFFA500);
    }

    String getOrderTitle() {
      if (order.orderType == 'Mobile Top-up') {
        if (order.subType == 'Data Package') {
          return 'Lycamobile - ${order.planName ?? ""}';
        } else {
          return '${order.quantity} x Lycamobile - €${order.planamount}';
        }
      } else if (order.orderType == 'International Top-up') {
        if (order.subType == 'Manual Top-up') {
          return 'Lycamobile Top-up';
        } else if (order.subType == 'Data Package') {
          return 'Lycamobile - ${order.planName ?? ""}';
        } else {
          return '${order.quantity} x Lycamobile - €${order.planamount}';
        }
      } else {
        return 'Lycamobile Top-up';
      }
    }

    void handleSendAgain(Order order) {
      if (order.orderType == 'International Top-up') {
        if (order.subType == 'Data Package') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => InternationalCheckoutScreen(
                isDataPlan: true,
                amount: '€${order.subTotal}',
                planName: order.planName ?? 'Top Up',
                countryFlag: order.countryFlag ?? '',
                phoneNumber: order.phoneNumber ?? '',
                gb: order.gb,
                validity: order.validity,
                minutes: order.minutes,
                texts: order.texts,
                subTotal: order.subTotal,
                quantity: order.quantity,
                isFromOrders: true,
              ),
            ),
          );
        } else if (order.subType == 'Manual Top-up') {
          // International Manual Top-up
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => InternationalCheckoutScreen(
                isDataPlan: false,
                amount: order.subTotal,
                isManualTopup: true,
                planName: 'Top Up',
                countryFlag: order.countryFlag ?? '',
                phoneNumber: order.phoneNumber ?? '',
                subTotal: order.subTotal,
                quantity: order.quantity,
                isFromOrders: true,
              ),
            ),
          );
        } else {
          // International Normal Card Top-up
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => InternationalCheckoutScreen(
                isDataPlan: false,
                isManualTopup: false,
                amount: order.subTotal,
                planName: 'Top Up',
                countryFlag: order.countryFlag ?? '',
                phoneNumber: order.phoneNumber ?? '',
                subTotal: order.subTotal,
                quantity: order.quantity,
                isFromOrders: true,
              ),
            ),
          );
        }
      } else {
        if (order.subType == 'Data Package') {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => CheckoutScreen(
                isDataPlan: true,
                amount: '€${order.subTotal}',
                planName: order.planName ?? '',
                gb: order.gb,
                validity: order.validity,
                minutes: order.minutes,
                texts: order.texts,
                subTotal: order.subTotal,
                quantity: order.quantity,
                isFromOrders: true,
              ),
            ),
          );
        } else {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => CheckoutScreen(
                isDataPlan: false,
                amount: '${order.planamount}',
                planName: 'Top-up',
                subTotal: order.subTotal,
                quantity: order.quantity,
                isFromOrders: true,
              ),
            ),
          );
        }
      }
    }

    if (order.orderType == 'International Top-up') {
      return GestureDetector(
        onTap: () => _navigateToOrderDetails(order),
        child: Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          order.phoneNumber ?? 'N/A',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[900],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          DateFormat('dd MMM yyyy, HH:mm')
                              .format(order.dateTime),
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
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
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          order.status,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: statusColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () => handleSendAgain(order),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 4,
                      ),
                      backgroundColor: const Color(0xFF05E27E),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Send Again',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    } else {
      return GestureDetector(
        onTap: () => _navigateToOrderDetails(order),
        child: Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey[300]!),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  if (order.orderType == 'International Top-up')
                    Text(
                      order.phoneNumber ?? 'N/A',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.grey[900],
                      ),
                    )
                  else
                    Image.asset('images/LycaLogo2.png'),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          getOrderTitle(),
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey[900],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          DateFormat('dd MMM yyyy, HH:mm')
                              .format(order.dateTime),
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
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
              const SizedBox(height: 15),
              Divider(
                height: 1,
                color: Colors.grey[300],
              ),
              const SizedBox(height: 15),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (order.orderType != 'International Top-up')
                    Text(
                      'DELIVERED TO',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.grey[500],
                      ),
                    ),
                  Text(
                    'PAYMENT',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  if (order.orderType != 'International Top-up')
                    Text(
                      order.email ?? 'N/A',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[900],
                      ),
                    ),
                  Text(
                    order.paymentMethod,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[900],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 15),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Status',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: Colors.grey[500],
                        ),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: statusColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          order.status,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: statusColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () => handleSendAgain(order),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 4,
                      ),
                      backgroundColor: const Color(0xFF05E27E),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Send Again',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
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
          'Orders',
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.grey[900],
          ),
        ),
      ),
      body: _ordersSingleton.orders.isEmpty
          ? Center(
              child: Column(
                children: [
                  const Spacer(),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      "Oops! Looks like you haven't made any orders yet. Explore our products and place one now!",
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[500],
                      ),
                    ),
                  ),
                  const Spacer(),
                  Padding(
                    padding: const EdgeInsets.only(
                      left: 16,
                      right: 16,
                      bottom: 32,
                    ),
                    child: SizedBox(
                      width: double.infinity,
                      child: TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const HomePage(),
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
                          'Back to Home',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _ordersSingleton.orders.length,
              itemBuilder: (context, index) {
                return _buildOrderCard(_ordersSingleton.orders[index]);
              },
            ),
    );
  }
}
