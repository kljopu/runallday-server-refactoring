import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  RelationId,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';
import { User } from '../../../domain/user.abstract.class';
import { ConflictError } from '../../../../../utils/errors';
import { FullName } from '../../../domain/full-name.vo';
import {
  UserGenderEnum,
  UserStateEnum,
} from '../../../domain/account.constants';
import { Record } from '../../../../record/domain/record/record.entity';
import { RunnerProfile } from './runner.interface';
import { convertPhoneToNational, isNotNull } from '../../../../../utils';

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

  @OneToMany(
    type => Record,
    records => records.runner,
  )
  public records: Record[];

  @OneToOne(type => Record, {
    nullable: true,
    eager: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'recent_record_uid', referencedColumnName: 'uid' })
  public recentRecord: Record;

  @Column({ name: 'recent_record_uid', nullable: true })
  @RelationId((runner: Runner) => runner.recentRecord)
  public recentRecordtUid: string;

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

  @Column({
    type: 'enum',
    enum: UserStateEnum,
    default: UserStateEnum.REGISTER,
  })
  public state: UserStateEnum;

  public checkPassword(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.password);
  }

  private setToHashedPassword(plainPassword: string): void {
    const hashPassword = this.hashPassword(plainPassword);
    this.password = hashPassword;
  }

  private hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(11);
    return bcrypt.hashSync(password, salt);
  }

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

  public isRecentRecordFinished(): boolean {
    return this.recentRecord.isRunFinished();
  }

  public getFullname(): string {
    return this.fullname.getName();
  }

  public async register(
    native: boolean,
    name: string,
    gender: UserGenderEnum,
    birthday: Date,
    email: string,
    phoneNumber: string,
    password: string,
    di: string,
    now: Date,
  ): Promise<Runner> {
    const fullName = new FullName(name.substring(0, 1), name.substring(1));
    this.native = native;
    this.fullname = fullName;
    this.gender = gender;
    this.birthday = birthday;
    this.email = email.toLocaleLowerCase();
    this.phoneNumber = phoneNumber;
    this.setToHashedPassword(password);
    this.di = di;
    this.createdAt = now;
    this.recentLoginAt = now;
    return this;
  }

  /**
   * @returns {RunnerProfile}
   * @memberof Runner
   * @description 유저 프로필 객체 응답.
   */
  public toProfile(): RunnerProfile {
    const phoneNumber = convertPhoneToNational(this.phoneNumber).replace(
      /-/gi,
      '',
    );
    const birthday: Date | null =
      typeof this.birthday === 'string'
        ? moment(this.birthday, 'YYYY.MM.DD').toDate()
        : this.birthday;
    const age = isNotNull(birthday) ? moment().diff(birthday, 'year') : null;
    const birthdayMayNotNull =
      typeof this.birthday === 'string'
        ? this.birthday
        : moment(this.birthday).format('YYYY.MM.DD');

    return {
      name: this.getFullname(),
      email: this.email,
      phoneNumber,
      gender: this.gender,
      birthday: this.birthday ? birthdayMayNotNull : null,
      age,
    };
  }
}
