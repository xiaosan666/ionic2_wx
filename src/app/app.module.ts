import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { NativeService } from '../providers/NativeService';
import { FileService } from '../providers/FileService';
import { HttpService } from '../providers/HttpService';
import { GlobalData } from '../providers/GlobalData';
import { Helper } from '../providers/Helper';
import { Utils } from '../providers/Utils';
import { FUNDEBUG_API_KEY, IS_DEBUG } from '../providers/Constants';
import { Logger } from '../providers/Logger';

//参考文档:https://docs.fundebug.com/notifier/javascript/framework/ionic2.html
import * as fundebug from 'fundebug-javascript';

fundebug.apikey = FUNDEBUG_API_KEY;
fundebug.releasestage = IS_DEBUG ? 'development' : 'production'; //应用开发阶段，development:开发;production:生产
fundebug.silent = !IS_DEBUG; //如果暂时不需要使用Fundebug，将silent属性设为true

export class FunDebugErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    fundebug.notifyError(err);
    console.error(err);
  }
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios', //android是'md'
      backButtonText: ''
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    {provide: ErrorHandler, useClass: FunDebugErrorHandler},
    NativeService,
    HttpService,
    FileService,
    Helper,
    Utils,
    GlobalData,
    Logger
  ]
})
export class AppModule {
}
