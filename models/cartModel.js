const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true },
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

// {
//     "id": 1,
//     "title": "iPhone 9",
//     "description": "An apple mobile which is nothing like apple",
//     "price": 549,
//     "discountPercentage": 12.96,
//     "rating": 4.69,
//     "stock": 94,
//     "brand": "Apple",
//     "category": "smartphones",
//     "imageSrc": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
//     "images": [
//       "https://i.dummyjson.com/data/products/1/1.jpg",
//       "https://i.dummyjson.com/data/products/1/2.jpg",
//       "https://i.dummyjson.com/data/products/1/3.jpg",
//       "https://i.dummyjson.com/data/products/1/1.jpg"
//     ],
//     "thumbnail": "https://i.dummyjson.com/data/products/1/1.jpg"
//   },
// const virtual = cartSchema.virtual('id');
cartSchema.virtual('id').get(function () {
  return this._id;
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
