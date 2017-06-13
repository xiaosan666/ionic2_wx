/**
 * Created by yanxiaojun617@163.com on 12-27.
 */
import {Injectable} from '@angular/core';
import {
  Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod
} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import {Utils} from "./Utils";
import {GlobalData} from "./GlobalData";
import {NativeService} from "./NativeService";
import {AlertController} from "ionic-angular";
import {APP_SERVE_URL} from "./Constants";

@Injectable()
export class HttpService {

  constructor(public http: Http,
              private globalData: GlobalData,
              private nativeService: NativeService,
              private alertCtrl: AlertController) {
  }

  public request(url: string, options: RequestOptionsArgs): Observable<Response> {
    url = HttpService.replaceUrl(url);
    if (options.headers) {
      options.headers.append('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzNzE1OGYxYjVjYTU0MzRmYjZmMjcwNGEwMDZkOWY3OCIsImNsaWVudF9pZCI6ImFwcCIsImV4cCI6MTQ5OTQ5NzAwMywianRpIjoiZDIwNjQ4YmFhNDU2NDQzOGIyYTgzNTk2MGM1NTgyM2IiLCJtb2JpbGVOdW1iZXIiOiIxMzMzMzMzMzMzMyJ9.JBnlKhGX5pNW8Zy605kYhnfZskuucf_fDgNoK8Hxvri7RcRmAHKNnkmTXw7RPjX0alh0QuZFEHGfLXcM7Smucg');
    } else {
      options.headers = new Headers({
        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzNzE1OGYxYjVjYTU0MzRmYjZmMjcwNGEwMDZkOWY3OCIsImNsaWVudF9pZCI6ImFwcCIsImV4cCI6MTQ5OTQ5NzAwMywianRpIjoiZDIwNjQ4YmFhNDU2NDQzOGIyYTgzNTk2MGM1NTgyM2IiLCJtb2JpbGVOdW1iZXIiOiIxMzMzMzMzMzMzMyJ9.JBnlKhGX5pNW8Zy605kYhnfZskuucf_fDgNoK8Hxvri7RcRmAHKNnkmTXw7RPjX0alh0QuZFEHGfLXcM7Smucg'
      });
    }
    return Observable.create((observer) => {
      this.nativeService.showLoading();
      console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
      this.http.request(url, options).subscribe(res => {
        this.nativeService.hideLoading();
        console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
        observer.next(res);
      }, err => {
        this.requestFailed(url, options, err);//处理请求失败
        observer.error(err);
      });
    });
  }

  public get(url: string, paramMap: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Get,
      search: HttpService.buildURLSearchParams(paramMap)
    }));
  }


  public post(url: string, body: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Post,
      body: body,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }));
  }

  public postFormData(url: string, paramMap: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Post,
      search: HttpService.buildURLSearchParams(paramMap).toString(),
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
    }));
  }

  public put(url: string, body: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Put,
      body: body,
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8'
      })
    }));
  }

  public delete(url: string, paramMap: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Delete,
      search: HttpService.buildURLSearchParams(paramMap).toString()
    }));
  }

  public patch(url: string, body: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Patch,
      body: body
    }));
  }

  public head(url: string, paramMap: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Head,
      search: HttpService.buildURLSearchParams(paramMap).toString()
    }));
  }

  public options(url: string, paramMap: any = null): Observable<Response> {
    return this.request(url, new RequestOptions({
      method: RequestMethod.Options,
      search: HttpService.buildURLSearchParams(paramMap).toString()
    }));
  }

  /**
   * 将对象转为查询参数
   * @param paramMap
   * @returns {URLSearchParams}
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
   * 处理请求失败事件
   * @param url
   * @param options
   * @param err
   */
  private requestFailed(url: string, options: RequestOptionsArgs, err) {
    this.nativeService.hideLoading();
    console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
    let msg = '';
    try {
      let error = err.json();
      msg = error.msg || '请求发生异常';
    } catch (e) {
      let status = err.status;
      if (status === 0) {
        msg = '请求失败，请求响应出错';
      } else if (status === 404) {
        msg = '请求失败，未找到请求地址';
      } else if (status === 500) {
        msg = '请求失败，服务器出错，请稍后再试';
      }
    }
    this.alertCtrl.create({
      title: msg,
      subTitle: status,
      buttons: [{text: '确定'}]
    }).present();
  }

  /**
   * url中如果有双斜杠替换为单斜杠
   * 如:http://88.128.18.144:8080//api//demo.替换后http://88.128.18.144:8080/api/demo
   * @param url
   * @returns {string}
   */
  private static replaceUrl(url) {
    if (url.indexOf('http://') == -1) {
      url = APP_SERVE_URL + url;
    }
    return 'http://' + url.substring(7).replace(/\/\//g, '/');
  }
}
