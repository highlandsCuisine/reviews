// package imports
const ENV = require('dotenv');

ENV.config();
const hpp = require('hpp');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const EventEmitter = require('events');
const frameguard = require('frameguard');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// routes imports
const AuthRoute = require('./routes/auth.route');
const UserRoute = require('./routes/user.route');
const ViewsRoute = require('./routes/views.route');
const RevRoute = require('./routes/reviews.route');
const ResRoute = require('./routes/restaurant.route');
const HealthRoute = require('./routes/health.route');
// local imports
const db = require('./database/db.function');
const { limiter } = require('./middleware/requestRate');
const { errorHandler } = require('./helper/errorHandler');
const { corsOptionsDelegate } = require('./utils/acceptingHosts');
const { checkContentType } = require('./utils/acceptingMedia');
const { allowedMethods } = require('./utils/acceptingMethods');
const { responseHeader } = require('./middleware/setHeader');
const { sessionMiddleware } = require('./helper/session');
const { sanitize } = require('./middleware/sanitization');
const { doubleCsrfProtection } = require('./helper/csrf.csrf');

const PORT = process.env.PORT || 5000;

const app = express();

app.set('trust proxy', 'loopback');
app.disable('x-powered-by');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// to avoid memory leaks
const bus = new EventEmitter();
bus.setMaxListeners(50);

// dbconnection
db.connectionCheck
  .then((conn) => {
    console.log(conn);
  })
  .catch((e) => {
    console.log('Error while connecting to database!', e);
  });

// middlewares
app.use(morgan('dev'));
// cors policy
app.use(cors(corsOptionsDelegate));
// prevents from http parameter pollution
// (query string are ignored || parameters are allowed)
app.use(hpp());
// compress all data from its original size to handle server load
app.use(compression());
// parser for raw or json type data only and payload size limit is 500kb
app.use(
  bodyParser.json({
    limit: '5mb',
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
//sanitization only in body and queries(headers are ignored...)
//also ignores whitelisted routes
app.use(sanitize);
//set necessary response headers
app.use(responseHeader);
// prevents from clickjacking attack
app.use(frameguard({ action: 'deny' }));
// prevents from DDOS attack
app.use(limiter);
// prevents from xss,csrf and other normal attacks
app.use(helmet());
// allowed methods(post,options,get)
app.use(allowedMethods);
// // allowed media types(JSON,Multipart,Formdata)
app.use(checkContentType);
//fetch data from google in every 24hr interval
require('./middleware/scheduler').job1;
//schedular to deleted expired tokens from db
require('./middleware/scheduler').job2;
//schedular to deleted expired user verify tokens from db
require('./middleware/scheduler').job3;
//session
app.use(sessionMiddleware);
// cookie parsing
app.use(cookieParser(process.env.COOKIE_SECRET));
// not protected for csrf
app.use('/api/v1/reviews', RevRoute);
//csrf protection
app.use(doubleCsrfProtection);
app.use('/', HealthRoute);
app.use('/admin/dvls', ViewsRoute);
app.use('/api/v1/user', UserRoute);
app.use('/api/v1/auth/user', AuthRoute);
app.use('/api/v1/res', ResRoute);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found: Requested URL not found.',
  });
});

app.use(errorHandler);

// running server
app.listen(PORT, () => {
  console.log(`☘️  Server running on http://localhost:${PORT}`);
});
