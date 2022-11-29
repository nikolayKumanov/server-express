const BlogModel = require("../models/Blog");
const UserModel = require("../models/User");

async function createBlog(blogData) {
  const newBlog = new BlogModel(blogData);
  await newBlog.save();
  return newBlog;
}
async function getBlogs() {
  const blogs = await BlogModel.find({}).populate("author").lean();
  return blogs;
}
async function getBlogById(id) {
  return await BlogModel.findById(id)
    .populate(["author", "comments.user"])
    .lean();
}
async function deleteBlog(id) {
  return await BlogModel.findByIdAndDelete(id);
}
async function getBlogsByCategory(category) {
  const blogs = await BlogModel.find({ category }).populate("author").lean();
  return blogs;
}
async function commentBlog(blogId, comment, userId) {
  const user = await UserModel.findById(userId);
  user.commentedBlogs.push(blogId);
  await user.save();
  const blog = await BlogModel.findById(blogId);
  blog.comments.push({ user: userId, userComment: comment });
  await blog.save();
  return await BlogModel.findById(blogId)
    .populate(["author", "comments.user"])
    .lean();
}
async function getSeachedBlogs(title) {
  const blogs = await BlogModel.find({
    title: { $regex: title, $options: "i" },
  })
    .populate("author")
    .lean();
  return blogs;
}
async function editBlogById(blogId, blogNewData) {
  let blog = await BlogModel.findById(blogId).lean();
  blog = { ...blog, ...blogNewData };
  return blog;
}
module.exports = {
  createBlog,
  getBlogs,
  deleteBlog,
  getBlogById,
  getBlogsByCategory,
  commentBlog,
  getSeachedBlogs,
};
