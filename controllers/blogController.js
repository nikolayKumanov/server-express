/* eslint-disable prefer-template */
const router = require("express").Router();
const multer = require("multer");
const blogService = require("../service/blogs");
const { isUser } = require("../service/guards");

const upload = multer({ storage: multer.memoryStorage() });
router.get("/", async (req, res) => {
  try {
    const blogs = await blogService.getBlogs();
    blogs.forEach((singleBlog) => {
      let { createdAt, readTime } = singleBlog;
      singleBlog.author = singleBlog.author.username;
      createdAt = createdAt.toISOString().split("T")[0];
      readTime = Math.ceil(singleBlog.description.split(" ").length / 200);
    });
    res.status(201).json(blogs);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ "error-message": error.message });
  }
});
router.get("/category/:category", async (req, res) => {
  try {
    const blogs = await blogService.getBlogsByCategory(req.params.category);
    blogs.forEach((singleBlog) => {
      singleBlog.author = singleBlog.author.email;
      singleBlog.createdAt = singleBlog.createdAt.toISOString().split("T")[0];
      singleBlog.readTime = Math.ceil(
        singleBlog.description.split(" ").length / 200
      );
    });
    res.status(201).json(blogs);
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ "error-message": error.message });
  }
});
router.post("/", upload.single("image"), async (req, res) => {
  const blogData = {
    title: req.body.title,
    subTitle: req.body.subTitle,
    category: req.body.category,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
    description: req.body.description,
    author: req.user._id,
  };
  try {
    if (blogData.title.length < 2) {
      throw new Error("The title must be at least 2 characters long!");
    }
    if (blogData.category === undefined) {
      throw new Error("Category is mandatory");
    }
    if (blogData.description.length < 8) {
      throw new Error("The description must be at least 50 characters long!");
    }
    await blogService.createBlog(blogData);
    res.status(200).json({ message: "successfully created record" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ "error-message": error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    transformBlog(blog);
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(400).json({ "error-message": error.message });
  }
});
router.delete("/:id", isUser(), async (req, res) => {
  try {
    await blogService.deleteBlog(req.params.id);
    res.status(200).send("Successfully deleted record!");
  } catch (error) {
    console.log(error);
    res.status(400).json({ "error-message": error.message });
  }
});
router.put("/:id", isUser(), async (req, res) => {
  try {
    const blog = await blogService.commentBlog(
      req.params.id,
      req.body.comment,
      req.user._id,
    );
    transformBlog(blog);
    res.status(200).send(blog);
  } catch (error) {
    console.log(error);
    res.status(400).json({ "error-message": error.message });
  }
});

module.exports = router;

function transformBlog(blog) {
  blog.author = blog.author.username;
  blog.createdAt = blog.createdAt.toISOString().split("T")[0];
  blog.readTime = Math.ceil(blog.description.split(" ").length / 200);
  blog.comments.forEach((singleComment) => {
    singleComment.user = singleComment.user.username;
  });
  return blog;
}
