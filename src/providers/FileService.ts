/**
 * Created by yanxiaojun617@163.com on 12-23.
 */
import {Injectable} from '@angular/core';
import {HttpService} from "./HttpService";
import {FILE_SERVE_URL} from './Constants';
import {FileObj} from "../model/FileObj";
import {Response} from "@angular/http";
import {Observable} from "rxjs";
import {NativeService} from "./NativeService";

/**
 * 上传图片到文件服务器
 */
@Injectable()
export class FileService {
  constructor(private httpService: HttpService, private nativeService: NativeService) {
  }

  /**
   * 根据文件id获取文件信息
   * @param id 文件id
   * @return {Promise<TResult|T>}
   */
  getFileInfoById(id: string) {
    if (!id) {
      return Observable.create((observer) => {
        observer.next({'data': [], 'success': true});
      })
    }
    return this.httpService.get(FILE_SERVE_URL + '/getById', {id: id}).map((res: Response) => res.json());
  }

  /**
   * 根据文件id数组获取文件信息
   * @param ids id数组
   * @returns {Observable<R>}
   */
  getFileInfoByIds(ids: string[]) {
    if (!ids || ids.length == 0) {
      return Observable.create((observer) => {
        observer.next({'data': [], 'success': true});
      })
    }
    return this.httpService.get(FILE_SERVE_URL + '/getByIds', {ids: ids}).map((res: Response) => res.json());
  }

  /**
   * 批量上传图片,只支持上传base64字符串
   * @param fileObjList,数组中的对象必须包含bse64属性
   * @return {Promise<TResult|T>}
   */
  uploadMultiByBase64(fileObjList: FileObj[]) {
    if (!fileObjList || fileObjList.length == 0) {
      return Observable.create((observer) => {
        observer.next({'data': [], 'success': true});
      })
    }
    return this.httpService.post(FILE_SERVE_URL + '/appUpload?directory=ionic2_wx', fileObjList).map((res: Response) => res.json());
  }

  /**
   * 上传单张图片,只支持上传base64字符串
   * @param FileObj,对象必须包含origPath属性
   * @return {Promise<TResult|T>}
   */
  uploadByBase64(fileObj: FileObj) {
    if (!fileObj.base64) {
      return Observable.create((observer) => {
        observer.next({'data': [], 'success': true});
      })
    }
    return this.httpService.post(FILE_SERVE_URL + '/appUpload?directory=ionic2_wx', [fileObj]).map((res: Response) => res.json());
  }

  /**
   * 批量上传图片
   * @param fileObjList 数组中的对象必须包含origPath属性
   * @returns {any}
   */
  uploadMultiByFilePath(fileObjList: FileObj[]) {
    if (fileObjList.length == 0) {
      return Observable.create((observer) => {
        observer.next({'data': [], 'success': true});
      })
    }
    return Observable.create((observer) => {
      this.nativeService.showLoading();
      let fileObjs = [];
      for (let fileObj of fileObjList) {
        this.nativeService.convertImgToBase64(fileObj.origPath, base64 => {
          fileObjs.push({'base64': base64});
          if (fileObjs.length === fileObjList.length) {
            this.uploadMultiByBase64(fileObjs).subscribe(res => {
              observer.next(res);
              this.nativeService.hideLoading();
            })
          }
        });
      }
    });
  }

  /**
   * app上传单张图片
   * @param fileObj 对象必须包含origPath属性
   * @returns {any}
   */
  uploadByFilePath(fileObj: FileObj) {
    if (!fileObj.origPath) {
      return Observable.create((observer) => {
        observer.next({'data': [], 'success': true});
      })
    }
    return Observable.create((observer) => {
      this.nativeService.showLoading();
      this.nativeService.convertImgToBase64(fileObj.origPath, base64 => {
        let file = <FileObj>({'base64': base64});
        this.uploadByBase64(file).subscribe(res => {
          observer.next(res);
          this.nativeService.hideLoading();
        })
      });
    });
  }


}
