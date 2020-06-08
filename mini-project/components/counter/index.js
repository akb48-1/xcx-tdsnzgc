import { arrangeGoods, getShoppingCartData } from '../..//utils/util'

Component({
    data: {
    },
    properties: {
        info: {
            type: Object,
            default: {}
        }
    },
    methods: {
        add(e) {

            // if (this.data.info.count >= 1) {

            //     this.setData({
            //         info: {
            //             ...this.data.info,
            //             count: this.data.info.count + e.currentTarget.dataset.num
            //         }
            //     })
            // } else {
            //     if (e.currentTarget.dataset.num) {
            //         this.setData({
            //             info: {
            //                 ...this.data.info,
            //                 count: this.data.info.count + e.currentTarget.dataset.num
            //             }
            //         })
            //     }
            // }
            this.setData({
                info: {
                    ...this.data.info,
                    count: this.data.info.count + e.currentTarget.dataset.num
                }
            })
   
            this.changeToCart()

            this.triggerEvent('updateGoods')
        },
        changeToCart() {
            let info = JSON.parse(JSON.stringify(this.data.info))

            // 设置数量
            arrangeGoods(info)
        },
        init() {
            let allCartData = getShoppingCartData()

            allCartData.forEach(goods => {
                if (goods.goods_id == this.data.info.goods_id) {
                    this.setData({
                        info: goods
                    })
                }
            });
        }
    },
    created() {
        wx.nextTick(() => {
            this.init()
        })
    },
    pageLifetimes: {
        // 组件所在页面的生命周期声明对象，目前仅支持页面的show和hide两个生命周期
        show: function () {
            wx.nextTick(() => {
                this.init()
            })
        }
    }
})