const jwt = require('jsonwebtoken');
const User = require('../models/User');

const COOKIE_NAME = 'blog_token';
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  const sameSite = process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || sameSite === 'none',
    sameSite,
    maxAge: SESSION_MS,
    path: '/',
  };
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

function createSession(user, res) {
  const token = jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

async function register(req, res, next) {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const existingUser = await User.findOne({ email }).select('_id');
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password: req.body.password });
    createSession(user, res);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: 'Email or password is incorrect.' });
    }

    createSession(user, res);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

function logout(req, res) {
  const { maxAge, ...clearOptions } = cookieOptions();
  res.clearCookie(COOKIE_NAME, clearOptions);
  return res.json({ message: 'You have been logged out.' });
}

function getMe(req, res) {
  return res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, logout, getMe };