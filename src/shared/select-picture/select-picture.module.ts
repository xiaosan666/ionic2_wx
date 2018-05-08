import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectPicturePage } from './select-picture';

@NgModule({
  declarations: [
    SelectPicturePage,
  ],
  imports: [
    IonicPageModule.forChild(SelectPicturePage)
  ],
  exports: [
    SelectPicturePage
  ]
})
export class SelectPicturePageModule {
}
