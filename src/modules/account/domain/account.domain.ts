import { auth } from 'firebase-admin';
import { User } from './user.abstract.class';

export class Account {
  constructor(user: User, fbUser: auth.UserRecord) {
    this.user = user;
    this.firebaseUser = fbUser;
  }
  private user: User;
  private firebaseUser: auth.UserRecord;

  /**
   * @returns {boolean}
   * @memberof Account
   * @description account 도메인이 validate한지 검증
   */
  public validate(): boolean {
    if (this.firebaseUser.email !== this.user.email) {
      return false;
    }
    return true;
  }

  /**
   * @param {string} password
   * @returns {boolean}
   * @memberof Account
   * @description account와 password가 동일한 지 검증
   */
  public verifyPassword(password: string): boolean {
    return this.user.checkPassword(password);
  }
}
