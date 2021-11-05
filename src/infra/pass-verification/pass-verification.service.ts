import { PassUserBuilder } from './pass-user.builder';
import { DecodeResult } from './pass-verification.interface';
import { Inject, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import * as querystring from 'querystring';
import { PassUser } from './pass-user.class';
import { PassVerificationErrorCode as ErrorCode } from './errors/error-code';
import { PassVerificationError } from './errors/pass-verification.error';
import { MyLoggerService } from '../../utils/my-logger/my-logger.service';
import { AppError, BadRequestError } from '../../utils/errors';
import { ConfigService } from 'nestjs-config';
import { convertPhoneNumberToE164Format } from '../../utils';

@Injectable()
export class PassVerificationService {
  private readonly passConfig;
  private readonly sModulePath: string;

  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    @Inject(MyLoggerService)
    private readonly logger: MyLoggerService,
  ) {
    this.passConfig = configService.get('pass-verify');
    this.passConfig.verify();
    const osType = configService.get('app').OS_TYPE;
    if (osType === 'LINUX') {
      this.sModulePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'CPClient_64bit',
      );
    } else if (osType === 'MAC') {
      this.sModulePath = path.join(__dirname, '..', '..', '..', 'CPClient_mac');
    } else {
      throw new AppError('os type 에러.');
    }
  }

  /**
   * @static
   * @param {string} birthdate
   * @returns {Date}
   * @memberof PassVerificationService
   * @description pass 인증 시 응답받는 생일날짜를 Date 객체로 변환하는 메서드.
   */
  public static convertToBirthDate(birthdate: string): Date {
    const year = Number(birthdate.substring(0, 4));
    const month = Number(birthdate.substring(4, 6));
    const day = Number(birthdate.substring(6, 8));
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  /**
   * @private
   * @static
   * @param {string} encData
   * @returns {boolean}
   * @memberof PassVerificationService
   * @description 암호화 데이터 validation
   */
  private static validateEncData(encData: string): boolean {
    if (/^0-9a-zA-Z+\/=/.test(encData) == true) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @private
   * @static
   * @param {*} plaindata
   * @param {*} key
   * @returns {string}
   * @memberof PassVerificationService
   * @description 암호화된 데이터를 복호화 한 결과데이터에서 값을 추출하기 위한 함수.
   */
  private static GetValue(plaindata: string, key: string): string {
    // eslint-disable-next-line prefer-const
    let arrData = plaindata.split(':');
    let value = '';
    // eslint-disable-next-line prefer-const
    for (let i in arrData) {
      const item = arrData[i];
      if (item.indexOf(key) == 0) {
        const valLen = parseInt(item.replace(key, ''));
        // eslint-disable-next-line no-plusplus
        arrData[((i as unknown) as number)++];
        value = arrData[i].substr(0, valLen);
        break;
      }
    }
    return value;
  }

  /**
   * @returns {Promise<string>}
   * @memberof PassVerificationService
   * @description 암호화 데이터 생성.
   */
  public async generateEncryptData(): Promise<string> {
    const d = new Date();
    const config = this.passConfig;
    const sCPRequest = `${config.sSiteCode}_${d.getTime()}`;
    // 전달 원문 데이터 초기화
    let sPlaincData = '';
    // 전달 암호화 데이터 초기화
    let sEncData = '';

    sPlaincData = `7:REQ_SEQ${sCPRequest.length}:${sCPRequest}\
8:SITECODE${config.sSiteCode.length}:${config.sSiteCode}\
9:AUTH_TYPE${config.sAuthType.length}:${config.sAuthType}\
7:RTN_URL${config.sReturnUrl.length}:${config.sReturnUrl}\
7:ERR_URL${config.sErrorUrl.length}:${config.sErrorUrl}\
11:POPUP_GUBUN${config.sPopGubun.length}:${config.sPopGubun}\
9:CUSTOMIZE${config.sCustomize.length}:${config.sCustomize}\
6:GENDER${config.sGender.length}:${config.sGender}`;

    const cmd = `${this.sModulePath} ENC ${config.sSiteCode} ${config.sSitePW} ${sPlaincData}`;
    const child = exec(cmd, { encoding: 'euc-kr' });
    return new Promise((resolve, reject) => {
      child.stdout.on('data', data => {
        sEncData += data;
      });
      child.on('close', () => {
        //처리 결과 확인
        if (sEncData === ErrorCode['en/decryption-system-error']) {
          reject(
            new PassVerificationError(
              '암/복호화 시스템 오류입니다.',
              ErrorCode['en/decryption-system-error'],
            ),
          );
        } else if (sEncData === ErrorCode['encryption-process-error']) {
          reject(
            new PassVerificationError(
              '암호화 처리 오류입니다.',
              ErrorCode['encryption-process-error'],
            ),
          );
        } else if (sEncData === ErrorCode['encryption-data-error']) {
          reject(
            new PassVerificationError(
              '암호화 데이터 오류 입니다.',
              ErrorCode['encryption-data-error'],
            ),
          );
        } else if (sEncData === ErrorCode['mismatch-input-value']) {
          reject(
            new PassVerificationError(
              '입력값 오류 : 암호화 처리시, 필요한 파라미터 값을 확인해 주시기 바랍니다.',
              ErrorCode['mismatch-input-value'],
            ),
          );
        } else {
          resolve(sEncData);
        }
      });
    });
  }

  /**
   * @param {string} encodeData
   * @returns {Promise<PassUser>}
   * @memberof PassVerificationService
   * @description pass 본인 인증 완료 후 받은 encodeData를 통해 passUser 객체를 응답하는 서비스.
   */
  public async decodeEncodeDataToPassUser(
    encodeData: string,
  ): Promise<PassUser> {
    const passUserBuilder: PassUserBuilder = new PassUserBuilder();
    const {
      name,
      birthdate: _birthdate,
      gender,
      nationalinfo,
      dupinfo,
      mobileno,
      mobileco,
    } = await this.decodeEncData(encodeData);
    const year = _birthdate.substring(0, 4);
    const month = _birthdate.substring(4, 6);
    const day = _birthdate.substring(6, 8);
    const birthdate = new Date(Number(year), Number(month) - 1, Number(day));
    const phoneNumber = convertPhoneNumberToE164Format(mobileno);

    passUserBuilder
      .setName(name)
      .setBirthDate(birthdate)
      .setGender(Number(gender))
      .setNationalInfo(!Boolean(Number(nationalinfo)))
      .setDupinfo(dupinfo)
      .setPhoneNumber(phoneNumber)
      .setMobileco(mobileco);

    return passUserBuilder.build();
  }

  /**
   * @param {string} sEncData
   * @returns {Promise<DecodeResult>}
   * @throws {BadRequestError | Error}
   * @memberof PassVerificationService
   * @description 본인인증 후 응답 받은 결과 데이터를 복호화.
   */
  public async decodeEncData(sEncData: string): Promise<DecodeResult> {
    let cmd = '';
    let sRtnMSG: string = '';
    const requestnumber: string = '';
    const authtype: string = '';
    const errcode: string = '';
    const config = this.passConfig;
    const encData = querystring
      .unescape(sEncData)
      .replace('&#x3D;', '=')
      .replace('&#x2B;', '+');

    if (PassVerificationService.validateEncData(encData) === false) {
      sRtnMSG = '입력값 오류';
      throw new BadRequestError(
        `본인인증 실패.\n지속적으로 오류 발생 시 고객센터로 문의 바랍니다.`,
        `사유: ${sRtnMSG}, 요청 번호: ${requestnumber}, 실패 코드: ${errcode}, 인증 수단: ${authtype}`,
      );
    }

    if (encData != '') {
      cmd = `${this.sModulePath} DEC ${config.sSiteCode} ${config.sSitePW} ${encData}`;
    }

    let sDecData = '';

    const child = exec(cmd, { encoding: 'euc-kr' });
    try {
      return new Promise((resolve, reject) => {
        child.stdout.on('data', data => {
          sDecData += data;
        });
        child.stdout.on('error', err => {
          reject(err);
        });
        child.on('close', () => {
          let requestnumber: string = '';
          let responsenumber: string = '';
          let authtype: string = '';
          let name: string = '';
          let birthdate: string = '';
          let gender: string = '';
          let nationalinfo: string = '';
          let dupinfo: string = '';
          let conninfo: string = '';
          let mobileno: string = '';
          let mobileco: string = '';

          // 처리 결과 메시지
          let sRtnMSG = '';
          // 처리 결과 확인
          if (sDecData === ErrorCode['en/decryption-system-error']) {
            sRtnMSG = '암/복호화 시스템 오류';
            reject(
              new PassVerificationError(
                sRtnMSG,
                ErrorCode['en/decryption-system-error'],
              ),
            );
          } else if (sDecData === ErrorCode['decryption-process-error']) {
            sRtnMSG = '복호화 처리 오류';
            reject(
              new PassVerificationError(
                sRtnMSG,
                ErrorCode['decryption-process-error'],
              ),
            );
          } else if (sDecData === ErrorCode['mismatch-hash']) {
            sRtnMSG = 'HASH값 불일치 - 복호화 데이터는 리턴됨';
            reject(
              new PassVerificationError(sRtnMSG, ErrorCode['mismatch-hash']),
            );
          } else if (sDecData === ErrorCode['encodedata-error']) {
            sRtnMSG = '복호화 데이터 오류';
            reject(
              new PassVerificationError(sRtnMSG, ErrorCode['encodedata-error']),
            );
          } else if (sDecData === ErrorCode['mismatch-input-value']) {
            sRtnMSG = '입력값 오류';
            reject(
              new PassVerificationError(
                sRtnMSG,
                ErrorCode['mismatch-input-value'],
              ),
            );
          } else if (sDecData == ErrorCode['site-password-error']) {
            sRtnMSG = '사이트 비밀번호 오류';
            reject(
              new PassVerificationError(
                sRtnMSG,
                ErrorCode['site-password-error'],
              ),
            );
          } else {
            //항목의 설명은 개발 가이드를 참조
            requestnumber = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'REQ_SEQ'),
            ); //CP요청 번호 , main에서 생성한 값을 되돌려준다. 세션등에서 비교 가능
            responsenumber = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'RES_SEQ'),
            ); //고유 번호 , 나이스에서 생성한 값을 되돌려준다.
            authtype = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'AUTH_TYPE'),
            ); //인증수단
            name = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'UTF8_NAME'),
            ); //이름
            birthdate = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'BIRTHDATE'),
            ); //생년월일(YYYYMMDD)
            gender = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'GENDER'),
            ); //성별
            nationalinfo = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'NATIONALINFO'),
            ); //내.외국인정보
            dupinfo = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'DI'),
            ); //중복가입값(64byte)
            conninfo = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'CI'),
            ); //연계정보 확인값(88byte)
            mobileno = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'MOBILE_NO'),
            ); //휴대폰번호(계약된 경우)
            mobileco = decodeURIComponent(
              PassVerificationService.GetValue(sDecData, 'MOBILE_CO'),
            ); //통신사(계약된 경우)
          }
          resolve({
            sRtnMSG,
            requestnumber,
            responsenumber,
            authtype,
            name,
            birthdate,
            gender,
            nationalinfo,
            dupinfo,
            conninfo,
            mobileno,
            mobileco,
          });
        });
      });
    } catch (err) {
      this.logger.error(
        err.message,
        PassVerificationService.name,
        err.trace,
        `암호화 데이터: ${sEncData} 오류: ${JSON.stringify(err)}`,
      );
      throw err;
    }
  }

  public async identityVerifyByPhone(
    EncodeData: string,
  ): Promise<DecodeResult> {
    this.logger.debug(
      'EncodeData: %s',
      PassVerificationService.name,
      EncodeData,
    );

    const resultObj = await this.decodeEncData(EncodeData);

    // TODO: 유저 정보 업데이트.
    this.logger.debug(
      '사용자 정보: %o',
      PassVerificationService.name,
      resultObj,
    );

    return resultObj;
  }
}
