import { http } from '../http/request.js'

/*
    作用：提前加载资源
    参数：key => 组件内使用的数据 this[key]。
         url => 资源接口地址。

    使用展示:
    var that = this;
    loadData([{
        key: 'classifyList',
        url: '/classify/queryAll',
    }, {
        key: 'unitList',
        url: '/unit/queryAll',
    }], that)
 */
export function loadData(arr = [], that) {
    console.log(that, 77777)

    var newData = {};
    arr.forEach(item => {
        if (item.url) {
            newData[item.key] = [];
            http({
                method: item.method || 'post',
                url: item.url,
            }).then(res => {
                console.log(res)
                newData[item.key].push(...res.data)

                that.setData({
                    [item.key]: res.data
                })
            })
        }
    })

}



/*
    作用：二次提交确认
    参数：msg => 提示框的提示语。

    使用展示: 
    @confirmTips("启动搜索?", "info")
    formSearch() {
        ...doSomething
    }
 */
export function confirmTips(msg = '确定执行此操作？', type = 'warning') {

    return function(target, key, descriptor) {

        let orignEvent = descriptor.value;

        descriptor.value = function(...args) {

            this.$confirm(msg, '提示', {
                    type: type
                })
                .then(orignEvent.bind(this, ...args))
                .catch((err) => {})
        }

        return descriptor;
    }
}

export function confirmWinGen(msg = '确定执行此操作？', type = 'warning') {

    return function(target, key, descriptor) {

        let orignEvent = descriptor.value;

        descriptor.value = function(...args) {

            this.$confirm(msg, '提示', {
                type: type,
                loading: false,
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        orignEvent.call(this, ...args).then(() => {
                            done()
                        }).finally(() => {
                            instance.confirmButtonLoading = false;
                        })
                    } else {
                        done();
                    }
                },
            })
        }

        return descriptor;
    }
}



/* 
    作用：dialog 表单提交前需通过验证
    参数：formRef => 对应 this.$refs[formRef]。
    使用展示:
    @validate('dialogForm')
    confirmEvent(...args) {
      this.submit({...params}, ...args);
    }
 */
export function validate(formRef) {

    return function(target, key, descriptor) {

        let orignEvent = descriptor.value;

        descriptor.value = function(...args) {
            return new Promise((resolve, reject) => {
                this.$refs[formRef].validate(valid => {
                    if (valid) {
                        orignEvent.call(this, ...args, resolve, reject)
                    } else {
                        reject()
                    }
                })
            })

        }

        return descriptor;
    }
}