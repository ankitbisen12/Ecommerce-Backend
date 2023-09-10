const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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

categorySchema.virtual("id").get(function () {
  return this._id;
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
