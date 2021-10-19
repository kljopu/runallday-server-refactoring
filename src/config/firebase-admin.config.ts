import { AppError } from '../utils/errors/app.error';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/oboon-manager-firebase-adminsdk-wjyoy-b835cee9ef.json';

export default {
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: process.env.FB_DATABASE_URL,
  verify() {
    if (serviceAccount.type === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.type이 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.project_id === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.project_id가 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.private_key_id === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.private_key_id가 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.private_key === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.private_key가 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.client_email === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.client_email이 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.client_id === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.client_id가 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.auth_uri === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.auth_uri가 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.token_uri === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.token_uri가 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.auth_provider_x509_cert_url === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.auth_provider_x509_cert_url이 설정되지 않았습니다.',
      );
    }
    if (serviceAccount.client_x509_cert_url === undefined) {
      throw new AppError(
        'firebase-admin config의 credential.client_x509_cert_url이 설정되지 않았습니다.',
      );
    }
    if (this.has('firebase-admin.databaseURL') === false) {
      throw new AppError(
        'firebase-admin config의 databaseURL이 설정되지 않았습니다.',
      );
    }
  },
};
