// const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchUserById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  res.status(200).json(user);
});

// exports.createCategory = catchAsync(async (req, res, next) => {
//   const newCategory = await Category.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     product: newCategory,
//   });
//   console.log(newCategory);
// });

exports.updateUser = catchAsync(async (req, res, next) => {
  const {id} = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(400).json(user);
});
