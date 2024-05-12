const express = require('express');
const app = express(); //framework for node.js =>object contain method and variables.
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const cookieParser = require('cookie-parser');
const cors = require('cors'); //for cross platform
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const brandRouter = require('./routes/brandsRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const User = require('./models/userModel');
const { isAuth, sanitizer, cookieExtractor } = require('./utils/common');
const mailRouter = require('./routes/mailRoutes');
const path = require('path');
const Order = require('./models/orderModel');

//webhook
//TODO: we will capture actual order after deploying out server live on public url.
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.ENDPOINT_SECRET;

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        console.log({ paymentIntentSucceeded });
        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = 'received';
        await order.save();
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//Jwt options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; //TODO: this should not be in code.

//Middlewares
app.use(express.static(path.resolve(__dirname, 'build')));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);

app.use(passport.authenticate('session'));
//for exposing  headers so that we can get total docs i.e X-Total-Count in frontend
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

app.use(express.json()); //to parse req.body //returns an Object.
app.use(morgan('dev')); //for development
app.use('/api/v1/products', productRouter); //we can use Jwt token for client -only auth
app.use('/api/v1/categories', isAuth(), categoryRouter);
app.use('/api/v1/brands', isAuth(), brandRouter);
app.use('/api/v1/users', isAuth(), userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cart', isAuth(), cartRouter);
app.use('/api/v1/orders', isAuth(), orderRouter);
app.use('/api/v1/mail', mailRouter);
//this line we add to make react route to work in case of other routes doesn't match
app.get('*', (req, res) => {
  res.sendFile(path.resolve('build', 'index.html'));
});

//Passport Strategy i.e local Strategy
passport.use(
  'local',
  new LocalStrategy({ usernameField: 'email' }, async function (
    email,
    password,
    done
  ) {
    try {
      //by default passport uses username
      const user = await User.findOne({ email: email });

      if (!user) {
        done(null, false, { message: 'invalid credentials' });
      }

      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: 'Invalid credentials' }); //this line sends to serialize
          }
          const token = jwt.sign(sanitizer(user), process.env.JWT_SECRET_KEY);
          done(null, { id: user.id, role: user.role, token });
        }
      );
    } catch (err) {
      // console.log(err);
      done(err);
    }
  })
);

//this creates session variables req.user on being called from callbacks
passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    // console.log('jwt payload', { jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizer(user)); //this calls serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

//this creates session variables req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  // console.log('serialize', user);
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});

//this change session variable req.user when called from authorized request.
passport.deserializeUser(function (user, cb) {
  // console.log('deseralize', user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Payments
// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51PFCuwSAmgkvZkxcVrb0HNcDMF86FncQiXbDlcmLjAyErE6o42Dgo9cV8sGbSno8M93GNQMhhkPjn5UN2e5lWbYd00viPYZIWQ'
);

app.post('/create-payment-intent', async (req, res) => {
  const { order, orderId } = req.body;
  const selectedAddress = order.selectedAddress;
  // console.log(totalAmount,selectedAddress);
  // console.log(req.body);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalAmount * 100, //for decimal compensation
    currency: 'inr',
    shipping: {
      name: `${selectedAddress.name}`,
      address: {
        line1: `${selectedAddress.street}`,
        postal_code: `${selectedAddress.pinCode}`,
        city: `${selectedAddress.city}`,
        state: `${selectedAddress.state}`,
        country: 'IN',
      },
    },
    description: 'Payment completed',
    payment_method_types: ['card'],
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    // automatic_payment_methods: {
    //   enabled: true,
    // },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.all('*', (req, res, next) => {
  console.log(`Can't find ${req.originalUrl} on this server`, 404);
});

// app.get('/',(req,res)=>{
//     res.json({status:'success'});
// });

module.exports = app;
