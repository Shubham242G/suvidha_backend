import User from '../models/User';

export const adminSeeder = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'admin@admin.com').toLowerCase();
    const exists = await User.findOne({ email, role: 'admin' });
    if (exists) return;

    await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'admin12345',
      role: 'admin',
    });

    console.log(`✅ Admin seeded: ${email}`);
  } catch (err) {
    console.error('Admin seeder failed:', err.message);
  }
};