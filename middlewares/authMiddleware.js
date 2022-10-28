const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/basic");

module.exports = () => (req, res, next) => {
  if (req.headers["x-authorization"]) {
    const token = req.headers["x-authorization"];
    try {
      const userData = jwt.verify(token, TOKEN_SECRET);
      req.user = userData;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Invalid access token" });
    }
  } else {
    next();
  }
};
