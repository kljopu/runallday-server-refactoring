import { AppError } from '../utils/errors';

export default {
  sSiteCode: process.env.S_SITE_CODE,
  sSitePW: process.env.S_SITE_PW,
  sAuthType: 'M', // 없으면 기본 선택화면, X: 공인인증서, M: 핸드폰, C: 카드
  sPopGubun: 'N', // Y : 취소버튼 있음 / N : 취소버튼 없음
  sCustomize: '', // 없으면 기본 웹페이지 / Mobile : 모바일페이지
  sGender: '', // 없으면 기본 선택화면, 0: 여자, 1: 남자
  sReturnUrl: process.env.S_RETURN_URL,
  sErrorUrl: process.env.S_ERROR_URL,
  verify() {
    if (this.has('pass-verify.sSiteCode') === false) {
      throw new AppError(
        'pass-verification config의 sSiteCode가 설정되지 않았습니다.',
      );
    }
    if (this.has('pass-verify.sSitePW') === false) {
      throw new AppError(
        'pass-verification config의 sSitePW가 설정되지 않았습니다.',
      );
    }
    if (this.has('pass-verify.sReturnUrl') === false) {
      throw new AppError(
        'pass-verification config의 sSitePW가 설정되지 않았습니다.',
      );
    }
    if (this.has('pass-verify.sErrorUrl') === false) {
      throw new AppError(
        'pass-verification config의 sSitePW가 설정되지 않았습니다.',
      );
    }
  },
};
