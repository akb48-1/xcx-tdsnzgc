//index.js
//获取应用实例
import { toLogin } from '../../http/index.js'
import { loginUsername, username } from '../../http/request.js'
import { refreshPage, toBackPage } from '../../utils/util'
const app = getApp()

Page({
    data: {
        maskShow: false,
        formData: {
            username: wx.getStorageSync(loginUsername),
            password: '',
        },
        rules: [{
            name: 'username',
            rules: [{
                required: true,
                message: '请输入用户名'
            }]
        }, {
            name: 'password',
            rules: [{
                required: true,
                message: '请输入密码'
            }]
        }]
    },
    toLogin() {
        this.setData({
            maskShow: true
        })
        toLogin(this.data.formData).then(res => {

            wx.showToast({
                title: '登陆成功',
                icon: 'none'
            })
            setTimeout(() => {

                wx.setStorageSync('token', res.data.token)

                refreshPage({
                    backPrevPage: true
                })

                wx.setStorageSync(loginUsername, this.data.formData.username);
                wx.setStorageSync(username, res.data.username);
                this.setData({
                    maskShow: false
                })
            }, 500);
        }).catch(() => {
            this.setData({
                maskShow: false
            })
        })
    },
    submit() {
        this.selectComponent('#form').validate((valid, errors) => {
            if (!valid) {
                const firstError = Object.keys(errors)
                if (firstError.length) {
                    wx.showToast({
                        title: errors[firstError[0]].message,
                        icon: 'none'
                    })
                }
            } else {
                this.toLogin()
            }
        })

    },
    reset() {
        this.setData({
            formData: {
                username: '',
                password: '',
            }
        })
    },
    formInputChange(e) {
        let field = 'formData.' + e.target.dataset.field;
        this.setData({
            [field]: e.detail.value
        })
    },
    onLoad: function() {

    },
})