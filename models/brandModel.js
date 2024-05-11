const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    label: { type: 'String', required: true, unique: true },
    value: { type: 'String', required: true, unique: true },
  },
  { timestamps: true }
);

brandSchema.virtual('id').get(function () {
  return this._id;
});

brandSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
