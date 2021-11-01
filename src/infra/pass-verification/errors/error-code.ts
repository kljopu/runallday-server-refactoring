export enum PassVerificationErrorCode {
  'en/decryption-system-error' = '-1', // 암/복호화 시스템 오류
  'encryption-process-error' = '-2', // 암호화 처리 오류
  'encryption-data-error' = '-3', // 암호화 데이터 오류
  'decryption-process-error' = '-4', // 복호화 처리 오류
  'mismatch-hash' = '-5', // HASH값 불일치
  'encodedata-error' = '-6', // 복호화 데이터 오류
  'mismatch-input-value' = '-9', // 입력값 오류
  'site-password-error' = '-12', // 사이트 비밀번호 오류
}
