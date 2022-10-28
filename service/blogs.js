const BlogModel = require("../models/Blog");

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
  return await BlogModel.findById(id).populate("author").lean();
}
async function deleteBlog(id) {
  return await BlogModel.findByIdAndDelete(id);
}
async function getBlogsByCategory(category) {
  const blogs = await BlogModel
    .find({ category })
    .populate("author")
    .lean();
  return blogs;
}

module.exports = {
  createBlog,
  getBlogs,
  deleteBlog,
  getBlogById,
  getBlogsByCategory,
};
