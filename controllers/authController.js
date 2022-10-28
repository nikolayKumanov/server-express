const router = require("express").Router();
const userService = require("../service/user");
const { isGuest } = require("../service/guards");

router.post("/register", isGuest(), async (req, res) => {
  const { email, username, password } = req.body;
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
  try {
    if (!email.toLowerCase().match(pattern)) {
      throw new Error("Please enter valid email!");
    }
    if (username.trim().length < 0) {
      throw new Error("Please enter valid username!");
    }
    if (password.length < 5) {
      throw new Error("The password must be at least 5 characters!");
    }
    const token = await userService.register(
      req.body.email,
      req.body.username,
      req.body.password,
    );
    res.status(200).json({ token });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ "error-message": err.message });
  }
});

router.get("/register", isGuest(), (req, res) => {
  res.status(200).json({ "success-message": "success" });
});
router.post("/login", isGuest(), async (req, res) => {
  try {
    const token = await userService.login(req.body.email, req.body.password);
    res.status(200).json({ token });
    console.log("success");
  } catch (err) {
    res.status(400).json({ "error-message": err.message });
    console.log(err);
  }
});
router.get("/login", isGuest(), (req, res) => {
  res.status(200).json({ "success-message": "success" });
});

module.exports = router;
