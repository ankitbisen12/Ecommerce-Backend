const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    items: { type: [Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    //TODO: we can add enum types.
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'pending' },
    selectedAddress: { type: Schema.Types.Mixed, required: true },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      tarnsform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

orderSchema.virtual('id').get(function () {
  return this._id;
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
