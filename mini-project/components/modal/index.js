Component({
    options: {
        multipleSlots: true
    },

    properties: {
        show: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: ''
        }
    },

    data: {
        loading: false
    },

    methods: {

        selfConfirm() {

            if (this.data.loading) return;
            this.setData({
                loading: true
            })
            this.triggerEvent('confirm', { that: this, data: { show: false, loading: false } })
        },
        
        selfCancel() {
            this.setData({
                show: false
            })
        },
    },
    created() {
    }
})