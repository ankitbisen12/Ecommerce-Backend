const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  newProduct.discountPrice = Math.round(
    newProduct.price * (1 - newProduct.discountPercentage / 100)
  );
  
  const product = await newProduct.save();

  res.status(201).json({
    status: 'success',
    product,
  });
  // console.log(product);
});

//fetching all products
exports.fetchAllProducts = catchAsync(async (req, res) => {
  //here we need all query string.

  // filter = {"category":["smartphones","laptops",]}
  // sort= {_sort:"price",_order="desc"}
  //pagination = {_page:1,_limit=10};
  //TODO: we have to try with multiple category and brands after change in front-end //done
  // console.log(req);
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);
  // console.log("req.query.category",req.query.category);

  if (req.query.category) {
    query = query.find({ category: { $in: req.query.category.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(',') },
    });
  }

  if (req.query.brand) {
    query = query.find({ brand: { $in: req.query.brand.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      brand: { $in: req.query.brand.split(',') },
    });
  }
  //TODO: How to get sort on discounted Price not on Actual Price  //done
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalProductsQuery.count().exec();
  // console.log("totalDocs",totalDocs);

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const docs = await query.exec();

  res.set('X-Total-Count', totalDocs);
  // console.log("Docs",docs);
  res.status(200).json(docs);
});

//fetching a product by id. Here id is coming from frontend.
exports.fetchProductById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  // console.log(product);
  res.status(200).json(product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  // console.log("Inside updateProduct",req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  product.discountPrice = Math.round(
    product.price * (1 - product.discountPercentage / 100)
  );
  const updateProduct = await product.save();

  res.status(200).json({
    status: 'success',
    data: {
      updateProduct,
    },
  });
});
