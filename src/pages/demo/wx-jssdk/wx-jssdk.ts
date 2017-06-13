import {IonicPage} from 'ionic-angular';
import {Component} from "@angular/core";
import {NativeService} from "../../../providers/NativeService";
import {FileObj} from "../../../model/FileObj";
import {Position} from "../../../../typings/index";
declare var wx;
import { DomSanitizer } from '@angular/platform-browser';
import {FileService} from "../../../providers/FileService";

@IonicPage({
  priority: 'off'
})
@Component({
  selector: 'page-wx-jssdk',
  templateUrl: 'wx-jssdk.html',
})
export class WxJssdk {

  constructor(private nativeService: NativeService,public sanitizer: DomSanitizer,private fileService :FileService) {
  }

  networkType: string = '';
  picList: FileObj[] = [];
  resultStr: string = '';
  location: Position;

  getNetworkType() {
    this.nativeService.getNetworkType().then(res => {
      this.networkType = res;
    });
  }

  scanQRCode() {
    this.nativeService.scanQRCode().then(res => {
      this.resultStr = res;
    });
  }

  getUserLocation() {
    this.nativeService.getUserLocation().then(res => {
      this.location = res;
    });
  }


  upload() {
    debugger;
    this.fileService.uploadMultiByFilePath(this.picList).subscribe(res=>{
      debugger;
    })
  }

}
