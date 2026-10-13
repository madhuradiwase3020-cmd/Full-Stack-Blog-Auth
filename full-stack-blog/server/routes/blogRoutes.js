const express = require('express');
const {
  listBlogs,
  getBlog,
  listMyBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const { validateBlog, validateObjectId } = require('../middleware/validationMiddleware');

const router = express.Router();

router.get('/', listBlogs);
router.get('/mine', protect, listMyBlogs);
router.get('/:id', validateObjectId, getBlog);
router.post('/', protect, validateBlog, createBlog);
router.patch('/:id', protect, validateObjectId, validateBlog, updateBlog);
router.delete('/:id', protect, validateObjectId, deleteBlog);

module.exports = router;