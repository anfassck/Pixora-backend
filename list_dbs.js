require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const admin = mongoose.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log('Databases in cluster:');
  dbs.databases.forEach(db => console.log(` - ${db.name} (size: ${db.sizeOnDisk} bytes)`));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
