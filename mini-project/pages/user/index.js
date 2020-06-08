//index.js
//获取应用实例
import { username, clearCache } from '../../http/request.js'
const app = getApp()

Page({
    data: {
        username: '',
        logined: false,
        organ_name: '未知'
    },

    toLogin() {
        wx.navigateTo({
            url: '/views/login/index'
        })
        this.setData({
            username: '',
            logined: false
        })
    },
    toOutLogin() {
        wx.showModal({
            content: '确定退出登陆?',
            success: (sm) => {
                if (sm.confirm) {
                    clearCache()
                    this.setData({
                        username: '',
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
    onLoad: function() {
        this.setData({
            username: wx.getStorageSync(username),
            logined: !!wx.getStorageSync(username)
        })
    },
})