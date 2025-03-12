class Order {
  final String id;
  final String orderType; // 'Mobile Top-up' or 'International Top-up'
  final String subType; // 'Normal Top-up', 'Data Package', 'Manual Top-up'
  final String amount;
  final String subTotal;
  final String? planamount;
  final String status;
  final DateTime dateTime;
  final String? phoneNumber;
  final String? planName;
  final String? countryFlag;
  final String? gb;
  final String? validity;
  final String? minutes;
  final String? texts;
  final String paymentMethod;
  final String reference;
  final String? redeemCode;
  final int quantity;
  final String? email;

  Order(
      {required this.id,
      required this.orderType,
      required this.subType,
      required this.amount,
      required this.subTotal,
      required this.status,
      required this.dateTime,
      this.phoneNumber,
      this.planName,
      this.countryFlag,
      this.gb,
      this.validity,
      this.minutes,
      this.texts,
      required this.paymentMethod,
      required this.reference,
      this.redeemCode,
      required this.quantity,
      this.email,
      this.planamount});
}
