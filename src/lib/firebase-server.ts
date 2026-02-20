import admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: 'gs://subnaka-web-32789209-56c4c.firebasestorage.app',
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error:', error.message);
  }
}

export const firestore = admin.firestore();
export const storage = admin.storage().bucket();
