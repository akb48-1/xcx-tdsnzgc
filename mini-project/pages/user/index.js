//index.js
//获取应用实例
import { username, clearCache } from '../../http/request.js'
import { queryUserInfoByToken } from '../../http/index.js'
const app = getApp()

Page({
    data: {
        logined: false,
        userInfo: {}
    },

    toLogin() {
        wx.navigateTo({
            url: '/views/login/index'
        })
        this.setData({
            logined: false,
            userInfo: {}
        })
    },
    toOutLogin() {
        wx.showModal({
            content: '确定退出登陆?',
            success: (sm) => {
                if (sm.confirm) {
                    clearCache()
                    this.setData({
                        userInfo: {},
                        logined: false
                    })
                    this.dialoglogin()
                }
            }
        })
    },
    dialoglogin() {
        wx.showModal({
            content: '是否需要重新登陆?',
            success: (sm) => {
                if (sm.confirm) {
                    this.toLogin()
                }
            }
        })
    },
    queryUserInfoByToken() {
        queryUserInfoByToken().then(res => {
            console.log(res)
            this.setData({
                userInfo: res.data
            })
            wx.setStorageSync('userInfo', res.data)
        })
    },
    onLoad: function() {
        this.setData({
            logined: !!wx.getStorageSync(username)
        })
        if (this.data.logined) {
            this.queryUserInfoByToken()
        }
    },
})