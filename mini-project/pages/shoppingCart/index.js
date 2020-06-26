//index.js
import { getShoppingCartData, setShoppingCartData, toFixed } from '../../utils/util'
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

const order_info = {
    order_id: '',
    order_price: '',
    real_price: '',
    payment_price: '',
    payment_type: '',
    status: '',
    order_desc: '',
    order_goods_unique_ids: '',
    order_material_unique_ids: '',
    organ_id: '',
    seller_id: '',
    seller_name: '',
    shipping_methods: '',
    carriage: '',
    chauffeur_id: '',
    chauffeur_name: '',
    car_type_id: '',
    car_type_name: '',
}
Page({
    data: {
        BASE_URL: app.globalData.BASE_URL,
        goodsList: getShoppingCartData(),
        modalShow: false,
        column: column
    },

    onLoad: function(options) {},
    init() {
        let goodsList = getShoppingCartData().map(item => {
            item.goods_total_price = toFixed(item.count * item.goods_price, 2);

            return item;
        })
        this.setData({
            goodsList,
        })
    },
    updateGoods() {
        console.log('updateGoods')
        this.init()
    },
    clearCart() {
        if (!this.data.goodsList.length) {
            return;
        }
        let that = this;
        wx.showModal({
            content: '确定清空吗',
            success(res) {
                if (res.confirm) {
                    setShoppingCartData([])

                    that.setData({
                        goodsList: getShoppingCartData()
                    })

                }
            }
        })

    },
    submit() {
        if (!this.data.goodsList.length) {
            return;
        }

        this.setData({
            modalShow: true
        })
        return;
        wx.showModal({
            title: '提示',
            content: '确定提交订单吗?',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    confirm(e) {

        let obj = {...order_info };
        obj.order_price = 0;
        this.data.goodsList.forEach(item => obj.order_price += item.goods_total_price)
        obj.order_price = toFixed(obj.order_price, 2)
        setTimeout(() => {

            wx.setStorageSync('selectedCartGoods', this.data.goodsList)

            e.detail.that.setData({
                ...e.detail.data
            })

            wx.navigateTo({
                url: '../../views/orderDetail/index'
            })
        }, 10);
    },
    onShow: function() {
        this.init()
    },
})