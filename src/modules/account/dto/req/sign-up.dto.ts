import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsSameWithAnother } from '../../../../common/decorators/is-same-with-another.decorator';

export class SignUpDTO {
  @Transform(val => val.trim())
  @IsEmail(undefined, { message: '올바른 이메일 형식이 아닙니다.' })
  @MaxLength(254, { message: '올바른 이메일 형식이 아닙니다.' })
  @MinLength(3, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty({ message: '올바른 이메일 형식이 아닙니다.' })
  public email: string;

  @MaxLength(20, { message: '올바른 회원 정보가 아닙니다.' })
  @Matches(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/, {
    message: '올바른 비밀번호 형식이 아닙니다.',
  })
  @IsString({ message: '올바른 비밀번호 형식이 아닙니다.' })
  @IsNotEmpty({ message: '올바른 비밀번호 형식이 아닙니다.' })
  public password: string;

  @MaxLength(20, { message: '올바른 회원 정보가 아닙니다.' })
  @IsSameWithAnother<SignUpDTO>('password', {
    message: '비밀번호가 일치하지 않습니다.',
  })
  @Matches(/^.*(?=.{8,20})(?=.*[0-9])(?=.*[a-zA-Z]).*$/, {
    message: '올바른 비밀번호 형식이 아닙니다.',
  })
  @IsString({ message: '올바른 비밀번호 형식이 아닙니다.' })
  @IsNotEmpty({ message: '올바른 비밀번호 형식이 아닙니다.' })
  public passwordCheck: string;

  @IsString({ message: '잘못된 값입니다.' })
  @IsNotEmpty({ message: '잘못된 값입니다.' })
  public encodeData: string;

  // 현재 단계에서는 사용하지 않음
  //   @IsBoolean({ message: '잘못된 값입니다.' })
  //   @IsNotEmpty({ message: '잘못된 값입니다.' })
  //   public agreeSms: boolean;

  //   @IsBoolean({ message: '잘못된 값입니다.' })
  //   @IsNotEmpty({ message: '잘못된 값입니다.' })
  //   public agreePush: boolean;

  //   @IsBoolean({ message: '잘못된 값입니다.' })
  //   @IsNotEmpty({ message: '잘못된 값입니다.' })
  //   public agreeEmail: boolean;
}
