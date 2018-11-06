/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import { Injectable } from '@angular/core';
import {
  Headers,
  Http,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TimeoutError } from 'rxjs/util/TimeoutError';
import 'rxjs/add/operator/timeout';
import { Utils } from './Utils';
import { GlobalData } from './GlobalData';
import { NativeService } from './NativeService';
import { APP_SERVE_URL, IS_DEBUG, REQUEST_TIMEOUT } from './Constants';
import { Logger } from './Logger';
import { Events } from 'ionic-angular';

@Injectable()
export class HttpService {

  constructor(public http: Http,
              public globalData: GlobalData,
              public logger: Logger,
              private events: Events,
              public nativeService: NativeService) {
  }

  public get(url: string, paramMap: any = null, useDefaultApi = true): Observable<any> {
    const options = new RequestOptions({
      method: RequestMethod.Get,
      search: HttpService.buildURLSearchParams(paramMap)
    });
    return useDefaultApi ? this.defaultRequest(url, options) : this.request(url, options);
  }

  public post(url: string, body: any = {}, useDefaultApi = true): Observable<any> {
    const options = new RequestOptions({
      method: RequestMethod.Post,
      body,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    });
    return useDefaultApi ? this.defaultRequest(url, options) : this.request(url, options);
  }

  public postFormData(url: string, paramMap: any = null, useDefaultApi = true): Observable<any> {
    const options = new RequestOptions({
      method: RequestMethod.Post,
      body: HttpService.buildURLSearchParams(paramMap).toString(),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    });
    return useDefaultApi ? this.defaultRequest(url, options) : this.request(url, options);
  }

  public delete(url: string, paramMap: any = null, useDefaultApi = true): Observable<any> {
    const options = new RequestOptions({
      method: RequestMethod.Delete,
      search: HttpService.buildURLSearchParams(paramMap)
    });
    return useDefaultApi ? this.defaultRequest(url, options) : this.request(url, options);
  }

  /**
   * 一个app可能有多个后台接口服务(api),针对主api添加业务处理,非主api请调用request方法
   */
  public defaultRequest(url: string, options: RequestOptionsArgs): Observable<any> {
    //  使用默认API:APP_SERVE_URL
    url = Utils.formatUrl(url.startsWith('http') ? url : APP_SERVE_URL + url); // tslint:disable-line
    //  添加请求头
    options.headers = options.headers || new Headers();
    options.headers.append('Authorization', 'Bearer ' + this.globalData.token);

    return Observable.create(observer => {
      this.request(url, options).subscribe(res => {
        //  后台api返回统一数据,res.code===1表示业务处理成功,否则表示发生异常或业务处理失败
        if (res.code === 1) {
          observer.next(res.data);
        } else {
          IS_DEBUG && console.log('%c 请求处理失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', res);
          //  401 token无效或过期需要重新登录
          if (res.code == 401) {
            this.nativeService.showToast('密码已过期,请重新登录');
            this.events.publish('user:reLogin'); //  跳转到登录页面
          } else {
            this.nativeService.alert(res.msg || '请求失败,请稍后再试!');
          }
          observer.error(res.data);
        }
      });
    });
  }

  public request(url: string, options: RequestOptionsArgs): Observable<any> {
    IS_DEBUG && console.log('%c 请求发送前 %c', 'color:blue', '', 'url', url, 'options', options);
    this.showLoading();
    return Observable.create(observer => {
      this.http.request(url, options).timeout(REQUEST_TIMEOUT).subscribe(res => {
        try {
          observer.next(res.json());
        } catch (e) {
          observer.next(res);
        }
        IS_DEBUG && console.log('%c 请求发送成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
        this.hideLoading();
      }, err => {
        observer.error(this.requestFailedHandle(url, options, err));
        this.hideLoading();
        IS_DEBUG && console.log('%c 请求发送失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
      });
    });
  }

  /**
   * 处理请求失败事件
   */
  private requestFailedHandle(url: string, options: RequestOptionsArgs, err: Response) {
    if (err instanceof TimeoutError) {
      this.nativeService.alert('请求超时,请稍后再试!');
    } else {
      const status = err.status;
      let msg = '请求发生异常';
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }
      this.nativeService.alert(msg);
      this.logger.httpLog(err, msg, {
        url,
        status
      });
    }
    return err;
  }

  /**
   * 将对象转为查询参数
   */
  private static buildURLSearchParams(paramMap): URLSearchParams {
    const params = new URLSearchParams();
    if (!paramMap) {
      return params;
    }
    Object.keys(paramMap).forEach(key => {
      let val = paramMap[key];
      if (val instanceof Date) {
        val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss');
      }
      params.set(key, val);
    });
    return params;
  }

  private count = 0; //  记录未完成的请求数量,当请求数为0关闭loading,当不为0显示loading

  private showLoading() {
    if (++this.count > 0) {// 一旦有请求就弹出loading
      this.globalData.showLoading && this.nativeService.showLoading();
    }
  }

  private hideLoading() {
    if (this.globalData.showLoading) {
      // 延迟处理可以避免嵌套请求关闭了第一个loading,突然后弹出第二个loading情况(结合nativeService.showLoading())
      setTimeout(() => {
        if (--this.count === 0) {// 当正在请求数为0,关闭loading
          this.nativeService.hideLoading();
        }
      }, 200);
    } else {
      this.globalData.showLoading = true;
    }
  }
}
