import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { BadRequestError } from './errors';
const phoneUtil = PhoneNumberUtil.getInstance();

export function convertPhoneNumberToE164Format(
  phoneNumber: string,
  country: string = 'KR',
): string {
  try {
    const parseNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, country);
    const e164PhoneNumber = phoneUtil.format(
      parseNumber,
      PhoneNumberFormat.E164,
    );
    return e164PhoneNumber;
  } catch (err) {
    throw new BadRequestError(
      '잘못된 전화번호 형식입니다.',
      `입력한 전화번호를 e164 포맷으로 변경하는 중 오류가 발생했습니다. ${JSON.stringify(
        err,
      )}`,
    );
  }
}

export function convertE164PhoneNumberOrRaw(
  phoneNumberOrRaw: string,
  country: string = 'KR',
): string {
  let e164FormatOrRawPhoneNumber: string;
  try {
    e164FormatOrRawPhoneNumber = convertPhoneNumberToE164Format(
      phoneNumberOrRaw,
      country,
    ); // 올바른 전화번호인 경우 e164로 변환
  } catch (err) {
    e164FormatOrRawPhoneNumber = phoneNumberOrRaw;
  }
  return e164FormatOrRawPhoneNumber;
}

export function convertPhoneToNational(
  phoneNumber: string,
  country: string = 'KR',
) {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phoneNumber, country);
    const e164PhoneNumber = phoneUtil.format(
      number,
      PhoneNumberFormat.NATIONAL,
    );
    return e164PhoneNumber;
  } catch (err) {
    throw new BadRequestError(
      '잘못된 전화번호 형식입니다.',
      `입력한 전화번호를 e164 포맷으로 변경하는 중 오류가 발생했습니다. ${JSON.stringify(
        err,
      )}`,
    );
  }
}
