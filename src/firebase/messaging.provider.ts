import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

export const MessagingProvider = 'lib:messaging';

export const messagingProvider: Provider = {
  provide: MessagingProvider,
  useFactory: async () => {
    try {
      const jsonString = fs.readFileSync(
        path.resolve(__dirname, '../../src/firebase/firebase-adminsdk.json'),
        'utf-8',
      );
      const jsonData = JSON.parse(jsonString);
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: jsonData.project_id,
          clientEmail: jsonData.client_email,
          privateKey: jsonData.private_key.replace(/\\n/g, '\n'),
        }),
      });
      admin.messaging().enableLegacyHttpTransport();
      return admin.messaging();
    } catch (error) {
      console.error('Error initializing Firebase Messaging:', error);
      throw error;
    }
  },
};
