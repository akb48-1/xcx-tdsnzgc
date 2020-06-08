//index.js
//获取应用实例
import { queryOrderByPage } from "../../http/index.js";

const app = getApp()

const column = [{
        title: '商品名',
        key: 'goods_name',
    },
    {
        title: '购买数量',
        key: 'amount',
    },
    {
        title: '计量单位',
        key: 'unit_name',
    }, {
        title: '单价',
        key: 'goods_price',
    },
    {
        title: '单项总价',
        key: 'goods_total_price',
    }
]

Page({
    data: {
        tabs: [{
            title: '卖出',
            type: 2
        }, {
            title: '买入',
            type: 1
        }],
        activeTab: 0,
        column: column,
        page: {
            pageNo: 1,
            pageSize: 10,
        },
        noMoreShow: false,
        orderList: [],
        orderStatus: {
            '1': '已付清',
            '2': '部分支付',
            '3': '未支付'
        }
    },

    onLoad: function() {
        this.init()
    },
    onTabClick(e) {
        this.setData({
            activeTab: e.currentTarget.dataset.index
        })
    },
    onChange(e) {
        this.setData({
            activeTab: e.currentTarget.dataset.index
        })
    },
    handleClick(e) {
        this.setData({
            activeTab: e.currentTarget.dataset.index
        })
    },
    init() {
        this.queryOrderByPage()
    },
    queryOrderByPage(params = {}) {
        !this.data.noMoreShow && queryOrderByPage({...this.data.page, ...params }).then(res => {

            let orderList = res.data.list;
            if (params.type === 'concat') {
                orderList = this.data.orderList.concat(orderList)
            }
            this.setData({
                orderList
            })

            if (res.data.total <= res.data.pageNo * res.data.pageSize) {
                this.setData({
                    noMoreShow: true
                })
            }

        })
    },

    onReachBottom() {

        this.setData({
            page: {
                ...this.data.page,
                pageNo: this.data.page.pageNo + 1
            }
        })
        this.queryOrderByPage({
            type: 'concat'
        })
    },
})