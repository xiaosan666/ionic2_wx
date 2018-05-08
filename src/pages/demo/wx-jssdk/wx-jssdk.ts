import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { NativeService } from '../../../providers/NativeService';
import { FileObj } from '../../../model/FileObj';
import { Position } from '../../../../typings/index';
import { FileService } from '../../../providers/FileService';

@IonicPage()
@Component({
  selector: 'page-wx-jssdk',
  templateUrl: 'wx-jssdk.html',
})
export class WxJssdk {

  constructor(private nativeService: NativeService,
              private fileService: FileService) {
  }

  location: Position;
  networkType: string = '';
  isConnecting: boolean;
  picList: FileObj[] = [];
  resultStr: string = '';

  getUserLocation() {
    this.nativeService.getUserLocation().then(res => {
      this.location = res;
    });
  }

  openLocation() {
    let options = {
      latitude: 23.119495, // 纬度，浮点数，范围为90 ~ -90
      longitude: 113.350912, // 经度，浮点数，范围为180 ~ -180。
      name: '广电科技大厦', // 位置名
    };
    this.nativeService.openLocation(options);
  }

  getNetworkType() {
    this.nativeService.getNetworkType().then(res => {
      this.networkType = res;
    });
  }

  connectionStatus() {
    this.nativeService.getConnectionStatus().then(res => {
      this.isConnecting = res;
    });
  }

  scanQRCode() {
    this.nativeService.scanQRCode().then(res => {
      this.resultStr = res;
    });
  }

  upload() {
    this.fileService.uploadMultiByFilePath(this.picList).subscribe(res => {
      console.log(res);
    });
  }

  callNumber() {
    this.nativeService.callNumber('18688498342');
  }

}
