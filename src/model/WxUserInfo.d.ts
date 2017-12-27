/**
 * 微信用户信息
 * 如果认证方式为snsapi_base，则只能获取openid和unionId（unionId需要公众号绑定了微信开放平台）
 * 如果认证方式为snsapi_userinfo，则可以获取微信用户详细信息
 */
export interface WxUserInfo {
  city?: "";//广州
  country?: "";//中国
  groupId?: "";
  headImgUrl?: "";//头像url http://wx.qlogo.cn/mmopen/vi_32/1FrR5TKmODbdxQ45HQMYd5aOWibKbNicN6FIjriawic2ca45EAgOQEoHq6UcZdSgYWB7qoCI8sQ5r16EaJF0ypFbfQ/0
  language?: "";//语言 zh_CN
  nickname?: "";//昵称 小军
  openId?: ""; //openId of9yW0uyk0peUE8YWSWw4D1OxjdE
  province?: "";//广东
  remark?: "";
  sex?: "";//男
  sexId?: "";//1
  subscribe?: "";
  subscribeTime?: "";
  tagIds?: "";
  unionId?: "" //unionId oZqYowiV9glELVFoaLKosTvOwgQU
}

