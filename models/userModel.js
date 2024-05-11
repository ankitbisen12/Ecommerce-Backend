const mongoose = require('mongoose');
// const { Schema } = mongoose;
const userSchema = new mongoose.Schema(
  {
    email: { type: 'String', required: true, unique: true },
    password: { type: Buffer, required: true },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    addresses: { type: [mongoose.Schema.Types.Mixed] }, //TODO: we can create separate schema for this. //later
    name: { type: String },
    salt:Buffer,
    resetPasswordToken:{type:String,default:''}
  },
  { timestamps: true },
);

userSchema.virtual('id').get(function () {
  return this._id;
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
