import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Utils } from '../providers/Utils';
import { Helper } from '../providers/Helper';
import { NativeService } from '../providers/NativeService';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('myNav') nav: Nav;

  constructor(private platform: Platform,
              private helper: Helper,
              private nativeService: NativeService) {
    this.platform.ready().then(() => {
      this.nav.setRoot('IndexPage'); // 设置首页
      // 如果不需要微信用户信息,则直接调用this.initWxJsSdk();
      // if (this.nativeService.isWXBrowser()) { // 如果是微信环境才去初始化微信sdk
      //   this.helper.initWxUser((wxUserInfo) => {
      //     console.log(wxUserInfo);
      //     this.helper.initWxJsSdk();
      //   });
      // }
      if (this.nativeService.isWXBrowser()) { // 如果是微信环境才去初始化微信sdk
        this.helper.initWxJsSdk();
      }
      this.helper.alloyLeverInit(); // 本地"开发者工具"
      Utils.sessionStorageClear(); // 清除数据缓存
    });
  }


}

