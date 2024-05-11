const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
    size: { type: mongoose.Schema.Types.Mixed, required: true },
    color: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

cartSchema.virtual('id').get(function () {
  return this._id;
});

cartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
