export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export const isStrongPassword = (pwd) =>
  typeof pwd === 'string' && pwd.length >= 8;

export const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});