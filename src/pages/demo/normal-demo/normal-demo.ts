import { Component } from '@angular/core';
import { App, IonicPage } from 'ionic-angular';
declare var AlloyLever;

@IonicPage()
@Component({
  selector: 'page-normal-demo',
  templateUrl: 'normal-demo.html',
})
export class NormalDemoPage {

  title = '页面title';

  constructor(public app: App) {
  }

  ionViewDidEnter() {
    this.app.setTitle(this.title);
    AlloyLever.entry('#entry2');

  }

  updateTitle() {
    this.title = '页面title-' + Math.floor(Math.random() * 10000);
    this.app.setTitle(this.title);
  }

}
