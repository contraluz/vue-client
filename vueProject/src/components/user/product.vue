<template>
    <Row type="flex">
         <Col span="5"><Tree :data="cateData" @on-select-change="onSelectChange"></Tree></Col>
         <Col span="19">
             <Button type="primary" @click="onAdd">添加</Button>
            <Button type="error" @click="onDeletes">删除多条记录</Button>
            <Input v-model="filter.name">
                <Button slot="append" icon="ios-search" @click="onSearch" ></Button>
            </Input>

            <Table border :columns="columns" :data="filter.list" @on-selection-change="onSelectionChange"></Table><br>
        
            <Page :total="filter.total" size="small"  
            show-total show-elevator show-sizer
            @on-change="onChange"
            @on-page-size-change="onPageSizeChange"></Page>


            <Modal
                v-model="modal"
                title="数据操作"
                width=800
            >
                <Form ref="formValidate" :model="formValidate"  :label-width="80">   
                    <!-- <FormItem label="抬头" prop="title">
                        <Input v-model="formValidate.title" placeholder="请输入抬头"></Input>
                    </FormItem>         -->
                    <FormItem label="名称" prop="name">
                        <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
                    </FormItem>
                    <!-- <FormItem label="内容" prop="content">
                        <vue-editor v-model="formValidate.content" ></vue-editor>
                         <Input v-model="formValidate.content" placeholder="请输入内容"></Input> 
                    </FormItem> -->
                    <FormItem label="价格" prop="price">
                        <Input v-model="formValidate.price" placeholder="请输入价格"></Input>
                    </FormItem> 
                     <FormItem label="内容" prop="content">
                           <vue-editor v-model="formValidate.content" ></vue-editor>

                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                        <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                    </FormItem>
                </Form>
            </Modal>
         </Col>
       

    </Row>
    
</template>
<script>
import { VueEditor } from 'vue2-editor'
    export default {
        components: {
            VueEditor
        },
        data () {
            
            return {
                content: '<h1>Some initial content</h1>'  ,
                formValidate: {
                    name: '',
                    content: '', 
                    price: '',
                    title: ""
                },
                ids:[],
                modal: false,
                filter:{
                    list:[],
                    total:0,
                    page:1,
                    rows:10,
                    name:''
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        
                    },
                    // {
                    //     title: '抬头',
                    //     key: 'title',
                    //     align: 'center'
                    // },
                    {
                        
                        title: '名称',
                        align: 'center',
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
                    // {
                    //     title: '内容',
                    //     key: 'content',
                    //     align: 'center',
                    //     type:'html'
                        
                    // },
                    {
                        title: '价格￥',
                        key: 'price',
                        sortable: true,
                        align: 'center',
                        
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        type:'html'
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
                
                cateData: [
                    {
                        title: '分类管理',
                        expand: true,
                        render: (h, { root, node, data }) => {
                            return h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%'
                                }
                            }, [
                                h('span', [
                                    h('Icon', {
                                        props: {
                                            type: 'ios-folder-outline'
                                        },
                                        style: {
                                            marginRight: '8px'
                                        }
                                    }),
                                    h('span', data.title)
                                ]),
                                h('span', {
                                    style: {
                                        display: 'inline-block',
                                        float: 'right',
                                        marginRight: '32px'
                                    }
                                })
                            ]);
                        },
                        children: []
                    }
                ],
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                }
            }
        },
        methods: {
            onSelectChange(res){
                console.log(res)
                if(res[0].children){
                    this.filter.list = res[0].children;
                    this.getDataList();
                }else{
                    this.filter.list = res ; 
                    this.getDataList();
                }


             },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('Icon', {
                            props: {
                                type: 'ios-paper-outline'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginRight: '32px'
                        }
                    })
                ]);
            },
            //左侧 树
            getDataList(){
                this.$http.post('http://localhost:3000/cate/list',this.filter)
                .then(res=>{
                    console.log(res)
                    // this.filter.list =  res.data;
                    this.cateData[0].children = res.data;

                })
            },
            
            //以下是右边的方框
            handleSubmit (name) {       
                if(this.formValidate._id && this.formValidate._id.length>0){
                    //如果传入id了，就是编辑页，打开编辑页-----否则是新建，input里面没东西
                    console.log(this.formValidate)

                    this.$http.put(`http://localhost:3000/product/data/${this.formValidate._id}`,this.formValidate)
                    .then(res=>{
                        this.$Message.success('提交成功!');
                        this.modal = false;
                        this.formValidate._id="";
                        this.getData();
                    })
                }else{
                    console.log("ok")
                    this.$http.post('http://localhost:3000/product/data',this.formValidate)
                    .then(res=>{
                        this.$Message.success('提交成功!');
                        this.modal = false;
                        this.getData();
                    })
                }
                this.getDataList();
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
                   
                        this.$http.post('http://localhost:3000/product/deletes',{ids:this.ids.toString()})
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
                        
                        this.$http.delete(`http://localhost:3000/product/data/${id}`)
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
                ///这里改变了：1
                 this.$http.get('http://localhost:3000/product/list',this.filter)
                .then(res=>{
                   console.log(res)
                    this.filter.list = res.data;
                    this.filter.total = res.data.total;
                    this.filter.page = res.data.page;
                    this.getDataList();
                    
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
                console.log(this.filter.name)
                this.getData();
            },
         
        },
        created(){
            this.getData();
            this.getDataList();
            
        }
    }
</script>