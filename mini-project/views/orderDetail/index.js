//index.js

import { toFixed, setShoppingCartData } from "../../utils/util"
import { loadData } from "../../decorator/index.js";
import { queryAllPaymentType, queryAllShippingMethods, queryAllCarType, queryAllSeller, addOrder } from "../../http/index.js";


//获取应用实例
const app = getApp()

const column = [{
        title: '商品名',
        key: 'goods_name',
    },
    {
        title: '购买数量',
        key: 'count',
    },
    {
        title: '计量单位',
        key: 'unit_name',
    },
    {
        title: '单价',
        key: 'goods_price',
    },
    {
        title: '单项总价',
        key: 'goods_total_price',
    }
]

const rules = [{
    name: 'payment_price',
    rules: [{
        required: true,
        message: '请输入实付金额'
    }, {
        validator: function(rule, value, param, models) {
            if (isNaN(value)) {
                return wx.showToast({
                    title: '实付金额必须为数字',
                    icon: 'none'
                })
            } else {
                if (value > models.real_price) {
                    return wx.showToast({
                        title: '实付金额不可超出交易应付金额',
                        icon: 'none'
                    })
                }
                if (value < 0) {
                    return wx.showToast({
                        title: '实付金额不可输入负数',
                        icon: 'none'
                    })
                }
                if (value.indexOf('.') > -1) {
                    if (value.split('.')[1].length > 2) {
                        return wx.showToast({
                            title: '实付金额小数点后保留两位数',
                            icon: 'none'
                        })
                    }
                }
            }
        }
    }]
}, {
    name: 'payment_type',
    rules: [{
        required: true,
        message: '请选择支付方式'
    }]
}, {
    name: 'seller_id',
    rules: [{
        required: true,
        message: '请选择销售员'
    }]
}, {
    name: 'shipping_methods',
    rules: [{
        required: true,
        message: '请选择物流方式'
    }]
}, {
    name: 'car_type',
    rules: [{
        required: true,
        message: '请选择车型'
    }]
}, {
    name: 'order_time',
    rules: [{
        required: true,
        message: '请选择订单日期'
    }]
}]


Page({
    data: {
        maskShow: false,
        goodsList: wx.getStorageSync('selectedCartGoods') || [],
        column: column,
        rules: rules,
        formData: {},
        accountIndex: 0,
        paymentTypeList: [],
        shippingMethodsList: [],
        carTypeList: [],
        sellerList: [],
    },

    onLoad: function(options) {
        this.setData({
            goodsList: wx.getStorageSync('selectedCartGoods') || []
        })
        wx.nextTick(() => {
            let formData = {...this.data.formData }
            let order_price = 0;
            this.data.goodsList.forEach(item => {
                order_price += item.goods_total_price;
            })
            formData.real_price = formData.order_price = toFixed(order_price, 2)
            this.setData({
                formData
            })
        })
        this.init()
    },
    init() {
        this.queryAllPaymentType()
        this.queryAllShippingMethods()
        this.queryAllCarType()
        this.queryAllSeller()
    },
    // 支付方式
    queryAllPaymentType() {
        queryAllPaymentType().then(res => {
            this.setData({
                paymentTypeList: res.data
            })
        })
    },
    // 物流方式
    queryAllShippingMethods() {
        queryAllShippingMethods().then(res => {
            this.setData({
                shippingMethodsList: res.data
            })
        })
    },
    // 车辆类型
    queryAllCarType() {
        queryAllCarType().then(res => {
            this.setData({
                carTypeList: res.data
            })
        })
    },
    // 销售员
    queryAllSeller() {
        queryAllSeller().then(res => {
            this.setData({
                sellerList: res.data
            })
        })
    },
    formInputChange(e) {
        let field = 'formData.' + e.target.dataset.field;
        this.setData({
            [field]: e.detail.value
        })
    },
    bindDateChange(e) {
        let field = 'formData.' + e.target.dataset.field;
        this.setData({
            [field]: e.detail.value,
        })
    },
    bindPickerChange(e) {

        let field = 'formData.' + e.target.dataset.field;
        let name = 'formData.' + e.target.dataset.name;

        this.setData({
            [field]: this.data[e.target.dataset.range][e.detail.value][e.target.dataset.value],
            [name]: this.data[e.target.dataset.range][e.detail.value][e.target.dataset.name]
        })
    },
    submitOrder(data) {
        let newData = JSON.parse(JSON.stringify(data))
        newData.payment_price = Number(newData.payment_price)

        delete newData.shipping_methods_name;
        delete newData.payment_type_name;

        newData.goodsList = this.data.goodsList.map(item => {
            return {
                goods_id: item.goods_id,
                goods_name: item.goods_name,
                goods_price: item.goods_price,
                goods_total_price: item.goods_total_price,
                goods_desc: item.goods_desc,
                amount: item.count,
                unit_id: item.unit_id,
                unit_name: item.unit_name,
                organ_id: item.organ_id,
                type: 2 //交易类型( 1买入 2卖出)
            }
        })


        this.setData({
            maskShow: true
        })
        addOrder(newData).then(res => {

            setShoppingCartData([])
            wx.setStorageSync('selectedCartGoods', [])

            this.setData({
                goodsList: []
            })
            wx.showToast({
                title: `${res.message}`
            })

            setTimeout(() => {
                wx.reLaunch({
                    url: '/pages/shoppingCart/index'
                })
                this.setData({
                    maskShow: false
                })
            }, 1500);
        }).catch(() => {
            this.setData({
                maskShow: false
            })
        })

    },
    submitForm() {

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

                if (this.data.formData.payment_price == 0 && this.data.formData.payment_type != 4) {
                    wx.showModal({
                        title: '提示',
                        content: '付款金额为0,付款方式只可选择赊账，是否现在更改?',
                        success: (sm) => {
                            if (sm.confirm) {
                                this.setData({
                                    'formData.payment_type_name': this.data.paymentTypeList.find(item => item.payment_type_value == 4).payment_type_name,
                                    'formData.payment_type': 4 // 赊账
                                })

                                this.submitOrder(this.data.formData);
                            }
                        }
                    })
                } else if (this.data.formData.payment_type == 4 && this.data.formData.payment_price && this.data.formData.payment_price > 0) {
                    wx.showModal({
                        title: '提示',
                        content: '付款方式为赊账,付款方式只可填写0，是否现在更改?',
                        success: (sm) => {
                            if (sm.confirm) {
                                this.setData({
                                    'formData.payment_price': '0'
                                })

                                this.submitOrder(this.data.formData);
                            }
                        }
                    })
                } else {
                    this.submitOrder(this.data.formData)
                }

            }
        })
    }
})