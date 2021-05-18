import axios from 'axios';
import { Message } from 'view-design';
import router from '../router'

const instance = axios.create({
  // baseURL: 'http://im.lczeros.cn/IM',
  baseURL: 'http://127.0.0.1:8085/IM',
  timeout: 10000,
  headers: {
    'Content-Type': "application/json;charset=UTF-8",
  },
  withCredentials: true,
});
// 请求拦截器,检测是否有token并携带
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token !== null & token !== '') {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
instance.interceptors.response.use(
  response => {
    //拦截失效token
    if(response.data.code == 4107){
      router.push("/login")
      // 清除过期信息
      localStorage.removeItem("token")
      localStorage.removeItem("UserData")
      Message.info('登录已过期,请重新登陆');
      // 使用windows跳转无法保存状态
      // window.location.href='/login?type=4107'
    }
    return response
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default {
  showMessage(e){
    this.$Message(e)
  },
  //无需权限
  UserLogin(data){
    return instance.post("/user/userLogin",data)
  },
  UserRegister(data){
    return instance.post("/user/userRegister",data)
  },
  GetMailCode(data){
    return instance.post("/blog/getMailCode",data)
  },
  GetCommentList(blogId){
		return instance.get(`/blog/getCommentList?blogId=${blogId}`)
	},

  //需要权限
  GetUserData(){
    return instance.post("/user/getUserData")
  },
  GetUserRelationShip(){
    return instance.post("/user/getUserRelationShip")
  },

  //上传接口
  UploadImage(data){
    return instance.post("/upload/image",data)
  },

  // 管理端接口
  GetUserList(){
    return instance.post("/admin/getUserList")
  },
  GetBlogList(){
    return instance.post("/blog/getBlogList?userName=")
  },
  BanUser(userName){
    return instance.get(`/admin/banUser?userName=${userName}`)
  },
  UnBanUser(userName){
    return instance.get(`/admin/unBanUser?userName=${userName}`)
  }
}
