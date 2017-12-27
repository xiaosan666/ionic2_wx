import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {Utils} from "../providers/Utils";
import {Helper} from '../providers/Helper';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;
  rootPage: any = 'HomePage';

  constructor(private platform: Platform,
              private helper: Helper) {
    this.platform.ready().then(() => {
      //如果不需要微信用户信息,则直接调用this.initWxJsSdk();
      // this.initWxUser((wxUserInfo: WxUserInfo) => {
      //   console.log(wxUserInfo);
      //   this.helper.initWxJsSdk();
      // });
      this.helper.initWxJsSdk();
      this.helper.alloyLeverInit();//本地"开发者工具"
      Utils.sessionStorageClear();//清除数据缓存
    });
  }


}

