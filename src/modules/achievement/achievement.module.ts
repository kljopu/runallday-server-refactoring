import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementRepository } from './domain/achievement.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AchievementRepository])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AchievementModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(FirebaseAuthMiddleware)
    //   .forRoutes({ path: '', method: RequestMethod.GET });
  }
}
