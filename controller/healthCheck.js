exports.healthCheck = async (req, res, next) => {
  return res
    .status(200)
    .json({ uptime: process.uptime(), message: "Ok", date: new Date() });
};
