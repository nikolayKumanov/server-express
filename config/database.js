const mongoose = require("mongoose");

module.exports = () => new Promise((resolve, reject) => {
  mongoose.connect(
    "mongodb+srv://nkumanov:1234567890@cluster0.lqibd.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
  const db = mongoose.connection;
  db.on("error", (err) => {
    console.error("connection error:", err);
    reject(err);
  });

  db.once("open", () => {
    // we're connected!
    console.log("Database ready");
    resolve();
  });
});
