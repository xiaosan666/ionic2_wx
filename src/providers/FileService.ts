/**
 * Created by yanxiaojun617@163.com on 12-23.
 */
import {Injectable} from "@angular/core";
import {HttpService} from "./HttpService";
import {FILE_SERVE_URL} from "./Constants";
import {FileObj} from "../model/FileObj";
import {Observable} from "rxjs";
import {NativeService} from "./NativeService";

/**
 * 上传图片到文件服务器
 */
@Injectable()
export class FileService {
  constructor(private httpService: HttpService,
              private nativeService: NativeService) {
  }


  /**
   * 根据文件id删除文件信息
   * @param id
   * @returns {FileObj}
   */
  deleteById(id: string): Observable<FileObj> {
    if (!id) {
      return Observable.of({});
    }
    return this.httpService.get(FILE_SERVE_URL + '/deleteById', {id: id});
  }

  /**
   * 根据ids(文件数组)获取文件信息
   * 先从本地缓存中查找文件,然后再去文件服务器上查找文件
   * @param ids
   * @returns {FileObj[]}
   */
  getFileInfoByIds(ids: string[]): Observable<FileObj[]> {
    if (!ids || ids.length == 0) {
      return Observable.of([]);
    }
    return this.httpService.get(FILE_SERVE_URL + '/getByIds', {ids: ids}).map(result => {
      if (!result.success) {
        this.nativeService.alert(result.msg);
        return [];
      } else {
        for (let fileObj of result.data) {
          fileObj.origPath = FILE_SERVE_URL + fileObj.origPath;
          fileObj.thumbPath = FILE_SERVE_URL + fileObj.thumbPath;
        }
        return result.data;
      }
    });
  }


  /**
   * 根据文件id获取文件信息
   * @param id
   * @returns {FileObj}
   */
  getFileInfoById(id: string): Observable<FileObj> {
    if (!id) {
      return Observable.of({});
    }
    return this.getFileInfoByIds([id]).map(res => {
      return res[0] || {};
    })
  }

  /**
   * 根据base64(字符串)批量上传图片
   * @param fileObjList 数组中的对象必须包含bse64属性
   * @returns {FileObj[]}
   */
  uploadMultiByBase64(fileObjList: FileObj[]): Observable<FileObj[]> {
    if (!fileObjList || fileObjList.length == 0) {
      return Observable.of([]);
    }
    return this.httpService.post(FILE_SERVE_URL + '/appUpload?directory=ionic2_wx', fileObjList).map(result => {
      if (!result.success) {
        this.nativeService.alert(result.msg);
        return [];
      } else {
        for (let fileObj of result.data) {
          fileObj.origPath = FILE_SERVE_URL + fileObj.origPath;
          fileObj.thumbPath = FILE_SERVE_URL + fileObj.thumbPath;
        }
        return result.data;
      }
    });
  }

  /**
   * 根据base64(字符串)上传单张图片
   * @param fileObj 对象必须包含origPath属性
   * @returns {FileObj}
   */
  uploadByBase64(fileObj: FileObj): Observable<FileObj> {
    if (!fileObj.base64) {
      return Observable.of({});
    }
    return this.uploadMultiByBase64([fileObj]).map(res => {
      return res[0] || {};
    })
  }

  /**
   *  根据filePath(文件路径)批量上传图片
   * @param fileObjList 数组中的对象必须包含origPath属性
   * @returns {FileObj[]}
   */
  uploadMultiByFilePath(fileObjList: FileObj[]): Observable<FileObj[]> {
    if (fileObjList.length == 0) {
      return Observable.of([]);
    }
    return Observable.create((observer) => {
      this.nativeService.showLoading();
      let fileObjs = [];
      for (let fileObj of fileObjList) {
        this.nativeService.localIdToBase64(fileObj.origPath).then(data => {
          fileObjs.push({
            'base64': data.base64,
            'parameter': fileObj.parameter
          });
          if (fileObjs.length === fileObjList.length) {
            this.uploadMultiByBase64(fileObjs).subscribe(res => {
              this.nativeService.hideLoading();
              observer.next(res);
            })
          }
        })
      }
    });
  }

  /**
   * 根据filePath(文件路径)上传单张图片
   * @param fileObj 对象必须包含origPath属性
   * @returns {FileObj}
   */
  uploadByFilePath(fileObj: FileObj): Observable<FileObj> {
    if (!fileObj.origPath) {
      return Observable.of({});
    }
    return this.uploadMultiByFilePath([fileObj]).map(res => {
      return res[0] || {};
    })
  }

}
