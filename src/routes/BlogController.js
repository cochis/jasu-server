const { Router } = require("express");
const router = Router();

const Blog = require("../models/Blog");

router.get("/blog", async (req, res) => {
  const blogs = await Blog.find({}).sort({createdAt:1});
  return res.status(200).json(blogs);
});

router.get("/blog/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    return res.status(200).json(blog);
});

module.exports = router;
