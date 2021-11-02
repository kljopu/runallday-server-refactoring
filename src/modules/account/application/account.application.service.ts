import { Inject } from '@nestjs/common';
import * as admin from 'firebase-admin/lib';
import { ConfigService } from 'nestjs-config';
import { FirebaseAdminService } from '../../../infra/firebase-admin/firebase-admin.service';
import { PassVerificationService } from '../../../infra/pass-verification/pass-verification.service';
import {
  convertPhoneNumberToE164Format,
  isProductionEnv,
} from '../../../utils';
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from '../../../utils/errors';
import { MyLoggerService } from '../../../utils/my-logger/my-logger.service';
import { UserGenderEnum, UserStateEnum } from '../domain/account.constants';
import { AccountService } from '../domain/account.service';
import { SignInResponseDto } from '../dto';
import { Runner } from '../modules/runner/domain/runner.entity';
import { RunnerService } from '../modules/runner/domain/runner.service';
import { RunnerModule } from '../modules/runner/runner.module';

export class AccountApplicationService {
  public FB_API_KEY: string;
  constructor(
    @Inject(ConfigService)
    private readonly config: ConfigService,
    @Inject(MyLoggerService)
    private readonly logger: MyLoggerService,
    @Inject(FirebaseAdminService)
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly passVerificationService: PassVerificationService,
    private readonly runnerService: RunnerService,
    private readonly accountService: AccountService,
  ) {
    config.get('firebase').verify();
    this.FB_API_KEY = config.get('firebase.apiKey');
  }

  /**
   * @private
   * @param {Runner} runner
   * @returns {Promise<null>}
   * @throws {ConflictError} 사용자가 가입할 수 없는 상태인 경우
   * @memberof AccountService
   * @description 회원 가입 조건을 충족하는지 확인하는 서비스.
   */
  private async verifyRegister(runner: Runner): Promise<boolean> {
    // 서비스에 이미 가입된 유저 존재 확인.
    const promises = [];
    promises.push(
      this.accountService.findOne({
        where: [
          { di: runner.di },
          { email: runner.email.toLowerCase() },
          { phoneNumber: runner.phoneNumber },
        ],
      }),
    );
    if (isProductionEnv()) {
      promises.push(
        this.firebaseAdminService.getUserByEmail(runner.email.toLowerCase()),
      );
    }
    const [isExistEmailUser, fbUser] = await Promise.all(promises);

    if (isExistEmailUser) {
      throw new ConflictError(
        '이미 가입된 회원입니다.',
        `사용자가 입력한 이메일 ${runner.email}, 전화번호 ${runner.phoneNumber} 혹은 di로 가입된 유저가 이미 존재합니다.`,
      );
    }
    if (fbUser) {
      throw new ConflictError(
        '이미 가입된 회원입니다.',
        `${runner.email}은 firebase에 이미 등록되어 있습니다.`,
      );
    }

    return true;
  }

  private verifyLogin(runner: Runner): AppError | null {
    switch (runner.state) {
      case UserStateEnum.INACTIVE:
        return new ForbiddenError(
          '휴면 계정입니다.',
          `${runner.id} 유저 상태는 휴면 상태입니다.`,
        );
      case UserStateEnum.LEAVE:
        return new ForbiddenError(
          '탈퇴된 계정입니다.',
          `${runner.id} 유저 상태는 회원 탈퇴 상태입니다.`,
        );
      default:
        break;
    }
    return null;
  }

  /**
   * @param email 유저의 이메일
   * @param password 유저의 비밀번호
   * @returns {SignInResponseDto}
   * @memberof AccountApplicationService
   * @description 로그인을 진행하는 어플리케이션 메서드 인증 완료 시 인증 토큰을 발급한다.
   *              로그인 인증은 유저 정보를 db에 먼저 찾은 후 firebase에 이메일 + 비밀번호 로그인을 진행한다.
   *              firebase 로그인 성공 시 인증 완료로 간주, 서버에선 api 토큰 발급 후 유저 로그인을 완료한다.
   */
  public async signIn(
    email: string,
    password: string,
  ): Promise<SignInResponseDto> {
    const runner = await this.accountService.findOneByEmail(email);
    if (runner === undefined) {
      throw new BadRequestError(
        '아이디 또는 비밀번호를 다시 확인하세요.',
        `회원이 입력한 이메일로 가입된 회원이 없습니다.`,
      );
    }

    // 계정이 로그인 가능한 상태인지 확인.
    const error = this.verifyLogin(runner);
    if (error) {
      throw error;
    }

    // 비밀번호 검증
    if (!runner.checkPassword(password)) {
      throw new BadRequestError(
        '아이디 또는 비밀번호를 다시 확인하세요.',
        `${email} 계정 로그인 시 입력한 비밀번호가 틀렸습니다.`,
      );
    }

    // 최근 로그인 기록 업데이트.
    runner.recentLoginAt = new Date();
    await this.runnerService.save(runner);

    const token = await this.firebaseAdminService.createCustomToken(
      runner.providerUid,
    );
    this.logger.log(
      'id: %s 유저가 로그인했습니다.',
      AccountApplicationService.name,
      runner.id,
    );

    return {
      token,
      profile: runner.toProfile(),
    };
  }

  /**
   * @param email
   * @param password
   * @param passwordCheck
   * @param encodeData
   * @returns {SignInResponseDto}
   * @description 유저 등록 메서드
   */
  public async register(
    email: string,
    password: string,
    passwordCheck: string,
    encodeData: string,
  ): Promise<SignInResponseDto> {
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
    const isNative = !Boolean(Number(nationalinfo));
    const genderInfo =
      Number(gender) === 1 ? UserGenderEnum.MALE : UserGenderEnum.FEMALE;
    const now = new Date();

    const newRunner: Runner = await this.accountService.register(
      isNative,
      name,
      genderInfo,
      birthDay,
      email,
      phoneNumber,
      password,
      dupinfo,
      now,
    );
    const isUserVerified: boolean = await this.verifyRegister(newRunner);
    if (isUserVerified !== true) {
      throw isUserVerified;
    }

    try {
      const fbUser = await this.firebaseAdminService.createUser({
        email,
        password,
        disabled: false,
      });
      newRunner.providerUid = fbUser.uid;
    } catch (err) {
      throw new ConflictError(
        '회원 가입 중 문제가 발생했습니다.\n고객 센터로 연락 바랍니다.',
        `유저 ${newRunner.id} 의 firebase 계정 생성 중 문제가 발생했습니다.`,
      );
    }

    try {
      const savedRunner = await this.runnerService.save(newRunner);
      const token = await this.firebaseAdminService.createCustomToken(
        savedRunner.providerUid,
      );
      this.logger.log(
        'id: %s 유저가 v1 회원가입을 완료했습니다.',
        AccountService.name,
        savedRunner.id,
      );
      return {
        token,
        profile: savedRunner.toProfile(),
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictError(
          '이미 가입된 회원입니다.',
          `사용자가 입력한 이메일, 전화번호 혹은 di로 가입된 유저가 이미 존재합니다.`,
        );
      } else {
        throw error;
      }
    }
  }

  // TODO: 메서드 작성
  public async createUserInFirebase(
    email: string,
    password?: string,
  ): Promise<admin.auth.UserRecord> {
    try {
      const fbUser = await this.firebaseAdminService.createUser({
        email,
        password,
        disabled: false,
      });
      return fbUser;
    } catch (err) {
      throw new ConflictError(
        '인증 시 오류가 발생했습니다.\n지속적인 오류 발생 시 고객센터로 문의 바랍니다.',
        `${email} 로 firebase 유저 생성 중 오류가 발생했습니다. ${JSON.stringify(
          err,
        )}`,
      );
    }
  }
}
