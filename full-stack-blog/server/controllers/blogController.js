const Blog = require('../models/Blog');

const authorFields = 'name';
const blogFields = 'title excerpt content category coverImage author createdAt updatedAt';

async function listBlogs(req, res, next) {
  try {
    const filter = {};
    if (req.query.category && typeof req.query.category === 'string') {
      filter.category = req.query.category.trim();
    }
    const blogs = await Blog.find(filter)
      .select(blogFields)
      .populate('author', authorFields)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return res.json({ blogs });
  } catch (error) {
    return next(error);
  }
}

async function getBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id)
      .select(blogFields)
      .populate('author', authorFields)
      .lean();
    if (!blog) return res.status(404).json({ message: 'This blog post could not be found.' });
    return res.json({ blog });
  } catch (error) {
    return next(error);
  }
}

async function listMyBlogs(req, res, next) {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .select(blogFields)
      .populate('author', authorFields)
      .sort({ updatedAt: -1 })
      .lean();
    return res.json({ blogs });
  } catch (error) {
    return next(error);
  }
}

async function createBlog(req, res, next) {
  try {
    const blog = await Blog.create({
      title: req.body.title.trim(),
      excerpt: req.body.excerpt.trim(),
      content: req.body.content.trim(),
      category: req.body.category.trim(),
      coverImage: (req.body.coverImage || '').trim(),
      author: req.user._id,
    });
    await blog.populate('author', authorFields);
    return res.status(201).json({ blog });
  } catch (error) {
    return next(error);
  }
}

async function updateBlog(req, res, next) {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });
    if (!blog) {
      const exists = await Blog.exists({ _id: req.params.id });
      return res.status(exists ? 403 : 404).json({
        message: exists ? 'You can only edit your own posts.' : 'This blog post could not be found.',
      });
    }

    blog.title = req.body.title.trim();
    blog.excerpt = req.body.excerpt.trim();
    blog.content = req.body.content.trim();
    blog.category = req.body.category.trim();
    blog.coverImage = (req.body.coverImage || '').trim();
    await blog.save();
    await blog.populate('author', authorFields);
    return res.json({ blog });
  } catch (error) {
    return next(error);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!blog) {
      const exists = await Blog.exists({ _id: req.params.id });
      return res.status(exists ? 403 : 404).json({
        message: exists ? 'You can only delete your own posts.' : 'This blog post could not be found.',
      });
    }
    return res.json({ message: 'Blog post deleted.' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listBlogs, getBlog, listMyBlogs, createBlog, updateBlog, deleteBlog };