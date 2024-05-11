const catchAsync = require('../utils/catchAsync');
const nodemailer = require('nodemailer');
const { sendMail } = require('../utils/common');
const User = require('../models/userModel');
const crypto = require('crypto');

exports.sendMailRequest = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = crypto.randomBytes(48).toString('hex');
    user.resetPasswordToken = token;
    await user.save();

    //Also set token in email
    const resetPageLink =
      'http://localhost:3000/reset-password?token=' + token + '&email=' + email;
    const subject = 'Reset password for E-commerce';
    const html = `<p>Click <a href='${resetPageLink}'>here</a>to Reset password</p>`;

    //let send email and a token in the mail body so we can verify that user has clicked right link.
    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, password, token } = req.body;
  const user = await User.findOne({ email: email, resetPasswordToken: token });

  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        const id = user._id;
        const updateUser = await User.findByIdAndUpdate(
          id,
          { password: hashedPassword, salt: salt },
          { new: true }
        );

        const subject = 'Password reset successfully for E-commerce';
        const html = `<p>Successfully able to reset password</p>`;

        //let send email and a token in the mail body so we can verify that user has clicked right link.
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        } else {
          res.sendStatus(400);
        }
      }
    );
  } else {
  }
});
