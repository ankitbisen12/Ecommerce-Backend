const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Product =require('../models/productModel');
const { sendMail, invoiceTemplate } = require('../utils/common');

exports.fetchOrdersByUser = catchAsync(async (req, res, next) => {
  const {id } = req.user;
  const orders = await Order.find({ user: id });
  res.status(200).json(orders);
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);
  //TODO:here we have to update stocks

  for(let item of order.items){
   let product=  await Product.findById({_id:item.product.id});
    product.$inc( 'stcok',-1*item.quantity);
    await product.save();
  }
  const user  = User.findById(order.user);
  // sendMail({to:user.email,html:invoiceTemplate(order),subject:'Order Received'});
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
  
  let query = Order.find({deleted:{$ne:true}});
  let totalOrdersQuery = Order.find({deleted:{$ne:true}});

  //TODO: How to get sort on discounted Price not on Actual Price
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
  // console.log({totalDocs});

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const docs = await query.exec();

  res.set('X-Total-Count', totalDocs);
  res.status(200).json(docs);
  // console.log(docs);
});
