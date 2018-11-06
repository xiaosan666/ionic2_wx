/*----------------------------------------后台Api地址----------------------------------------*/
export const api_dev = 'http://88.128.18.144:8109/api/';
export const api_prod = 'http://xiaojun8109.ngrok.cc/api/';

/*----------------------------------------文件服务器地址----------------------------------------*/
export const file_api_dev = 'http://88.128.18.144:3333';
export const file_api_prod = 'http://172.16.19.86/kit_file_server';

/*----------------------------------------微信认证服务api----------------------------------------*/
export const wx_api_dev = 'http://88.128.19.209:8102/api/ak/prod_ktxx'; // js安全域名: http://88.128.19.209:8100/?vconsole=show
// export const wx_api_dev = 'http://88.128.19.209:8102/api/ak/yanxiaojun';//js安全域名: http://88.128.19.209:8100/?vconsole=show
// export const wx_api_prod = 'http://172.16.19.204:8102/api/ak/prod_en168';
export const wx_api_prod = 'http://172.16.19.204:8102/api/ak/prod_ktxx';

export const IS_DEBUG = true; // 是否开发(调试)模式
export const APP_SERVE_URL = IS_DEBUG ? api_dev : api_prod;
export const FILE_SERVE_URL = IS_DEBUG ? file_api_dev : file_api_prod;
export const WX_SERVE_URL = IS_DEBUG ? wx_api_dev : wx_api_prod;

export const REQUEST_TIMEOUT = 20000; // 请求超时时间,单位为毫秒
export const FUNDEBUG_API_KEY = 'acb7e1cd807c04a61a9ce78f6370a6b30e06180097498f00a680269ef85a4851'; // 去 https://fundebug.com/ 申请key

