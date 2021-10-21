import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';
import { User } from '../../../domain/user.abstract.class';
import * as bcrypt from 'bcrypt';
import { ConflictError } from '../../../../../utils/errors';
import { FullName } from '../../../domain/fullName.vo';
import { UserGenderEnum } from '../../../domain/account.constants';

@Entity({ name: 't_runner' })
export class Runner extends User {
  @Generated('increment')
  @PrimaryColumn({ name: 'runner_id' })
  public id: number;

  @Column({
    name: 'provider_uid',
    comment: 'firebase uid',
    unique: true,
    nullable: true,
  })
  public providerUid: string;

  @Column({
    name: 'di',
    unique: true,
    comment: 'pass 인증 중복 확인용 di',
  })
  public di: string;

  @Column()
  public native: boolean;

  @Column(type => FullName, { prefix: false })
  public fullname: FullName;

  @Column({
    type: 'enum',
    enum: UserGenderEnum,
    nullable: true,
  })
  public gender?: UserGenderEnum;

  @Column({
    type: 'date',
    nullable: true,
    transformer: {
      to: val => val,
      from: (val: string | null) => (val ? val.replace(/-/gi, '.') : val),
    },
  })
  public birthday?: Date | string;

  @Column({ name: 'phone_number', unique: true })
  public phoneNumber: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({ name: 'created_datetime', type: 'timestamptz' })
  public createdAt: Date;

  @Column({ name: 'updated_datetime', type: 'timestamptz' })
  public updatedAt: Date;

  @Column({
    name: 'recent_login_datetime',
    type: 'timestamptz',
    comment: '최근 로그인 기록',
  })
  public recentLoginAt: Date;

  public checkPassword(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.password);
  }

  public setToHashedPassword(plainPassword: string): void {
    const hashPassword = this.hashPassword(plainPassword);
    this.password = hashPassword;
  }

  public hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(11);
    return bcrypt.hashSync(password, salt);
  }

  // 비밀번호 변경
  public changePassword(
    originPassword: string,
    newPassword: string,
    newPasswordCheck: string,
  ): void {
    if (newPassword !== newPasswordCheck) {
      throw new ConflictError(
        '인증 오류가 발생했습니다.',
        `${this.id} 관리자 신규 비밀번호 및 신규 비밀번호 확인 값 불일치`,
      );
    }
    if (this.checkPassword(newPassword) === true) {
      throw new ConflictError(
        '이전 비밀번호로 변경할 수 없습니다.',
        `${this.id} 관리자 이전 비밀번호와 신규 비밀번호가 일치합니다.`,
      );
    }
    if (this.checkPassword(originPassword) === false) {
      throw new ConflictError(
        '이전 비밀번호가 일치하지 않습니다.',
        `${this.id} 관리자 이전 비밀번호가 일치하지 않습니다.`,
      );
    }

    this.setToHashedPassword(newPassword);
  }
}
