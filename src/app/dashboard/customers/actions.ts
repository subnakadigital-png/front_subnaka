'use server'

import { admin } from '@/lib/firebase-admin';

export async function getRegisteredUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(100);
    return listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'No Name',
      photoURL: user.photoURL,
      lastSignInTime: user.metadata.lastSignInTime,
      creationTime: user.metadata.creationTime,
      disabled: user.disabled,
    }));
  } catch (error) {
    console.error('Error listing users:', error);
    throw new Error('Failed to fetch users');
  }
}
