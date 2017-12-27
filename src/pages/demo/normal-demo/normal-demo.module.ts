import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NormalDemoPage } from './normal-demo';

@NgModule({
  declarations: [
    NormalDemoPage,
  ],
  imports: [
    IonicPageModule.forChild(NormalDemoPage),
  ],
})
export class NormalDemoPageModule {}
