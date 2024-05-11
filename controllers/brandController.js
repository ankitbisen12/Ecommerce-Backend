const Brand = require('../models/brandModel');
const catchAsync = require('../utils/catchAsync');

//fetching all the brands
exports.fetchBrands = catchAsync(async (req, res, next) => {
  const brands = await Brand.find({});
  res.status(200).json(brands);
});

//creating a brand data is coming from frontend and store in database.
exports.createBrand = catchAsync(async (req, res, next) => {
  const newBrand = await Brand.create(req.body);
  res.status(201).json({
    status: 'success',
    product: newBrand,
  });
  // console.log(newBrand);
});
