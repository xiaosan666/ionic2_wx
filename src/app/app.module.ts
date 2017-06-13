import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {HttpModule} from "@angular/http";
import {IonicStorageModule} from "@ionic/storage";
import {NativeService} from "../providers/NativeService";
import {HttpService} from "../providers/HttpService";
import {GlobalData} from "../providers/GlobalData";
import {FileService} from "../providers/FileService";
import {Helper} from "../providers/Helper";
import {Utils} from "../providers/Utils";
import {SharedModule} from "../shared/shared.module";

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      backButtonText: ''
    }),
    IonicStorageModule.forRoot(),
    SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpService,
    GlobalData,
    Helper,
    NativeService,
    Utils,
    FileService
  ]
})
export class AppModule {}
