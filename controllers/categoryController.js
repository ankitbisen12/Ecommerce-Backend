const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchCategories = catchAsync(async (req, res, next) => {
  const category = await Category.find({});
  res.status(200).json(category);
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: 'success',
    product: newCategory,
  });
  console.log(newCategory);
});
