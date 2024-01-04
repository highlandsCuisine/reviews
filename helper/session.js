const session = require("express-session");
const sessionStore = require("express-mysql-session")(session);

const options = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  createDatabaseTable: true,
};

const mySessionStore = new sessionStore(options);

const sessionMiddleware = session({
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: false,
  store: mySessionStore,
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 3540000,
    sameSite: true,
    secure: false,
  },
});

module.exports = {
  sessionMiddleware: sessionMiddleware,
};
