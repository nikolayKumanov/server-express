const express = require("express");
const expressConfig = require("./config/express");
const databaseConfig = require("./config/database");
const { PORT } = require("./config/basic");
const router = require("./config/router");
require("dotenv").config();
const authMiddleware = require("./middlewares/authMiddleware");

start();
async function start() {
  const app = express();
  await databaseConfig(app);
  expressConfig(app);
  app.use(authMiddleware());
  router(app);
  app.listen(PORT, () => console.log(`This app is listening on port ${PORT}`));
}
