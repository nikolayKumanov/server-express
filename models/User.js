const { model, Schema } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  hashedPassword: {
    type: String,
    minlength: [5, "The length of the password must be at least 5 characters."],
  },
  followers: [],
  following: [],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: "Blog", default: [] }],
  commentedBlogs: [{ type: Schema.Types.ObjectId, ref: "Blog", default: [] }],
});

module.exports = model("User", schema);
