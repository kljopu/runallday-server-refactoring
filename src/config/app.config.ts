import { AppError } from '../utils/errors';

export default {
  port: process.env.PORT || 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  OS_TYPE: process.env.OS_TYPE,
  verify() {
    if (this.has('app.PORT') === false) {
      throw new AppError('app config의 PORT가 설정되지 않았습니다.');
    }
    if (this.has('app.OS_TYPE') === false) {
      throw new AppError('app config의 OS_TYPE이 설정되지 않았습니다.');
    }
  },
};
