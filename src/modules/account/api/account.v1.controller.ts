import { Body, Post } from '@nestjs/common';
import { TransformPipe } from '../../../common/pipes/transform.pipe';
import { AccountApplicationService } from '../application/account.application.service';
import { SignUpDTO } from '../dto';

export class AccountV1Controller {
  constructor(private readonly accountAppService: AccountApplicationService) {}

  @Post('sign-up')
  public async register(
    @Body(new TransformPipe()) dto: SignUpDTO,
  ): Promise<any> {
    const { email, password, passwordCheck, encodeData } = dto;

    return await this.accountAppService.register(
      email,
      password,
      passwordCheck,
      encodeData,
    );
  }
}
