require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // First try to find by email
  let admin = await User.findOne({ email: 'muhammedanfasck@gmail.com' });
  
  // If not found, try by isAdmin flag
  if (!admin) {
    admin = await User.findOne({ isAdmin: true });
  }
  
  if (admin) {
    admin.password = 'anfass777';
    await admin.save();
    console.log(`✅ Password updated to anfass777 for user: ${admin.username} (${admin.email})`);
    
    // Also ensure this user is actually an admin
    if (!admin.isAdmin) {
      admin.isAdmin = true;
      await admin.save();
      console.log('Made user an admin too.');
    }
  } else {
    // If no admin user exists, create one
    console.log('Creating a new admin user...');
    admin = new User({
      username: 'admin',
      fullName: 'Admin',
      email: 'muhammedanfasck@gmail.com',
      password: 'anfass777',
      isAdmin: true
    });
    await admin.save();
    console.log('✅ Created new admin user: admin (muhammedanfasck@gmail.com) with password: anfass777');
  }
  process.exit();
}).catch(err => {
  console.error('❌ Connection or Execution error:', err);
  process.exit(1);
});
