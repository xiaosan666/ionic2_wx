/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {HttpService} from './HttpService';
import {WX_SERVE_URL} from './Constants';
import {Utils} from './Utils';
import {WxUserInfo} from '../model/WxUserInfo';

declare var AlloyLever;
declare var wx;

/**
 * Helper类存放和业务有关的公共方法
 * @description
 */
@Injectable()
export class Helper {

  constructor(private httpService: HttpService, private storage: Storage) {
  }

  /**
   * AlloyLever,一款本地"开发者工具"
   * 文档:https://github.com/AlloyTeam/AlloyLever
   */
  alloyLeverInit(){
    AlloyLever.config({
      cdn:'http://s.url.cn/qqun/qun/qqweb/m/qun/confession/js/vconsole.min.js',  //vconsole的CDN地址
      /*reportUrl: "//a.qq.com",  //错误上报地址
      reportPrefix: 'qun',    //错误上报msg前缀，一般用于标识业务类型
      reportKey: 'msg',        //错误上报msg前缀的key，用户上报系统接收存储msg
      otherReport: {              //需要上报的其他信息
        uin: 491862102
      },
      entry:"#entry"*/        //请点击这个DOM元素6次召唤vConsole。//你可以通过AlloyLever.entry('#entry2')设置多个机关入口召唤神龙
    })
  }

  /**
   * 获取微信用户信息
   * 生成微信认证url并在微信客户端跳转到该url > 微信服务器认证完成并返回一个code > 根据code获取微信用户信息（openId或用户信息）
   */
  initWxUser(callBackFun) {
    //从缓存中获取微信用户信息
    this.storage.get('wxUserInfo').then((wxUserInfo: WxUserInfo) => {
      if (wxUserInfo) {
        callBackFun();
      } else {
        //获取地址栏code参数值,如果没有code则请求code
        let code = Utils.getQueryString('code');
        if (code) {
          //通过code获取用户信息
          this.httpService.get(WX_SERVE_URL + '/v1/info/' + code).subscribe((wxUserInfo: WxUserInfo) => {
            this.storage.set('wxUserInfo', wxUserInfo);
            callBackFun();
          });
        } else {
          //请求授权地址,跳转该地址浏览器地址栏会生成一个code参数,根据code参数值获取用户信息
          //   code有两种类型 snsapi_base 和 snsapi_userinfo  默认为snsapi_base,通过该code可以得到用户的openId和unionId
          //   当设置scope=snsapi_userinfo 会返回更详细的用户信息,如用户头像,昵称等;注意,设置该类型需要用户同意,会先跳转到一个让用户确认授权的界面
          this.httpService.post(WX_SERVE_URL + '/v1/auth?scope=snsapi_base', window.location.href).subscribe(url => {
            window.location.href = url; //跳转到微信授权地址,会返回一个授权code
          });
        }
      }
    });
  }

  /**
   * 初始化微信JS-SDK
   * 参数为"js安全域名"
   * 官方文档:https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115
   */
  initWxJsSdk() {
    this.httpService.post(WX_SERVE_URL + '/v1/jsConfig', window.location.href).subscribe(res => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId,
        nonceStr: res.nonceStr,
        signature: res.signature,
        timestamp: res.timestamp,
        jsApiList: ['chooseImage', 'previewImage', 'getNetworkType', 'uploadImage', 'downloadImage', 'getLocalImgData', 'openLocation', 'getLocation', 'scanQRCode', 'chooseWXPay', 'closeWindow'] // 必填，需要使用的JS接口列表
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
