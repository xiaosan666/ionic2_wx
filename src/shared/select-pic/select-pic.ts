import {ActionSheetController} from 'ionic-angular';
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FileObj} from "../../model/FileObj";
import {NativeService} from "../../providers/NativeService";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * 自定义添加/预览图片组件
 * @description
 * @example <page-select-pic [(fileObjList)]="fileObjList"></page-select-pic>
 * @example <page-select-pic [max]="6" [allowAdd]="true" [allowDelete]="true" [(fileObjList)]="fileObjList"></page-select-pic>
 */
@Component({
  selector: 'page-select-pic',
  templateUrl: 'select-pic.html',
})
export class SelectPic {
  @Input() max: number = 4;  //最多可选择多少张图片，默认为4张

  @Input() allowAdd: boolean = true;  //是否允许新增

  @Input() allowDelete: boolean = true;  //是否允许删除

  @Input() fileObjList: FileObj[] = [];   //图片列表,与fileObjListChange形成双向数据绑定
  @Output() fileObjListChange = new EventEmitter<any>();

  constructor(private actionSheetCtrl: ActionSheetController,
              private nativeService: NativeService,
              public sanitizer: DomSanitizer) {
  }

  addPicture() {
    this.nativeService.chooseImage({
      count: (this.max - this.fileObjList.length)
    }).then(res => {
      for (let img of res) {
        let fileObj = <FileObj>{'origPath': img, 'thumbPath': img};
        this.fileObjList.push(fileObj);
        this.fileObjListChange.emit(this.fileObjList);
      }
    });
  }

  deletePicture(i) {//删除照片
    if (!this.allowDelete) {
      return;
    }
    let that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '删除',
          role: 'destructive',
          handler: () => {
            that.fileObjList.splice(i, 1);
          }
        },
        {
          text: '取消',
          role: 'cancel'
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
