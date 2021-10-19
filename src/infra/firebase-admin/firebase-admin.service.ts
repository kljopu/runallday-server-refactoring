import * as admin from 'firebase-admin';
import { AppError } from '../../utils/errors/app.error';
import { BadRequestError } from '../../utils/errors/bad-request.error';
import { UnauthorizedError } from '../../utils/errors/unauthorized.error';
import { MyLoggerService } from '../../utils/my-logger/my-logger.service';
import { ConflictError } from '../../utils/errors/conflict.error';
import {
  FIREBASE_ERROR_TYPE,
  FIREBASE_ADMIN_PROVIDER,
} from './firebase-admin.constants';
import { Injectable, Inject } from '@nestjs/common';
import { NotFoundError } from '../../utils/errors';
@Injectable()
export class FirebaseAdminService {
  constructor(
    @Inject(FIREBASE_ADMIN_PROVIDER)
    private readonly admin: admin.app.App,
    @Inject(MyLoggerService)
    private readonly logger: MyLoggerService,
  ) {}

  /**
   * @param {admin.messaging.Message} message
   * @returns {Promise<string>}
   * @memberof FirebaseAdminService
   * @description firebase cloud message를 통해 푸시 메시지를 보냄.
   */
  public async messagingSend(
    message: admin.messaging.Message,
  ): Promise<string> {
    try {
      const messageId = await this.admin.messaging().send(message);
      this.logger.debug(
        'fcm message %s sended: title: %s',
        FirebaseAdminService.name,
        messageId,
        message.notification.title,
      );
      return messageId;
    } catch (err) {
      this.logger.error(
        'fcm 메시지를 발송하는 중 문제가 발생했습니다. title: %s',
        FirebaseAdminService.name,
        err.trace,
        JSON.stringify(err),
        message.notification.title,
      );
    }
  }

  /**
   *
   * @param email
   * @returns UserRecord | null
   * @description email을 이용하여 firebase에서 유저 정보 받아오는 메서드
   */
  public async getUserByEmail(
    email: string,
  ): Promise<admin.auth.UserRecord | null> {
    try {
      const firebaseUser = await this.admin.auth().getUserByEmail(email);
      return firebaseUser;
    } catch (error) {
      if (error.code === FIREBASE_ERROR_TYPE['auth/user-not-found']) {
        throw new NotFoundError(
          '문제가 발생했습니다.\n고객 센터로 연락 바랍니다.',
          `유저 ${email}로 등록된 계정이 없습니다.`,
        );
      }
      this.logger.error(
        `firebase getUserByEmail Error: %o`,
        FirebaseAdminService.name,
        error,
      );
      throw error;
    }
  }

  /**
   *
   * @param firebaseUid
   * @returns UserRecord
   * @description firebaseUid를 통해서 유저 정보를 받아오는 메서드
   */
  public async getUser(firebaseUid: string): Promise<admin.auth.UserRecord> {
    try {
      const firebaseUser = await this.admin.auth().getUser(firebaseUid);
      this.logger.debug(
        'firebaseUser: %o',
        FirebaseAdminService.name,
        firebaseUser,
      );
      return firebaseUser;
    } catch (adminError) {
      if (adminError.code === FIREBASE_ERROR_TYPE['auth/invalid-uid']) {
        throw new BadRequestError(
          '잘못된 요청입니다.',
          `firebase uid 형식이 아닙니다. ${JSON.stringify(adminError)}`,
        );
      } else if (
        adminError.code === FIREBASE_ERROR_TYPE['auth/user-not-found']
      ) {
        throw new BadRequestError(
          '잘못된 요청입니다.',
          `firebase uid에 해당하는 유저가 없습니다. firebase에 재가입해야합니다. ${JSON.stringify(
            adminError,
          )}`,
        );
      }
    }
  }

  public async createCustomToken(
    uid: string,
    developerClaims?: Record<string, any>,
  ): Promise<string> {
    const customToken = await this.admin
      .auth()
      .createCustomToken(uid, developerClaims);
    this.logger.debug(
      'firebase admin create custom token :%s',
      FirebaseAdminService.name,
      customToken,
    );
    return customToken;
  }

  public async verifyIdToken(
    idToken: string,
  ): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.admin.auth().verifyIdToken(idToken);
      this.logger.debug(
        'firebase admin decoded id token :%o',
        FirebaseAdminService.name,
        decodedToken,
      );
      return decodedToken;
    } catch (adminError) {
      if (adminError.code === FIREBASE_ERROR_TYPE['auth/id-token-expired']) {
        throw new UnauthorizedError(
          '만료된 토큰입니다.',
          `firebase id token이 만료된 토큰입니다. ${JSON.stringify(
            adminError,
          )}`,
        );
      } else if (
        adminError.code === FIREBASE_ERROR_TYPE['auth/invalid-id-token']
      ) {
        throw new UnauthorizedError(
          '올바른 토큰이 아닙니다.',
          `firebase id token이 올바른 토큰이 아닙니다. ${JSON.stringify(
            adminError,
          )}`,
        );
      } else if (
        adminError.code === FIREBASE_ERROR_TYPE['auth/argument-error']
      ) {
        throw new UnauthorizedError(
          '올바른 토큰이 아닙니다.',
          `firebase id token이 올바른 토큰이 아닙니다. ${JSON.stringify(
            adminError,
          )}`,
        );
      } else {
        throw new UnauthorizedError(
          '인증이 완료되지 않았습니다.',
          `firebase 토큰 인증 시 문제가 발생했습니다. ${JSON.stringify(
            adminError,
          )}`,
        );
      }
    }
  }

  public async updateUserEmailPassword(
    firebaseUserUid: any,
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    try {
      const updatedFirebaseUser = await this.admin
        .auth()
        .updateUser(firebaseUserUid, {
          email,
          password,
        });
      this.logger.debug(
        'update firebase user email password: %o',
        FirebaseAdminService.name,
        updatedFirebaseUser,
      );
      return updatedFirebaseUser;
    } catch (adminError) {
      if (
        adminError.code === FIREBASE_ERROR_TYPE['auth/email-already-exists']
      ) {
        throw new ConflictError(
          '이미 가입된 이메일이 존재합니다.',
          '이미 firebase에 등록된 이메일입니다.',
        );
      } else {
        throw new AppError(
          null,
          null,
          `firebase 이메일 비밀번호 업데이트 도중 문제가 발생했습니다. ${JSON.stringify(
            adminError,
          )}`,
        );
      }
    }
  }

  /**
   * @param {(string | string[])} token 파이어베이스 등록 토큰 링크: https://firebase.google.com/docs/cloud-messaging/android/client?hl=ko#sample-register
   * @param {string} topic 구독(Subscribe)할 주제(Topic)
   * @returns {Promise<admin.messaging.MessagingTopicManagementResponse>}
   * @memberof FirebaseAdminService
   * @throws {AppError}
   * @description firebase의 등록 토큰이 주제(Topic)를 구독(subscribe)할 수 있도록 한다.
   *              링크: https://firebase.google.com/docs/cloud-messaging/manage-topics
   *              TODO: 현재는 오류 발생 시 재시도 요청이 들어가있지 않다. 어떻게 재시도를 요청할 지 고민해볼것
   */
  public async subscribeToTopic(
    token: string | string[],
    topic: string,
  ): Promise<admin.messaging.MessagingTopicManagementResponse> {
    try {
      const subscribeResult = await this.admin
        .messaging()
        .subscribeToTopic(token, topic);
      this.logger.debug(
        'fcm 구독 결과: %o',
        FirebaseAdminService.name,
        subscribeResult,
      );
      if (subscribeResult.failureCount > 0) {
        this.logger.error(
          'fcm 구독 오류: %o',
          FirebaseAdminService.name,
          JSON.stringify(subscribeResult.errors[0]),
        );
      }
      return subscribeResult;
    } catch (error) {
      this.logger.error(
        'fcm 구독 오류: %o',
        FirebaseAdminService.name,
        `fcm 구독 요청 중 문제가 발생했습니다. 다음 링크에서 오류를 참조하세요. https://firebase.google.com/docs/cloud-messaging/send-message?hl=ko#admin_sdk_error_reference ${JSON.stringify(
          error,
        )}`,
      );
    }
  }

  /**
   * @param {(string | string[])} token
   * @param {string} topic
   * @returns {Promise<admin.messaging.MessagingTopicManagementResponse>}
   * @memberof FirebaseAdminService
   * @description firebase의 등록 토큰이 주제(Topic)를 구독 취소(unsubscribe)할 수 있도록 한다.
   *              링크: https://firebase.google.com/docs/cloud-messaging/manage-topics
   *              TODO: 현재는 오류 발생 시 재시도 요청이 들어가있지 않다. 어떻게 재시도를 요청할 지 고민해볼것
   */
  public async unsubscribeToTopic(
    token: string | string[],
    topic: string,
  ): Promise<admin.messaging.MessagingTopicManagementResponse> {
    try {
      const subscribeResult = await this.admin
        .messaging()
        .unsubscribeFromTopic(token, topic);
      this.logger.debug(
        'fcm 구독 취소 결과: %o',
        FirebaseAdminService.name,
        subscribeResult,
      );
      if (subscribeResult.failureCount > 0) {
        this.logger.error(
          'fcm 구독 취소 오류: %o',
          FirebaseAdminService.name,
          JSON.stringify(subscribeResult.errors[0]),
        );
      }
      return subscribeResult;
    } catch (error) {
      this.logger.error(
        'fcm 구독 취소 오류: %o',
        FirebaseAdminService.name,
        `fcm 구독 취소 요청 중 문제가 발생했습니다. 다음 링크에서 오류를 참조하세요. https://firebase.google.com/docs/cloud-messaging/send-message?hl=ko#admin_sdk_error_reference ${JSON.stringify(
          error,
        )}`,
      );
    }
  }
}
