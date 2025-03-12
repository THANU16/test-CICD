import './order_model.dart';

class OrdersSingleton {
  static final OrdersSingleton _instance = OrdersSingleton._internal();
  factory OrdersSingleton() => _instance;
  OrdersSingleton._internal();

  final List<Order> _orders = [];

  List<Order> get orders => _orders;

  void addOrder(
      {required String orderType,
      required String subType,
      required String amount,
      required String subTotal,
      required String status,
      String? phoneNumber,
      String? planName,
      String? countryFlag,
      String? gb,
      String? validity,
      String? minutes,
      String? texts,
      required String paymentMethod,
      required String reference,
      String? redeemCode,
      required int quantity,
      String? email,
      String? planamount}) {
    _orders.insert(
      0,
      Order(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        orderType: orderType,
        subType: subType,
        amount: amount,
        subTotal: subTotal,
        status: status,
        dateTime: DateTime.now(),
        phoneNumber: phoneNumber,
        planName: planName,
        countryFlag: countryFlag,
        gb: gb,
        validity: validity,
        minutes: minutes,
        texts: texts,
        paymentMethod: paymentMethod,
        quantity: quantity,
        reference: reference,
        redeemCode: redeemCode,
        email: email,
        planamount: planamount,
      ),
    );
  }
}
