import { BadRequestError } from '../../utils/errors/bad-request.error';
import { FIREBASE_PROVIDER } from './firebase.constants';
import firebase from 'firebase';
import { Injectable, Inject } from '@nestjs/common';
import { UnauthorizedError } from '../../utils/errors';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject(FIREBASE_PROVIDER)
    private readonly firebase: firebase.app.App,
  ) {}

  public setAppVerificationDisabledForTesting(flag: boolean) {
    this.firebase.auth().settings.appVerificationDisabledForTesting = true;
  }

  public async signInWithPhoneNumber(
    phoneNumber: string,
    appVerifier: firebase.auth.ApplicationVerifier,
  ): Promise<firebase.auth.ConfirmationResult> {
    try {
      const confirmationResult = await this.firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);
      return confirmationResult;
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/captcha-check-failed') {
        throw new BadRequestError(
          '토큰이 만료됐습니다.',
          'firebase 전화번호 인증 중 Recaptcha 토큰이 만료됐습니다.',
        );
      } else if (firebaseError.code === 'auth/quota-exceeded') {
        throw new BadRequestError(
          '요청 횟수가 초과됐습니다.',
          'firebase 전화번호 인증이 너무 많이 요청됐습니다.',
        );
      }
    }
  }

  public async signInWithCustomTokenAndGetIdToken(token: string) {
    try {
      const userCredential = await this.firebase
        .auth()
        .signInWithCustomToken(token);
      return userCredential.user.getIdToken(true);
    } catch (err) {
      if (err.code === 'auth/invalid-custom-token') {
        throw new UnauthorizedError(
          '잘못된 토큰입니다.',
          'firebase custom token 인증 시 잘못된 토큰이 전달됐습니다.',
        );
      }
      throw err;
    }
  }
}
