const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    label: { type: "String", required: true, unique: true },
    value: { type: "String", required: true, unique: true },
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

brandSchema.virtual("id").get(function () {
  return this._id;
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
