const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters.'],
      maxlength: [120, 'Title cannot exceed 120 characters.'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required.'],
      trim: true,
      minlength: [10, 'Excerpt must be at least 10 characters.'],
      maxlength: [240, 'Excerpt cannot exceed 240 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Content is required.'],
      trim: true,
      minlength: [50, 'Content must be at least 50 characters.'],
      maxlength: [50000, 'Content cannot exceed 50,000 characters.'],
    },
    category: {
      type: String,
      required: [true, 'Category is required.'],
      trim: true,
      maxlength: [40, 'Category cannot exceed 40 characters.'],
    },
    coverImage: {
      type: String,
      trim: true,
      default: '',
      maxlength: [2048, 'Image URL cannot exceed 2048 characters.'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);