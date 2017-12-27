import {Component} from '@angular/core';
import {App, IonicPage} from 'ionic-angular';
import {NativeService} from '../../../providers/NativeService';


@IonicPage()
@Component({
  selector: 'page-normal-demo',
  templateUrl: 'normal-demo.html',
})
export class NormalDemoPage {

  title = '页面title';

  constructor(public app: App, private nativeService: NativeService) {
  }

  ionViewDidEnter() {
    this.app.setTitle(this.title);
  }

  updateTitle() {
    this.title = '页面title-' + Math.floor(Math.random() * 10000);
    this.app.setTitle(this.title);
  }

}
