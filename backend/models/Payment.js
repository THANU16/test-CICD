const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  reference: String,
  merchantOrderReference: String,
  status: String,
  amount: Number,
  method: String,
  brand: String,
  payUrl: String,
  cancelUrl: String,
  returnUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
