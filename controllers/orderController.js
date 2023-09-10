const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchOrdersByUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const orders = await Order.find({ user: userId });

  res.status(200).json(orders);
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  res.status(200).json(order);
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json(order);
});

exports.fetchAllOrders = catchAsync(async (req, res, next) => {
  //here we need all query string.

  // sort= {_sort:"price",_order="desc"}
  //pagination = {_page:1,_limit=10};
  //TODO: we have to try with multiple category and brands after change in front-end
  // console.log(req);

  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }
  let query = Order.find(condition);
  let totalOrdersQuery = Order.find(condition);

  //TODO: How to get sort on discounted Price not on Actual Price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
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
