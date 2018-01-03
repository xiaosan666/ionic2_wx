import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-index',
  templateUrl: 'index.html',
})
export class IndexPage {

  constructor(private navCtrl: NavController) {
  }

  demo() {
    this.navCtrl.push('NormalDemoPage');
  }

  jsSdkDemo() {
    this.navCtrl.push('WxJssdk');
  }

}
