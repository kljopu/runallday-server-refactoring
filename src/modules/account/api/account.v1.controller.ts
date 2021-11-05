import { Body, Controller, Post } from '@nestjs/common';
import { TransformPipe } from '../../../common/pipes/transform.pipe';
import { AccountApplicationService } from '../application/account.application.service';
import { SignInDTO, SignInResponseDto, SignUpDTO } from '../dto';

@Controller('v1/account')
export class AccountV1Controller {
  constructor(private readonly accountAppService: AccountApplicationService) {}

  @Post('sign-up')
  public async register(
    @Body(new TransformPipe()) dto: SignUpDTO,
  ): Promise<SignInResponseDto> {
    const { email, password, passwordCheck, encodeData } = dto;

    return await this.accountAppService.register(
      email,
      password,
      passwordCheck,
      encodeData,
    );
  }

  /**
   * @param SignInDTO
   * @returns {} //TODO
   * @description 로그인을 진행하는 end point
   */
  @Post('sign-in')
  public async signIn(
    @Body(new TransformPipe()) dto: SignInDTO,
  ): Promise<SignInResponseDto> {
    const { email, password } = dto;
    return await this.accountAppService.signIn(email, password);
  }
}
