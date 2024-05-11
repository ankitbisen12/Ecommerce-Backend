const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchCartByUser = async (req, res, next) => {
  try{
    const { id } = req.user;
    // console.log("Inside cartController",req.user);
    const cartItems = await Cart.find({ user: id })
      // .populate('user')
      .populate('product');
    res.status(200).json(cartItems);

  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToCart = catchAsync(async (req, res, next) => {
  const {id}= req.user;
  const newItemToCart = await Cart.create({...req.body,user:id});
  const result = await newItemToCart.populate('product');
  res.status(201).json(result);
});

exports.deleteFromCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Cart.findByIdAndDelete(id);
  res.status(200).json(doc);
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const cart = await Cart.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  const result = await cart.populate('product');
  res.status(200).json(result);
});
