import { Module, Global } from '@nestjs/common';
import { FactoryProvider, DynamicModule } from '@nestjs/common/interfaces';
import { FirebaseService } from './firebase.service';
import {
  FIREBASE_INITIALIZE_OPTION,
  FIREBASE_PROVIDER,
} from './firebase.constants';
import firebase from 'firebase';

@Global()
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  public static forRootAsync(options: Partial<FactoryProvider>): DynamicModule {
    const firebaseInitializeOptionProvider = {
      provide: FIREBASE_INITIALIZE_OPTION,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    const firebaseProvider = {
      provide: FIREBASE_PROVIDER,
      useFactory: (config): firebase.app.App => {
        return firebase.initializeApp(config);
      },
      inject: [FIREBASE_INITIALIZE_OPTION],
    };

    return {
      module: FirebaseModule,
      providers: [firebaseProvider, firebaseInitializeOptionProvider],
      exports: [firebaseProvider, FirebaseService],
    };
  }
}
