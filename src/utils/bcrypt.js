import bcrypt from 'bcryptjs';

export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (hashed, plain) =>
  bcrypt.compare(plain, hashed);