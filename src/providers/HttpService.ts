/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';
import {Observable, TimeoutError} from "rxjs";
import {Utils} from "./Utils";
import {GlobalData} from "./GlobalData";
import {NativeService} from "./NativeService";
import {APP_SERVE_URL, REQUEST_TIMEOUT, IS_DEBUG} from "./Constants";
import {Logger} from "./Logger";

@Injectable()
export class HttpService {

  constructor(public http: Http,
              public globalData: GlobalData,
              public logger: Logger,
              public nativeService: NativeService) {
  }

  public request(url: string, options: RequestOptionsArgs): Observable<Response> {
    url = this.formatUrlDefaultApi(url);
    if (url.indexOf(APP_SERVE_URL) != -1) {
      options = this.addAuthorizationHeader(options);
    }
    IS_DEBUG && console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
    this.nativeService.showLoading();
    return Observable.create(observer => {
      this.http.request(url, options).timeout(REQUEST_TIMEOUT).subscribe(res => {
        let result = this.requestSuccessHandle(url, options, res);
        result.success ? observer.next(result.data) : observer.error(result.data);
      }, err => {
        observer.error(this.requestFailedHandle(url, options, err));
      });
    });
  }


  public get(url: string, paramMap: any = null): Observable<any> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Get,
      search: HttpService.buildURLSearchParams(paramMap)
    }));
  }

  public post(url: string, body: any = {}): Observable<any> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Post,
      body: body,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }));
  }

  public postFormData(url: string, paramMap: any = null): Observable<any> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Post,
      body: HttpService.buildURLSearchParams(paramMap).toString(),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    }));
  }

  public put(url: string, body: any = {}): Observable<any> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Put,
      body: body
    }));
  }

  public delete(url: string, paramMap: any = null): Observable<any> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Delete,
      search: HttpService.buildURLSearchParams(paramMap).toString()
    }));
  }

  public patch(url: string, body: any = {}): Observable<any> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Patch,
      body: body
    }));
  }


  /**
   * 处理请求成功事件
   */
  requestSuccessHandle(url: string, options: RequestOptionsArgs, res: Response) {
    this.nativeService.hideLoading();
    let json = res.json();
    if (url.indexOf(APP_SERVE_URL) != -1) {
      if (json.code != 1) {
        IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', res);
        this.nativeService.alert(json.msg || '请求失败,请稍后再试!');
        return {success: false, data: json.data};
      } else {
        IS_DEBUG && console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
        return {success: true, data: json.data};
      }
    } else {
      return {success: true, data: json};
    }
  }


  /**
   * 处理请求失败事件
   */
  private requestFailedHandle(url: string, options: RequestOptionsArgs, err: Response) {
    IS_DEBUG && console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
    this.nativeService.hideLoading();
    if (err instanceof TimeoutError) {
      this.nativeService.alert('请求超时,请稍后再试!');
    }else {
      let status = err.status;
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
        url: url,
        status: status
      });
    }
    return err;
  }

  /**
   * 将对象转为查询参数
   */
  private static buildURLSearchParams(paramMap): URLSearchParams {
    let params = new URLSearchParams();
    if (!paramMap) {
      return params;
    }
    for (let key in paramMap) {
      let val = paramMap[key];
      if (val instanceof Date) {
        val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
      }
      params.set(key, val);
    }
    return params;
  }

  /**
   * 格式化url使用默认API地址:APP_SERVE_URL
   */
  private formatUrlDefaultApi(url: string = ''): string {
    return Utils.formatUrl(url.startsWith('http') ? url : APP_SERVE_URL + url)
  }

  /**
   * 给请求头添加权限认证token
   */
  private addAuthorizationHeader(options: RequestOptionsArgs): RequestOptionsArgs {
    let token = this.globalData.token;
    if (options.headers) {
      options.headers.append('Authorization', 'Bearer ' + token);
    } else {
      options.headers = new Headers({
        'Authorization': 'Bearer ' + token
      });
    }
    return options;
  }

}
