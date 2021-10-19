import { FactoryProvider } from '@nestjs/common/interfaces';
import { Module, Global, DynamicModule } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import {
  FIREBASE_ADMIN_PROVIDER,
  FIREBASE_ADMIN_INITIALIZE_OPTION,
} from './firebase-admin.constants';
import * as admin from 'firebase-admin';

@Global()
@Module({
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {
  public static forRootAsync(options: Partial<FactoryProvider>): DynamicModule {
    const adminInitializeOptionProvider = {
      provide: FIREBASE_ADMIN_INITIALIZE_OPTION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    const adminProvider = {
      provide: FIREBASE_ADMIN_PROVIDER,
      useFactory: (config): admin.app.App => {
        return admin.initializeApp(config);
      },
      inject: [FIREBASE_ADMIN_INITIALIZE_OPTION],
    };

    return {
      module: FirebaseAdminModule,
      providers: [
        adminProvider,
        adminInitializeOptionProvider,
        FirebaseAdminService,
      ],
      exports: [adminProvider, FirebaseAdminService],
    };
  }
}
