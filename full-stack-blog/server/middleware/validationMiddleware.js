const mongoose = require('mongoose');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const imageUrlPattern = /^https?:\/\/\S+$/i;

function isRequestBody(req, res) {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    res.status(400).json({ message: 'A JSON object is required.' });
    return false;
  }
  return true;
}

function validateRegistration(req, res, next) {
  if (!isRequestBody(req, res)) return;
  const { name, email, password } = req.body;
  const errors = [];

  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
    errors.push('Name must be between 2 and 60 characters.');
  }
  if (typeof email !== 'string' || !emailPattern.test(email.trim()) || email.trim().length > 254) {
    errors.push('Enter a valid email address.');
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    errors.push('Password must be between 8 and 128 characters.');
  }

  return sendValidationErrors(res, errors, next);
}

function validateLogin(req, res, next) {
  if (!isRequestBody(req, res)) return;
  const { email, password } = req.body;
  const errors = [];
  if (typeof email !== 'string' || !emailPattern.test(email.trim())) {
    errors.push('Enter a valid email address.');
  }
  if (typeof password !== 'string' || password.length === 0 || password.length > 128) {
    errors.push('Password is required.');
  }
  return sendValidationErrors(res, errors, next);
}

function validateBlog(req, res, next) {
  if (!isRequestBody(req, res)) return;
  const { title, excerpt, content, category, coverImage } = req.body;
  const errors = [];

  if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 120) {
    errors.push('Title must be between 3 and 120 characters.');
  }
  if (typeof excerpt !== 'string' || excerpt.trim().length < 10 || excerpt.trim().length > 240) {
    errors.push('Excerpt must be between 10 and 240 characters.');
  }
  if (typeof content !== 'string' || content.trim().length < 50 || content.length > 50000) {
    errors.push('Content must be between 50 and 50,000 characters.');
  }
  if (typeof category !== 'string' || category.trim().length < 2 || category.trim().length > 40) {
    errors.push('Category must be between 2 and 40 characters.');
  }
  if (coverImage !== undefined && coverImage !== '' &&
      (typeof coverImage !== 'string' || coverImage.length > 2048 || !imageUrlPattern.test(coverImage))) {
    errors.push('Cover image must be a valid HTTP or HTTPS URL.');
  }
  return sendValidationErrors(res, errors, next);
}

function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid blog ID.' });
  }
  return next();
}

function sendValidationErrors(res, errors, next) {
  if (errors.length) {
    return res.status(400).json({ message: errors[0], errors });
  }
  return next();
}

module.exports = { validateRegistration, validateLogin, validateBlog, validateObjectId };