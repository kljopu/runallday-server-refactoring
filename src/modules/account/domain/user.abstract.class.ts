import { UserGenderEnum, UserStateEnum } from './account.constants';
import { FullName } from './full-name.vo';

export abstract class User {
  public id: number;

  public providerUid: string;

  public di: string;

  public native: boolean;

  public fullname: FullName;

  public gender?: UserGenderEnum;

  public birthday?: Date | string;

  public email: string;

  public password: string;

  public state: UserStateEnum;

  public phoneNumber: string;

  public abstract checkPassword(originPassword: string): boolean;

  public abstract setToHashedPassword(originPassword: string): void;

  public abstract hashPassword(password: string): string;

  // 비밀번호 변경
  public abstract changePassword(
    originPassword: string,
    newPassword: string,
    newPasswordCheck: string,
  ): void;
}
