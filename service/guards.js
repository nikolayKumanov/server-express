function isGuest() {
  return (req, res, next) => {
    if (!req.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorize access!" });
    }
  };
}
function isUser() {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorize access!" });
    }
  };
}
module.exports = {
  isGuest,
  isUser,
};
