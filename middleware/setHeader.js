const responseHeader = (req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  res.header("X-XSS-Protection", "1");
  res.header("Access-Control-Allow-Methods", " GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

module.exports = { responseHeader };
