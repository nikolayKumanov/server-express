const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const userController = require("../controllers/userController");

module.exports = (app) => {
  app.use("/auth", authController);
  app.use("/blogs", blogController);
  app.use("/user", userController);
  app.use("*", (req, res) => {
    res.send("<h1>Error 404, not found!</h1>");
  });
};
