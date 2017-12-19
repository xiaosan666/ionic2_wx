import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {HomePage} from '../pages/home/home';
import {HttpService} from "../providers/HttpService";
import {Utils} from "../providers/Utils";
import {Response} from "@angular/http";

declare var wx;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform,
              private storage: Storage,
              private httpService: HttpService,) {
    platform.ready().then(() => {
      Utils.sessionStorageClear();//清除数据缓存
      // this.initWxUser();
    });
  }

  initWxUser() {
    this.storage.get('WxUser').then(res => {
      if (res && (res.openid || res.unionid)) {
        console.log(res);
        console.log('微信用户openid : ' + res.openid);
        console.log('微信用户unionid : ' + res.unionid);
        this.initWxJsSdk();
      } else {
        let code = Utils.getQueryString('code');//获取微信授权返回的code
        if (code) {
          this.httpService.post('/wx/handleAuth', code).map((res: Response) => res.json()).subscribe(res => {//通过code获取微信用户信息
            this.storage.set('WxUser', res);
            console.log(res);
            console.log('微信用户openid : ' + res.openid);
            console.log('微信用户unionid : ' + res.unionid);
            this.initWxJsSdk();
          });
        } else {
          this.httpService.post('/wx/auth', window.location.href).map((res: Response) => res.json()).subscribe(res => {  //请求授权地址
            window.location.href = res.redirectUrl; //跳转到微信授权地址,会返回一个授权code
          });
        }
      }
    });

  }

  initWxJsSdk() {
    this.httpService.post('/wx/jsConfig', window.location.href).map((res: Response) => res.json()).subscribe(res => {//初始化js-sdk
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId,
        nonceStr: res.nonceStr,
        signature: res.signature,
        timestamp: res.timestamp,
        jsApiList: ['chooseImage', 'uploadImage', 'downloadImage', 'getLocalImgData', 'openLocation', 'getLocation', 'scanQRCode', 'chooseWXPay'] // 必填，需要使用的JS接口列表
      });
      wx.ready(() => {
        console.log('初始化js-sdk成功');
      });
      wx.error(res => {
        console.log('初始化js-sdk失败' + res.errMsg);
      });
    });
  }
}

