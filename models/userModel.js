const mongoose = require('mongoose');
const { Schema } = mongoose;
const userSchema = new mongoose.Schema(
  {
    email: { type: 'String', required: true, unique: true },
    password: { type: Buffer, required: true },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    addresses: { type: [Schema.Types.Mixed] },
    //TODO: we can create separate schema for this.
    name: { type: String },
    salt:Buffer
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

userSchema.virtual('id').get(function () {
  return this._id;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
