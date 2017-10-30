<template>
    <div>
        <Button type="primary" @click="onAdd">添加</Button>
        <Button type="error" @click="onDeletes">删除多条记录</Button>
        <Input v-model="filter.name">
            <Button slot="append" icon="ios-search" @click="onSearch" ></Button>
        </Input>

        <Table border :columns="columns" :data="filter.list" @on-selection-change="onSelectionChange"></Table><br>
        <!-- <Button @click="handleSelectAll(true)">设置全选</Button>
        <Button @click="handleSelectAll(false)">取消全选</Button><br><br> -->
        <Page :total="filter.total" size="small"  
        show-total show-elevator show-sizer
        @on-change="onChange"
        @on-page-size-change="onPageSizeChange"></Page>


         <Modal
            v-model="modal"
            title="数据操作"
        >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">                
                <FormItem label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input v-model="formValidate.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem label="年龄" prop="age">
                    <Input v-model="formValidate.age" placeholder="请输入年龄"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="formValidate.email" placeholder="请输入邮箱"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Modal>


    </div>
</template>
<script>
    export default {
        data () {
            const validateAge = (rule, value, callback) => {
           
                // 模拟异步验证效果
                console.log(value)

                var reg=/^[1-9]\d?$|^1[0-4]\d$|^0$|^150$/ 
                setTimeout(() => {
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的年龄'));
                    } else {
                         callback();
                    }
                }, 1000);
            };
            const validateEmail = (rule, value, callback) => {
           
                // 模拟异步验证效果
                console.log(value)

                var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ 
                setTimeout(() => {
                    if (!reg.test(value)) {
                        callback(new Error('请输入正确的邮箱'));
                    } else {
                         callback();
                    }
                }, 1000);
            };
            return {
                formValidate: {
                    name: '',
                    password: '',
                    age: '',
                    email: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ],
                    age: [
                        {  validator: validateAge, trigger: 'blur' }
                    ],
                    email: [
                          { required: true, validator: validateEmail, trigger: 'blur' }
                    ]
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        
                    },
                    {
                        
                        title: '账号',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '密码',
                        key: 'password'
                    },
                    {
                        title: '年龄',
                        key: 'age',
                        sortable: true
                    },
                    {
                        title: '邮箱',
                        key: 'email'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.row)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row._id)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                ids:[],
                modal: false,
                filter:{
                    list:[],
                    total:0,
                    page:1,
                    rows:10,
                    name:''
                }
                
            }
        },
        methods: {
            //全选
            // handleSelectAll (status) {
            //     this.$refs.selection.selectAll(status);
            // },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.formValidate._id && this.formValidate._id.length>0){
                            //如果传入id了，就是编辑页，打开编辑页-----否则是新建，input里面没东西
                            this.$http.put(`http://localhost:3000/users/data/${this.formValidate._id}`,this.formValidate)
                            .then(res=>{
                                this.$Message.success('提交成功!');
                                this.modal = false;
                                this.getData();
                            })
                        }else{
                            this.$http.post('http://localhost:3000/users/data',this.formValidate)
                            .then(res=>{
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
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            onAdd(){
                this.modal = true;
                Object.assign(this.$data.formValidate,this.$options.data().formValidate);
                // 对象合并，并且初始表单数据
            },
            onSelectionChange(selection){
                if(selection && selection.length>0){
                     var ids = [];
                     let selectionLen = selection.length;
                     for(let i=0;i<selectionLen;i++){
                         ids.push(selection[i]._id);
                     }
                     this.ids = ids;
                }
            },
            onDeletes(){

                 this.$Modal.confirm({
                    title: '确认删除数据',
                    content: '<p>确认删除该记录吗？</p>',
                    onOk: () => {
                   
                        this.$http.post('http://localhost:3000/users/deletes',{ids:this.ids.toString()})
                        .then(res=>{
                            this.$Message.info('删除数据成功');
                            this.getData();
                        })       
                       
                    },
                    onCancel: () => {
                        // this.$Message.info('点击了取消');
                    }
                });
            },
            show (row) {
                this.modal = true;
                Object.assign(this.$data.formValidate,row);
            },
            remove (id) {

                this.$Modal.confirm({
                    title: '确认删除数据',
                    content: '<p>确认删除该记录吗？</p>',
                    onOk: () => {
                        
                        this.$http.delete(`http://localhost:3000/users/data/${id}`)
                        .then(res=>{
                            this.$Message.info('删除数据成功');
                            this.getData();
                        })
                       
                    },
                    onCancel: () => {
                       
                    }
                });

            },
            getData(){
                 this.$http.post('http://localhost:3000/users/list',this.filter)
                .then(res=>{
                    this.filter.list = res.data.rows;
                    this.filter.total = res.data.total;
                    this.filter.page = res.data.page;
                })
            },
            onChange(page){
              this.filter.page = page;
              this.getData();
            },
            onPageSizeChange(pageSize){
                this.filter.rows = pageSize;
                this.getData();
            },
            onSearch(){
                this.getData();
            }
        },
        created(){
            this.getData();
        }
    }
</script>