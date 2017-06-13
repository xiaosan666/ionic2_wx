import {NgModule} from '@angular/core';
import {IonicModule} from 'ionic-angular';
import {SelectPic} from "./select-pic/select-pic";

@NgModule({
  imports: [IonicModule],
  declarations: [SelectPic],
  exports: [SelectPic],
  providers: []
})
export class SharedModule {
}
