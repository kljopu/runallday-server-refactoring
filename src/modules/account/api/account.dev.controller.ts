import { Controller, Body, Inject, Post } from '@nestjs/common';
import { FirebaseAdminService } from '../../../infra/firebase-admin/firebase-admin.service';
import { FirebaseService } from '../../../infra/firebase/firebase.service';
import { AccountApplicationService } from '../application/account.application.service';

@Controller('dev/account')
export class AccountDevController {
  constructor(
    private readonly accountAppService: AccountApplicationService,
    @Inject(FirebaseService)
    private readonly firebaseService: FirebaseService, // @Inject(FirebaseAdminService) // private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<string>}
   * @memberof AccountDevController
   * @description api 용 token 생성. (firebase id token)
   */
  @Post('generate-id-token')
  public async customTokenToIdToken(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<string> {
    const data = await this.accountAppService.signIn(email, password);
    return await this.firebaseService.signInWithCustomTokenAndGetIdToken(
      data.token,
    );
  }

  @Post('generate-test')
  public async authTest(@Body('token') token: string): Promise<string> {
    return await this.firebaseService.signInWithCustomTokenAndGetIdToken(token);
  }
}
