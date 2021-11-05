import { RunnerProfile } from '../../modules/runner/domain/runner.interface';

export class SignInResponseDto {
  constructor(token: string, profile: RunnerProfile) {
    this.token = token;
    this.profile = profile;
  }

  public token: string;
  public profile: RunnerProfile;
}
