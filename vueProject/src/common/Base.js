
export default {
    data() {
        
        return {
           
            ids: [],
            modal: false,
            filter: {
                list: [],
                total: 0,
                page: 1,
                rows: 10,
                name: ''
            }

        }
    },
    methods: {
        
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.formValidate.password = md5(this.formValidate.password).toString()
                    if (this.formValidate._id && this.formValidate._id.length > 0) {
                        //如果传入id了，就是编辑页，打开编辑页-----否则是新建，input里面没东西
                        this.$http.put(`http://localhost:3000/${this.module}/data/${this.formValidate._id}`, this.formValidate)
                            .then(res => {
                                this.$Message.success('提交成功!');
                                this.modal = false;
                                this.getData();
                            })
                    } else {
                        this.$http.post(`http://localhost:3000/${this.module}/data`, this.formValidate)
                            .then(res => {
                                this.$Message.success('提交成功!');
                                this.modal = false;
                                this.getData();
                            })
                    }


                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields();
        },
        onAdd() {
            this.modal = true;
            Object.assign(this.$data.formValidate, this.$options.data().formValidate);
            // 对象合并，并且初始表单数据
        },
        onSelectionChange(selection) {
            if (selection && selection.length > 0) {
                var ids = [];
                let selectionLen = selection.length;
                for (let i = 0; i < selectionLen; i++) {
                    ids.push(selection[i]._id);
                }
                this.ids = ids;
            }
        },
        onDeletes() {

            this.$Modal.confirm({
                title: '确认删除数据',
                content: '<p>确认删除该记录吗？</p>',
                onOk: () => {

                    this.$http.post(`http://localhost:3000/${this.module}/deletes`, { ids: this.ids.toString() })
                        .then(res => {
                            this.$Message.info('删除数据成功');
                            this.getData();
                        })

                },
                onCancel: () => {
                    // this.$Message.info('点击了取消');
                }
            });
        },
        show(row) {
            this.modal = true;
            Object.assign(this.$data.formValidate, row);
        },
        remove(id) {

            this.$Modal.confirm({
                title: '确认删除数据',
                content: '<p>确认删除该记录吗？</p>',
                onOk: () => {

                    this.$http.delete(`http://localhost:3000/${this.module}/data/${id}`)
                        .then(res => {
                            this.$Message.info('删除数据成功');
                            this.getData();
                        })

                },
                onCancel: () => {

                }
            });

        },
        getData() {
            ///这里改变了：1
            this.$http.post(`http://localhost:3000/${this.module}/list`, this.filter)
                .then(res => {
                    this.filter.list = res.data.rows;
                    this.filter.total = res.data.total;
                    this.filter.page = res.data.page;
                })
        },
        onChange(page) {
            this.filter.page = page;
            this.getData();
        },
        onPageSizeChange(pageSize) {
            this.filter.rows = pageSize;
            this.getData();
        },
        onSearch() {
            this.getData();
        }
    },
    created() {
        this.getData();
    }
}