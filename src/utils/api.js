/**
 * Created by Fu-Zhong on 2017/5/16.
 */
import Vue from 'vue'
import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)
import global_ from '../components/Global'
const hostAddr = global_.APIHOST  // 'http://b16t192394.iask.in/WXPlatJZD'

// /*
//  * 获取用户信息
//  */
// export let checkAccess = async () => {
//   console.log(`api called: wxAccess: ${hostAddr}/WXUtil/CheckAccess`)
//   let response = await Vue.http.post(`${hostAddr}/WXUtil/CheckAccess`, {
//     rawUrl: encodeURIComponent(window.location.href)
//   }).catch((error) => {
//     console.log(error)
//   })
//   console.log(response)
//   return await response.data
// }

/*
 * 获取学期列表信息
 */
export let getSmstLst = async () => {
  console.log(`api called: wxAccess: ${hostAddr}/Public/ScoreList`)
  let response = await Vue.http.post(`${hostAddr}/Public/SmstList`, {}).catch((error) => {
    console.log(error)
  })
  console.log(response)
  return await response.data
}
/*
 *获取资讯列表
 */
export let getList = async (page, tag) => {
  let response = await Vue.http.get(`${hostAddr}/news_list?pageIndex=${page}&pageSize=20&catalog=${tag}`, {
    method: 'GET',
    mode: 'cors'
  }).catch((error) => {
    console.log(error)
  })
  return await response.data
}
