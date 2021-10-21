import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @Transform(val => val.trim())
  @IsString({ message: '아이디 혹은 비밀번호를 확인해주세요' })
  @IsNotEmpty({ message: '아이디 혹은 비밀번호를 확인해주세요' })
  public readonly email: string;

  @IsString({ message: '아이디 혹은 비밀번호를 확인해주세요' })
  @IsNotEmpty({ message: '아이디 혹은 비밀번호를 확인해주세요' })
  public readonly password: string;
}
