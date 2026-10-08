import { isValidEmail, isStrongPassword } from '../utils/validators.js';

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ success: false, message: 'Name must be at least 2 characters' });
  }
  if (!email || !isValidEmail(email)) {
    return res
      .status(400)
      .json({ success: false, message: 'Please provide a valid email' });
  }
  if (!password || !isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and password are required' });
  }
  next();
};