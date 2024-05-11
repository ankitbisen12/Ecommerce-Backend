const Category = require('../models/categoryModel');
const catchAsync = require('../utils/catchAsync');

//fetching all the categories
exports.fetchCategories = catchAsync(async (req, res, next) => {
  const category = await Category.find({});
  res.status(200).json(category);
});

//creating a category data is coming from frontend and store in database.
exports.createCategory = catchAsync(async (req, res, next) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json({
    status: 'success',
    product: newCategory,
  });
  // console.log(newCategory);
});
