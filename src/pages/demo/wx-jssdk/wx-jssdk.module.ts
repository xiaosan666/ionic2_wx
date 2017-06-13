import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WxJssdk } from './wx-jssdk';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  declarations: [
    WxJssdk,
  ],
  imports: [
    IonicPageModule.forChild(WxJssdk),SharedModule
  ],
  exports: [
    WxJssdk
  ]
})
export class WxJssdkModule {}
