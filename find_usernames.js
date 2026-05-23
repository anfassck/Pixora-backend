require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log('Collections in database:');
  collections.forEach(c => console.log(` - ${c.name}`));

  console.log('\nScanning collections for user-related fields...');
  for (const coll of collections) {
    const name = coll.name;
    // Skip system collections
    if (name.startsWith('system.')) continue;
    
    const count = await db.collection(name).countDocuments();
    console.log(`\nCollection: "${name}" (Total Documents: ${count})`);
    
    if (count > 0) {
      const docs = await db.collection(name).find({}).limit(10).toArray();
      // Print keys and sample data to see if any user names/emails are cached
      console.log('Sample Keys:', Object.keys(docs[0] || {}));
      docs.forEach(doc => {
        // Look for fields like senderName, receiverName, username, name, email, etc.
        const matches = Object.entries(doc).filter(([k, v]) => 
          /name|username|email|sender|receiver|title/i.test(k) && typeof v === 'string'
        );
        if (matches.length > 0) {
          console.log(`Document ID: ${doc._id}`, matches);
        }
      });
    }
  }

  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
