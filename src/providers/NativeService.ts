/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {ToastController, LoadingController, Loading} from 'ionic-angular';
import {Position} from "../../typings/index";
declare var wx;

@Injectable()
export class NativeService {
  private loading: Loading;
  private loadingIsOpen: boolean = false;

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController) {
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url: string): void {
    window.location.href = url;
  }

  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast(message: string = '操作完成', duration: number = 2000): void {
    this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'middle',
      showCloseButton: false
    }).present();
  };

  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading(content: string = ''): void {
    if (!this.loadingIsOpen) {
      this.loadingIsOpen = true;
      this.loading = this.loadingCtrl.create({
        content: content
      });
      this.loading.present();
      setTimeout(() => {//最长显示10秒
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
      }, 10000);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading(): void {
    this.loadingIsOpen && this.loading.dismiss();
    this.loadingIsOpen = false;
  };

  /**
   * 获取网络类型
   * @returns {Promise<string>}
   */
  getNetworkType(): Promise<string> {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: function (res) {
          let networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
          resolve(networkType);
        }
      });
    });
  }

  /**
   * 选择照片
   * @param options
   * @returns {Promise<string[]>}
   */
  chooseImage(options = {}): Promise<string[]> {
    let ops = Object.assign({
      count: 9,//图片数量
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    }, options);
    return new Promise((resolve) => {
      wx.chooseImage(Object.assign({
        success: function (res) {
          console.log('chooseImage:' + res);
          let localIds = res.localIds; //返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          resolve(localIds);
        }
      }, ops));
    });
  }


  /**
   * 根据图片绝对路径转化为base64字符串
   * @param url 绝对路径
   * @param callback 回调函数
   */
  convertImgToBase64(url: string, callback) {
    wx.getLocalImgData({
      localId: url, // 图片的localID
      success: function (res) {
        callback.call(this, res.localData);
      }
    });
  }

  /**
   * 图片预览
   * @param current
   * @param urls
   */
  previewImage(current = '', urls = []) {
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    });
  }

  /**
   * 调起微信扫一扫接口
   * @return {Promise<string>}
   */
  scanQRCode(needResult = '1'): Promise<string> {
    return new Promise((resolve) => {
      wx.scanQRCode({
        needResult: needResult, // 0扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          resolve(res.resultStr);
        }
      });
    });
  }

  /**
   * 获得用户当前坐标
   * @return {Promise<Position>}
   */
  getUserLocation(type = 'gcj02'): Promise<Position> {
    return new Promise((resolve) => {
      wx.getLocation({
        type: type, // 坐标系,wgs84或gcj02'
        success: function (res) {
          resolve({'lng': res.longitude, 'lat': res.latitude});
        }
      });
    });
  }

}
