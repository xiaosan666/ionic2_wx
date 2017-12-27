import {Component, Input, Output, EventEmitter} from '@angular/core';
import {IonicPage, AlertController} from 'ionic-angular';
import {FileObj} from "../../model/FileObj";
import {NativeService} from "../../providers/NativeService";
import {FileService} from "../../providers/FileService";
import {GlobalData} from "../../providers/GlobalData";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * 自定义添加/预览图片组件
 * @description
 * @example <page-select-picture [(fileObjList)]="fileObjList"></page-select-picture>
 * @example <page-select-picture [max]="6" [allowAdd]="true" [allowDelete]="true" [(fileObjList)]="fileObjList"></page-select-picture>
 */
@IonicPage()
@Component({
  selector: 'page-select-picture',
  templateUrl: 'select-picture.html',
})
export class SelectPicturePage {
  @Input() max: number = 4;  //最多可选择多少张图片，默认为4张

  @Input() allowAdd: boolean = true;  //是否允许新增

  @Input() allowDelete: boolean = true;  //是否允许删除

  @Input() fileObjList: FileObj[] = [];   //图片列表,与fileObjListChange形成双向数据绑定
  @Output() fileObjListChange = new EventEmitter<any>();

  constructor(private alertCtrl: AlertController,
              private fileService: FileService,
              private globalData: GlobalData,
              private nativeService: NativeService,
              public sanitizer: DomSanitizer) {
  }

  addPicture() {//新增照片
    this.nativeService.chooseImage({
      count: (this.max - this.fileObjList.length)
    }).then(localIds => {
      //由于ios显示直接图片路径有bug,所以缩略图使用base64字符串用于显示
      if(this.nativeService.isIosBrowser()){
        this.nativeService.localIdsToBase64(localIds).then(res => {
          for (let data of res) {
            let fileObj = <FileObj>{'origPath': data.localId, 'thumbPath': data.base64};
            this.fileObjList.push(fileObj);
          }
          this.fileObjListChange.emit(this.fileObjList);
        })
      }else{
        for (let localId of localIds) {
          let fileObj = <FileObj>{'origPath': localId, 'thumbPath': localId};
          this.fileObjList.push(fileObj);
        }
        this.fileObjListChange.emit(this.fileObjList);
      }
    });
  }

  deletePicture(i) {//删除照片
    if (!this.allowDelete) {
      return;
    }
    this.alertCtrl.create({
      title: '确认删除？',
      buttons: [{text: '取消'},
        {
          text: '确定',
          handler: () => {
            let delArr = this.fileObjList.splice(i, 1);
            this.fileObjListChange.emit(this.fileObjList);
            let delId = delArr[0].id;
            if (delId) {
              this.globalData.showLoading = false;
              this.fileService.deleteById(delId);
            }
          }
        }
      ]
    }).present();
  }

  viewerPicture(index) {//照片预览
    let urls = [], current = '';
    for (let i = 0, len = this.fileObjList.length; i < len; i++) {
      let origPath = this.fileObjList[i].origPath;
      if (i == index) {
        current = origPath;
      }
      urls.push(origPath);
    }
    this.nativeService.previewImage(current, urls);
  }

}
