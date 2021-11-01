import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Runner } from '../../modules/account/modules/runner/domain/runner.entity';
import { ForbiddenError, UnauthorizedError } from '../../utils/errors';

export class UserStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const runner: Runner = request.runner;
    if (runner === undefined) {
      throw new UnauthorizedError(
        '인증 에러',
        '토큰 해석 후 특정 id를 가진 유저 정보를 찾을 수 없습니다.',
      );
    }
    // user 객체 안에 recentRecord를 호출하는 함수 -> Record 객체 안에서 Record 상태를 보여주는 함수 작성해야함
    // isRecentRecordFinished() 값 False -> 아직 진행중 레코드 존재, True -> Finished
    if (runner.isRecentRecordFinished()) {
      throw new ForbiddenError(
        '아직 종료되지 않은 레코드가 있습니다.',
        `${runner.id} 유저의 종료되지 않은 레코드는 ${runner.recentRecord}이며, ${runner.recentRecord.state}상태입니다.`,
      );
    } else {
      return true;
    }
  }
}
