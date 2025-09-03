const mongoose = require('mongoose');
const User = require('../models/User');
const { Logger } = require('../middleware/logging');

const initializeAdmin = async () => {
  try {
    // Wait for database connection
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }

    const adminEmail = 'admin@admin.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      Logger.info('Admin user already exists');
      return;
    }

    const adminUser = new User({
      name: 'Administrator',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      emailVerified: true,
      isActive: true,
      privacyPolicyAccepted: true,
      termsAccepted: true
    });

    await adminUser.save();
    Logger.info('Admin user created successfully', { 
      email: adminEmail,
      role: 'admin'
    });
    
  } catch (error) {
    Logger.error('Failed to initialize admin user', {
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = { initializeAdmin };
