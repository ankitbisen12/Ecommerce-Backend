const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    product: newProduct,
  });
  console.log(newProduct);
});

exports.fetchProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({deleted:{$ne:true}});

  res.status(200).json(products);
});

exports.fetchAllProducts = catchAsync(async (req, res, next) => {
  //here we need all query string.

  // filter = {"category":["smartphones","laptops",]}
  // sort= {_sort:"price",_order="desc"}
  //pagination = {_page:1,_limit=10};
  //TODO: we have to try with multiple category and brands after change in front-end
  // console.log(req);
  let query = Product.find({deleted:{$ne:true}});
  let totalProductsQuery = Product.find({deleted:{$ne:true}});

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }

  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  //TODO: How to get sort on discounted Price not on Actual Price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  console.log(totalDocs);

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const docs = await query.exec();

  res.set('X-Total-Count', totalDocs);
  res.status(201).json({
    status: 'success',
    product: docs,
  });
  // console.log(docs);
});

exports.fetchProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  // console.log(product);
  res.status(200).json(product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(400).json({
    status: 'success',
    data: {
      product,
    },
  });
});
