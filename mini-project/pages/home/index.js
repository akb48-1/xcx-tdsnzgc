//index.js
//获取应用实例
const app = getApp()

import { queryAllClassify, queryGoodsByPage, queryAllUnit } from '../../http/index.js'
import { getShoppingCartData } from '../..//utils/util'

Page({
    data: {
        BASE_URL: app.globalData.BASE_URL,
        background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 2000,
        duration: 500,
        classifyList: [],
        goodsList: [],
        unitList: [],
        selectClassifyIds: [],
        page: {
            pageNo: 1,
            pageSize: 10,
        },
        noMoreShow: false,
    },

    queryClassifyList() {
        queryAllClassify().then(res => {
            res.data.forEach(element => {
                element.active = false
            });
            let data = [{ active: true, classify_id: '', classify_name: '全部' }, ...res.data]

            this.setData({
                classifyList: data
            })
        })
    },
    selectClassify(e) {
        let ids = e.currentTarget.dataset.classify_id;

        if (ids === '') {
            this.setData({
                selectClassifyIds: [],
                classifyList: this.data.classifyList.map(item => {
                    if (item.classify_id == ids) {
                        item.active = true
                    } else {
                        item.active = false
                    }
                    return item
                })
            })
            this.setData({
                noMoreShow: false
            })
            this.search()
            return;
        } else {
            this.setData({
                classifyList: this.data.classifyList.map(item => {
                    if (item.classify_id == '') {
                        item.active = false
                    }
                    return item
                })
            })
        }

        if (this.data.selectClassifyIds.includes(ids)) {
            this.setData({
                selectClassifyIds: this.data.selectClassifyIds.filter(item => item != ids),
                classifyList: this.data.classifyList.map(item => {
                    if (item.classify_id == ids) {
                        item.active = !item.active
                    }
                    return item
                })
            })
        } else {
            this.setData({
                selectClassifyIds: [...this.data.selectClassifyIds, ids],
                classifyList: this.data.classifyList.map(item => {
                    if (item.classify_id == ids) {
                        item.active = !item.active
                    }
                    return item
                })
            })
        }


        if (!this.data.selectClassifyIds.length) {
            this.setData({
                classifyList: this.data.classifyList.map(item => {
                    if (item.classify_id == "") {
                        item.active = true
                    }
                    return item
                })
            })
        }
        this.setData({
            noMoreShow: false
        })
        this.search()
    },
    search() {
        let ids = this.data.selectClassifyIds.join(',')

        this.setData({
            page: {
                ...this.data.page,
                pageNo: 1,
            }
        })
        this.queryGoodsByPage({
            classify_ids: ids
        })
    },
    queryGoodsByPage(params = {}) {
        !this.data.noMoreShow && queryGoodsByPage({...this.data.page, ...params }).then(res => {

            let goodsList = res.data.list.map(goods => {
                goods.unit_name = this.data.unitList.find(unit => unit.unit_id == goods.unit_id).unit_name;

                let oldGoods = getShoppingCartData().find((item => item.goods_id === goods.goods_id)) || {}
                goods.count = oldGoods.count || 0
                return goods;
            })
            if (params.type === 'concat') {
                goodsList = this.data.goodsList.concat(goodsList)
            }
            this.setData({
                goodsList
            })

            if (res.data.total <= res.data.pageNo * res.data.pageSize) {
                this.setData({
                    noMoreShow: true
                })
            }

        })
    },
    queryAllUnit() {
        queryAllUnit().then(res => {
            this.setData({
                unitList: res.data
            })

            this.queryGoodsByPage({
                classify_ids: ''
            })
        })
    },
    resetCount() {
        let goodsList = this.data.goodsList.map(goods => {

            if (!getShoppingCartData().length) {
                goods.count = 0;
                return goods;
            } else {
                getShoppingCartData().forEach(data => {
                    console.log(data.goods_id == goods.goods_id, goods.goods_name)
                    if (data.goods_id == goods.goods_id) {
                        goods.count = data.count;
                    } else {
                        goods.count = 0;
                    }
                })
                return goods;
            }
        })

        this.setData({
            goodsList
        })
    },
    init() {
        this.queryClassifyList()
        this.queryAllUnit()
    },
    onLoad: function(options) {
        this.init()
    },
    onReachBottom() {

        this.setData({
            page: {
                ...this.data.page,
                pageNo: this.data.page.pageNo + 1
            }
        })
        this.queryGoodsByPage({
            type: 'concat'
        })
    },
    onShow() {
        this.resetCount()
    }
})