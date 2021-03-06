const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; //`0: [Beaer ], 1: [adsasdad]`

  if (!token) {
    return res.status(401).json({
      success: false,
      messsage: "Access token not found!",
    });
  }
  try {
    // nếu tồn tại token thì gán token vào request header
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;
