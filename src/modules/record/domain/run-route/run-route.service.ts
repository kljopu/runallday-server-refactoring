import { Injectable } from '@nestjs/common';
import { LineString } from 'geojson';
import { EntityManager } from 'typeorm';
import { isNotNull } from '../../../../utils';
import { ErrorCode, NotFoundError } from '../../../../utils/errors';
import { RunRoute } from './run-route.entity';
import { RunRouteRepository } from './run-route.repository';

@Injectable()
export class RunRouteService {
  constructor(private readonly runRouteRepository: RunRouteRepository) {}

  public async findOneByRecordUid(recordUid: string): Promise<RunRoute> {
    return await this.runRouteRepository.findOne({ recordUid });
  }

  public async updateRoute(
    entityManager: EntityManager,
    recordUid: string,
    route: LineString,
  ): Promise<RunRoute> {
    const runRoute = await entityManager
      .getCustomRepository(RunRouteRepository)
      .findOne({ recordUid });
    if (isNotNull(runRoute) === false) {
      throw new NotFoundError(
        `경로가 존재하지 않습니다`,
        `기록 종료를 요청한 ${recordUid}에 경로가 존재하지 않습니다.`,
        ErrorCode['app/not-found'],
      );
    }
    runRoute.path = route;
    const savedRunRoute = await entityManager
      .getCustomRepository(RunRouteRepository)
      .save(runRoute);
    return savedRunRoute;
  }
}
