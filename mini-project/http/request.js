let BASE_URL = 'http://192.168.43.127:8088';
const app = getApp()
const envVersion = __wxConfig.envVersion;
if (envVersion === 'develop') {
    BASE_URL = 'http://192.168.43.127:8088';
}
app.globalData.BASE_URL = BASE_URL;


const loginPage = 'views/login/index';

export const loginUsername = 'loginUsername';
export const username = 'username';

export function clearCache() {
    let cacheUsername = wx.getStorageSync(loginUsername)
    wx.clearStorageSync()
    wx.setStorageSync(loginUsername, cacheUsername)
}

export function http(params = {}) {
    return new Promise((resolve, reject) => {
        let header = {
            token: wx.getStorageSync('token')
        }

        if (params.url == '/toLogin') {
            delete header.token
        }

        wx.request({
            url: BASE_URL + params.url,
            method: params.method || 'POST',
            header: {...header, ...params.header },
            data: params.data || {},
            dataType: 'json',
            success(res) {

                var data = res.data;

                if (data && data.success) {

                    resolve(res.data);

                } else {
                    wx.showToast({
                        title: data.message,
                        icon: 'none'
                    })
                    if (data.code === 403 || data.code === 500) {

                        clearCache()

                        let allPage = getCurrentPages()
                        if (allPage[allPage.length - 1].route != loginPage) {

                            wx.nextTick(() => {
                                wx.navigateTo({
                                    url: '/' + loginPage
                                })
                            })
                        }
                    }
                    reject();
                }
            },
            fail(err) {
                wx.showToast({
                    title: '无法连接到服务器',
                    icon: 'none'
                })
                reject(err)
            },
        })
    })
}