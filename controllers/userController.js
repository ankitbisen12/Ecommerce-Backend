// const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchUserById= catchAsync(async (req, res, next) => {
  const { id } = req.user;
  // console.log("Inside usercontroller",req.user);
  const user = await User.findById(id);
  // delete user.password;
  // delete user.salt;
  res.status(200).json({id:user.id,name:user.name,addresses:user.addresses,email:user.email,role:user.role});
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json(user);
});
