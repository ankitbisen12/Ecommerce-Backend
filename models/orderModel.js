const mongoose = require('mongoose');

const paymentMethods = {
  values: ['cash', 'card'],
  message: 'enum validator failed for paymentMethod`',
};

const orderSchema = new mongoose.Schema(
  {
    items: { type: [mongoose.Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    //TODO: we can add enum types. //done
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    paymentStatus: { type: String, default: 'Pending' },
    status: { type: String, default: 'Pending', required: true },
    selectedAddress: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

orderSchema.virtual('id').get(function () {
  return this._id;
});

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
