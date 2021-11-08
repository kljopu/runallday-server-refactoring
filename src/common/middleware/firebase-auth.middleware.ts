import * as admin from 'firebase-admin';
import { Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseAdminService } from '../../infra/firebase-admin/firebase-admin.service';
import { UnauthorizedError } from '../../utils/errors';
import { AccountService } from '../../modules/account/domain/account.service';

export class FirebaseAuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly accountService: AccountService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeaderData = req.headers.authorization;
    if (!authorizationHeaderData) {
      throw new UnauthorizedError(
        '인증 에러',
        'authorization 헤더에 토큰 정보가 없습니다.',
      );
    }

    const tokenMethod = authorizationHeaderData.split(' ')[0];
    const authToken = authorizationHeaderData.split(' ')[1];

    // token method 확인
    if (tokenMethod !== 'Bearer') {
      throw new UnauthorizedError(
        '지원하지 않는 인증방식입니다',
        `Bearer 타입의 authorization이 아닙니다. authorizationHeaderData: ${authorizationHeaderData}`,
      );
    } else {
      let decodedIdToken: admin.auth.DecodedIdToken;
      try {
        decodedIdToken = await this.firebaseAdminService.verifyIdToken(
          authToken,
        );
      } catch (error) {
        throw new UnauthorizedError(
          '인증 오류가 발생했습니다.',
          error.message + error.description,
        );
      }
      const { uid } = decodedIdToken;
      const verifiedRunner = await this.accountService.findOne({
        where: { providerUid: uid },
      });

      req.runner = verifiedRunner;

      next();
    }
  }
}
