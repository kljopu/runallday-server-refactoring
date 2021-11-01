import { PassUser } from './pass-user.class';

export class PassUserBuilder {
  private _name: string;
  private _birthDate: Date;
  private _gender: number;
  private _nationalInfo: boolean;
  private _dupinfo: string;
  private _phoneNumber: string;
  private _mobileco?: string;

  public getName(): string {
    return this._name;
  }

  public setName(name: string): PassUserBuilder {
    this._name = name;
    return this;
  }

  public getBirthDate(): Date {
    return this._birthDate;
  }

  public setBirthDate(birthDate: Date): PassUserBuilder {
    this._birthDate = birthDate;
    return this;
  }

  public getGender(): number {
    return this._gender;
  }

  public setGender(gender: number): PassUserBuilder {
    this._gender = gender;
    return this;
  }

  public getNationalInfo(): boolean {
    return this._nationalInfo;
  }

  public setNationalInfo(nationalInfo: boolean): PassUserBuilder {
    this._nationalInfo = nationalInfo;
    return this;
  }

  public getDupinfo(): string {
    return this._dupinfo;
  }

  public setDupinfo(dupinfo: string): PassUserBuilder {
    this._dupinfo = dupinfo;
    return this;
  }

  public getPhoneNumber(): string {
    return this._phoneNumber;
  }

  public setPhoneNumber(phoneNumber: string): PassUserBuilder {
    this._phoneNumber = phoneNumber;
    return this;
  }

  public getMobileco(): string | undefined {
    return this._mobileco;
  }

  public setMobileco(mobileco?: string): PassUserBuilder {
    this._mobileco = mobileco;
    return this;
  }

  build() {
    return new PassUser(this);
  }
}
