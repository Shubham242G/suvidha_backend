import User from '../models/User.js';
import { sanitizeUser } from '../utils/validators.js';

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user._id);
    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Both passwords required, new one min 8 chars',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const ok = await user.comparePassword(currentPassword);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: 'Current password is wrong' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
};