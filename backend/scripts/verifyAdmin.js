const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const verifyAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected for admin verification');

    const adminEmail = 'admin@admin.com';
    const adminPassword = 'Admin123!'; // Strong password meeting all requirements
    
    const adminUser = await User.findOne({ email: adminEmail }).select('+password');
    
    if (!adminUser) {
      console.log('❌ Admin user not found. Creating admin user...');
      
      const newAdmin = new User({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        emailVerified: true,
        isActive: true,
        privacyPolicyAccepted: true,
        termsAccepted: true
      });

      await newAdmin.save();
      console.log('✅ Admin user created successfully');
      
      // Verify creation
      const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
      const passwordMatch = await verifyAdmin.comparePassword(adminPassword);
      console.log('Password verification:', passwordMatch ? '✅ Valid' : '❌ Invalid');
      
    } else {
      console.log('✅ Admin user found');
      console.log('Admin details:', {
        email: adminUser.email,
        role: adminUser.role,
        isActive: adminUser.isActive,
        emailVerified: adminUser.emailVerified
      });
      
      const passwordMatch = await adminUser.comparePassword(adminPassword);
      console.log('Password verification:', passwordMatch ? '✅ Valid' : '❌ Invalid');
      
      if (!passwordMatch) {
        console.log('🔧 Fixing password...');
        adminUser.password = adminPassword;
        await adminUser.save();
        console.log('✅ Password updated');
      }
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

verifyAdminUser();
