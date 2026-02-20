import admin from 'firebase-admin';

let serviceAccount: any;
try {
  serviceAccount = require('../../service-account.json');
} catch (e) {
  console.warn('service-account.json not found. Please download it from Firebase Console > Project Settings > Service accounts > Generate new private key');
}

if (!admin.apps.length && serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://subnaka-web-32789209-56c4c-default-rtdb.asia-southeast1.firebasedatabase.app",
      storageBucket: 'gs://subnaka-web-32789209-56c4c.firebasestorage.app',
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
  }
} else if (!serviceAccount) {
  console.warn('Firebase Admin SDK not initialized: service-account.json not found');
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export { admin };
