
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@subnaka.com';

admin.auth().getUserByEmail(email)
  .then(user => {
    // Set custom claim for the user
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`Successfully set admin custom claim for ${email}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error setting custom claim:', error);
    process.exit(1);
  });
