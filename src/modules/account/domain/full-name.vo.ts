import { ConflictException } from '@nestjs/common';
import { Column } from 'typeorm';

export class FullName {
  constructor(firstName: string, lastName: string) {
    // if (firstName.length > 15) {
    //   throw new ConflictException('이름은 15글자를 초과 할 수 없습니다');
    // }
    // if (lastName.length < 0) {
    //   throw new ConflictException('성은 최소 1자 이상이어야 합니다.');
    // }
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @Column({ name: 'first_name' })
  private firstName: string;

  @Column({ name: 'last_name' })
  private lastName: string;

  public getName() {
    return this.firstName + this.lastName;
  }
}
