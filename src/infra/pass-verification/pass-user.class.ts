import { PassUserBuilder } from './pass-user.builder';
export class PassUser {
  private name: string;
  private birthDate: Date;
  private gender: number;
  private nationalInfo: boolean;
  private dupinfo: string;
  private phoneNumber: string; // e164 포맷
  private mobileco?: string;

  constructor(builder: PassUserBuilder) {
    this.name = builder.getName();
    this.birthDate = builder.getBirthDate();
    this.gender = builder.getGender();
    this.nationalInfo = builder.getNationalInfo();
    this.dupinfo = builder.getDupinfo();
    this.phoneNumber = builder.getPhoneNumber();
    this.mobileco = builder.getMobileco();
  }

  public getName(): string {
    return this.name;
  }

  public getBirthDate(): Date {
    return this.birthDate;
  }

  public getGender(): number {
    return this.gender;
  }

  public getNationalInfo(): boolean {
    return this.nationalInfo;
  }

  public getDupinfo(): string {
    return this.dupinfo;
  }

  public getPhoneNumber(): string {
    return this.phoneNumber;
  }

  public getMobileco(): string {
    return this.mobileco;
  }
}
