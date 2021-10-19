import { AppError } from '../utils/errors/app.error';

export default {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DATABASE_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: '',
  messagingSenderId: process.env.FB_MESSAGE_SENDER_ID,
  appId: process.env.FB_APP_ID,
  verify() {
    if (this.has('firebase.apiKey') === false) {
      throw new AppError('firebase config의 apiKey가 설정되지 않았습니다.');
    }
    if (this.has('firebase.authDomain') === false) {
      throw new AppError('firebase config의 authDomain아 설정되지 않았습니다.');
    }
    if (this.has('firebase.databaseURL') === false) {
      throw new AppError(
        'firebase config의 databaseURL아 설정되지 않았습니다.',
      );
    }
    if (this.has('firebase.projectId') === false) {
      throw new AppError('firebase config의 projectId가 설정되지 않았습니다.');
    }
    if (this.has('firebase.messagingSenderId') === false) {
      throw new AppError(
        'firebase config의 messagingSenderId가 설정되지 않았습니다.',
      );
    }
  },
};
