import { Inject } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';
import { FirebaseAdminService } from '../../../infra/firebase-admin/firebase-admin.service';
import { PassVerificationService } from '../../../infra/pass-verification/pass-verification.service';
import { MyLoggerService } from '../../../utils/my-logger/my-logger.service';
import { convertPhoneNumberToE164Format } from '../../../utils/phone-util';
import { RecordApplicationService } from '../../record/application/record.application.service';
import { Runner } from '../modules/runner/domain/runner.entity';
import { RunnerService } from '../modules/runner/domain/runner.service';

export class AccountApplicationService {
  public FB_API_KEY: string;
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject(MyLoggerService)
    private readonly logger: MyLoggerService,
    @Inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly recordAppService: RecordApplicationService,
    private readonly passVerificationService: PassVerificationService,
  ) {
    config.get('firebase').verify();
    this.FB_API_KEY = config.get('firebase.apiKey');
  }

  public async getUserInfo(user: Runner) {
    const records = await this.recordAppService.getRecordsByRunner(user);
    return;
  }

  /**
   * @param email
   * @param password
   * @param passwordCheck
   * @param encodeData
   * @returns
   * @description 유저 등록 메서드
   */
  public async register(
    email: string,
    password: string,
    passwordCheck: string,
    encodeData: string,
  ): Promise<any> {
    const {
      name,
      birthdate,
      gender,
      nationalinfo,
      dupinfo,
      mobileno,
      mobileco,
    } = await this.passVerificationService.decodeEncData(encodeData);
    const birthDay = PassVerificationService.convertToBirthDate(birthdate);
    const phoneNumber = convertPhoneNumberToE164Format(mobileno);
    const now = new Date();

    // 객체 생성
    const runner: Runner = new Runner();
    runner.register();
    return;
  }
}
