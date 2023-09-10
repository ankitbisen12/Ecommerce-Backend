const Brand = require('../models/brandModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchBrands = catchAsync(async (req, res, next) => {
  const brands = await Brand.find({});
  res.status(200).json(brands);
});

exports.createBrand = catchAsync(async (req, res, next) => {
  const newBrand = await Brand.create(req.body);
  res.status(201).json({
    status: 'success',
    product: newBrand,
  });
  console.log(newBrand);
});
