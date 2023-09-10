const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const brandRouter = require('./routes/brandsRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const User = require('./models/userModel');
const app = express();
const cors = require('cors');
const { isAuth, sanitizer } = require('./utils/common');

const SECRET_KEY = 'SECRET_KEY';

//Jwt options
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET_KEY'; //this should not be in code.

//Middlewares
app.use(
  session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' }),
  })
);
app.use(passport.authenticate('session'));
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);

app.use(express.json()); //to parse req.body
app.use(morgan('dev')); //for development
app.use('/api/v1/products', isAuth(), productRouter);
//we can use Jwt token for client -only auth
app.use('/api/v1/categories', isAuth(), categoryRouter);
app.use('/api/v1/brands', isAuth(), brandRouter);
app.use('/api/v1/users', isAuth(), userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/cart', isAuth(), cartRouter);
app.use('/api/v1/orders', isAuth(), orderRouter);

//Passport Strategy
passport.use(
  'local',
  new LocalStrategy({usernameField:'email'},async function (username, password, done) {
    try {
      //by default passport uses username
      const user = await User.findOne({ email: email});

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
          const token = jwt.sign(sanitizer(user), SECRET_KEY);
          done(null, token);
        }
      );
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
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

//this creates session variable req.user on being called
passport.serializeUser(function (user, cb) {
  console.log('serialize', user);
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});

//this change session variable req.user when called from authorized request.
passport.deserializeUser(function (user, cb) {
  console.log('deseralize', user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.all('*', (req, res, next) => {
  console.log(`Can't find ${req.originalUrl} on this server`, 404);
});

// app.get('/',(req,res)=>{
//     res.json({status:'success'});
// });

module.exports = app;
