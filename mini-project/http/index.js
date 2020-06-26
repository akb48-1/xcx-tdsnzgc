import { http } from './request.js'


/* 登录 */
export function toLogin(params = {}) {
    return http({
        method: 'post',
        url: '/toLogin',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        // data: qs.stringify(params)
        data: 'username=' + params.username + '&password=' + params.password
    });
}

// 查询所有分类
export function queryAllClassify() {
    return http({
        url: '/classify/queryAll',
        methods: 'post',
    })
}

// 查询商品
export function queryGoodsByPage(params = {}) {
    return http({
        url: '/goods/queryByPage',
        methods: 'post',
        data: params
    })
}

// 查询所有单位
export function queryAllUnit() {
    return http({
        url: '/unit/queryAll',
        methods: 'post'
    })
}

// 查询所有支付方式
export function queryAllPaymentType() {
    return http({
        url: '/paymentType/queryAll',
        methods: 'post'
    })
}

// 查询所有物流方式
export function queryAllShippingMethods() {
    return http({
        url: '/shippingMethods/queryAll',
        methods: 'post'
    })
}


// 查询所有车型
export function queryAllCarType() {
    return http({
        url: '/carType/queryAll',
        methods: 'post'
    })
}

// 查询所有车型
export function queryAllSeller() {
    return http({
        url: '/seller/queryAll',
        methods: 'post'
    })
}

// 查询所有车型
export function addOrder(params = {}) {
    return http({
        url: '/order/addOrder',
        methods: 'post',
        data: params
    })
}

// 查询翻页订单
export function queryOrderByPage(params = {}) {
    return http({
        url: '/order/queryByPage',
        methods: 'post',
        data: params
    })
}

// 本商铺所有banner图
export function queryAllBanner(params = {}) {
    return http({
        url: '/banner/queryAll',
        methods: 'post',
        data: params
    })
}

// 本商铺所有banner图
export function queryUserInfoByToken() {
    return http({
        url: '/user/queryUserInfoByToken',
        methods: 'post'
    })
}