const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: 'String', required: true, unique: true },
    description: { type: 'String', required: true },
    price: {
      type: Number,
      min: [0, 'Wrong min price'],
      max: [10000, 'Wrong max price'],
    },
    discountPercentage: {
      type: Number,
      min: [1, 'wrong min discount'],
      max: [99, 'wrong max discount'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'wrong min rating'],
      max: [5, 'wrong max rating'],
    },
    stock: {
      type: Number,
      min: [0, 'wrong min stock'],
      max: [50, 'wrong max stock'],
    },
    brand: { type: 'String', required: true },
    category: { type: 'String', required: true },
    imageSrc: { type: 'String', required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, default: false },
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
// const virtual = productSchema.virtual('id');
productSchema.virtual('id').get(function () {
  return this._id;
});

// productSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   tarnsform: function (doc, ret) {
//     delete ret._id;
//   },
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
