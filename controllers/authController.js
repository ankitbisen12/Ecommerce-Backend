const crypto = require('crypto');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const { sanitizer } = require('../utils/common');
const { token } = require('morgan');
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
      // console.log('req.body.name', req.body.name);
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
          const token = jwt.sign(sanitizer(newUser), process.env.JWT_SECRET_KEY);
          res
            .cookie('jwt', token, {
              expires: new Date(Date.now() + 3600000),
              httpOnly: true,
            })
            .status(201)
            .json({ id: newUser.id, role: newUser.role });
        }
      });
    }
  );
});

exports.loginUser = catchAsync(async (req, res, next) => {
  // const user = await User.findOne({email:req.body.email});
  const user = req.user;
  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
});

exports.checkAuth = catchAsync(async (req, res, next) => {
  if (req.user) {
    // console.log('Running');
    res.json(req.user);
  } else {
    // console.log('Error Running');
    res.sendStatus(401);
    // res.status(400).json({message:'Invalid request'});
  }
});

exports.logOut = catchAsync(async (req, res, next) => {
  res
    .cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
});
