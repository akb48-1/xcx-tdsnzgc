export const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 整理购物车里的商品
export function arrangeGoods(goods) {
    let allCartData = getShoppingCartData()

    let index = allCartData.findIndex(item => item.goods_id == goods.goods_id);
    if (index > -1) {
        allCartData[index] = goods;
    } else {
        allCartData.push(goods)
    }

    allCartData = allCartData.filter(item => item.count)
    setShoppingCartData(allCartData)
}

// 获取所有购物车里的商品
export function getShoppingCartData() {
    return wx.getStorageSync('shoppingCartData') || []
}

// 设置所有购物车里的商品
export function setShoppingCartData(allGoodsData) {
    Array.isArray(allGoodsData) && wx.setStorageSync('shoppingCartData', allGoodsData)
}

// 序列化参数为url参数
export function objToUrl(obj) {
    let arr = [];
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return '?' + arr.join("&");
}

// 登陆后刷新
export function refreshPage(params = {}) {

    let allPage = getCurrentPages()

    if (allPage.length != 0) {

        if (params.backPrevPage) {

            let prevPage = allPage[allPage.length - 2]

            if (prevPage) {
                wx.reLaunch({
                    url: '/' + prevPage.route + objToUrl(prevPage.options)
                })
            } else {
                wx.reLaunch({
                    url: '/pages/user/index'
                })
            }

        }
    }
}

export function toFixed(numbber = 0, num = 2) {
    let numStr = numbber.toFixed(num + 1);
    numStr = numStr.slice(0, numStr.length - 1);
    return Number(numStr)
}