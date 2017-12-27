import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {WxJssdk} from './wx-jssdk';
import {SelectPicturePageModule} from '../../../shared/select-picture/select-picture.module';

@NgModule({
  declarations: [
    WxJssdk,
  ],
  imports: [
    IonicPageModule.forChild(WxJssdk), SelectPicturePageModule
  ]
})
export class WxJssdkModule {
}
