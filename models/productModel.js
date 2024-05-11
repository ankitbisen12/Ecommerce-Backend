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
      min: [0, 'wrong min rating'],
      max: [5, 'wrong max rating'],
    },
    stock: {
      type: Number,
      min: [0, 'wrong min stock'],
      max: [50, 'wrong max stock'],
    },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [mongoose.Schema.Types.Mixed] },
    sizes: { type: [mongoose.Schema.Types.Mixed] },
    highlights: { type: [String] },
    discountPrice:{type:Number},
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
  // {
  //   toJSON: {
  //     virtuals: true,
  //     versionKey: false,
  //     transform: function (doc, ret) {
  //       delete ret._id;
  //     },
  //   },
  // }
);

// const virtual = productSchema.virtual('id');
productSchema.virtual('id').get(function () {
  return this._id;
});

//we can't sort using the virtual fields,better to make this field at time of doc creation
// productSchema.virtual('discountPrice').get(function () {
//   return Math.round(this.price * (1 - this.discountPercentage / 100));
// });

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

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
// productSchema.set('toJSON', {
//   virtuals: true,
//   versionKey: false,
//   tarnsform: function (doc, ret) {
//     delete ret._id;
//   },
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
