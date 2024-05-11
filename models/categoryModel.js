const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    label: { type: 'String', required: true, unique: true },
    value: { type: 'String', required: true, unique: true },
  },
  { timestamps: true }
);

//this will simply set _id =id
categorySchema.virtual('id').get(function () {
  return this._id;
});

categorySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
