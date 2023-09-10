const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { sanitizer } = require('../utils/common');
const SECRET_KEY = 'SECRET_KEY';

exports.createUser = catchAsync(async (req, res, next) => {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    'sha256',
    async function (err, hashedPassword) {
      const newUser = await User.create({
        ...req.body,
        password: hashedPassword,
        salt,
      });

      req.login(sanitizer(newUser), function (err) {
        //this also called serializer and adds to session
        if (err) {
          res.send(400).json(err);
        } else {
          const token = jwt.sign(sanitizer(newUser), SECRET_KEY);
          res.status(201).json(token);
        }
      });
    }
  );
});

exports.loginUser = catchAsync(async (req, res, next) => {
  res.json(req.user);
});

exports.checkUser = catchAsync(async (req, res, next) => {
  res.json({ status: 'success', user: req.user });
});
