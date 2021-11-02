import { Controller, Get, Res, Post, Body, Query } from '@nestjs/common';
import { Response } from 'express';
import { PassVerificationService } from '../../../infra/pass-verification/pass-verification.service';
import { PassVerifyByPhoneSuccessResponseDto } from '../dto';

@Controller('v1/pass-verify')
export class PassVerifyV1Controller {
  constructor(
    private readonly passVerificationService: PassVerificationService,
  ) {}

  /**
   * @param {Response} res
   * @memberof PassVerifyV1Controller
   * @description pass 본인인증 메인 화면
   */
  @Get('phone')
  public async identityVerifyByPhone(@Res() res: Response) {
    const sEncData = await this.passVerificationService.generateEncryptData();
    res.render('checkplus_main.hbs', {
      sEncData,
      openLink: '',
    });
  }

  /**
   * @param {Response} res
   * @memberof PassVerifyV1Controller
   * @description pass 본인인증 웹뷰용 팝업
   */
  @Get('phone-popup')
  public async identityVerifyByPhonePopup(@Res() res: Response) {
    const sEncData = await this.passVerificationService.generateEncryptData();
    res.render('checkplus_main_popup.hbs', {
      sEncData,
      openLink: '',
    });
  }

  /**
   * @param {PassVerifyByPhoneSuccessResponseDto} dto
   * @param {Response} res
   * @memberof IdentityVerifyV3Controller
   */
  @Get('phone/success')
  public async identityVerifyByPhoneSuccess1(
    @Query() dto: PassVerifyByPhoneSuccessResponseDto,
    @Res() res: Response,
  ) {
    const { EncodeData } = dto;
    try {
      const resultObject = await this.passVerificationService.identityVerifyByPhone(
        EncodeData,
      );
      res.render('checkplus_success.hbs', { data: dto.EncodeData });
    } catch (err) {
      res.render('checkplus_fail.hbs', { message: err.message });
    }
  }

  /**
   * @param {PassVerifyByPhoneSuccessResponseDto} dto
   * @param {Response} res
   * @memberof PassVerifyV1Controller
   * @description 본인인증 성공 화면. pass 본인 인증 화면에서 본인 인증 성공 시 이 링크로 리다이렉트 된다.
   *              리다이렉트 될 시 EncodeData 쿼리에 암호화된 본인 인증값을 포함해 전달된다.
   */
  @Post('phone/success')
  public async identityVerifyByPhoneSuccess2(
    @Body() dto: PassVerifyByPhoneSuccessResponseDto,
    @Res() res: Response,
  ) {
    const { EncodeData } = dto;
    try {
      const resultObject = await this.passVerificationService.identityVerifyByPhone(
        EncodeData,
      );
      res.render('checkplus_success.hbs', { data: dto.EncodeData });
    } catch (err) {
      res.render('checkplus_fail.hbs', { message: err.message });
    }
  }

  /**
   * @param {PassVerifyByPhoneSuccessResponseDto} dto
   * @param {Response} res
   * @memberof PassVerifyV1Controller
   * @description 본인인증 실패 화면. pass 본인 인증 화면에서 본인 인증 실패 시 이 링크로 리다이렉트 된다.
   *              리다이렉트 될 시 EncodeData 쿼리에 암호화된 실패 사유를 포함해 전달된다.
   */
  @Post('phone/fail')
  public async identityVerifyByPhoneFail(
    @Body() dto: PassVerifyByPhoneSuccessResponseDto,
    @Res() res: Response,
  ) {
    try {
      const { EncodeData } = dto;
      const resultObject = await this.passVerificationService.identityVerifyByPhone(
        EncodeData,
      );
      res.render('checkplus_fail.hbs', { message: resultObject.sRtnMSG });
    } catch (err) {
      res.render('checkplus_fail.hbs', { message: err.message });
    }
  }
}
