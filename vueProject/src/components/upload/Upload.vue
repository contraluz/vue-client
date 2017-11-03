<template>
   
   <!--  @on-select-change="onSelectChange" -->
    <Row type="flex">
        <!-- <Col span="5"><Tree :data="cateData"></Tree></Col> -->
         <Col span="24">
         <Upload
        multiple
        type="drag"
        name="avatar"
        action="http://localhost:3000/upload/upload">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
        </div>
    </Upload>

        <Button type="primary" @click="getData">刷新</Button>
        <Button type="error" @click="onDeletes">删除多条记录</Button>
        <Input v-model="filter.filename">
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
        >
            <Form ref="formValidate" :model="formValidate" :label-width="80">                
                <FormItem label="图片名称" prop="filename">
                    <Input v-model="formValidate.filename"></Input>
                </FormItem>
                <FormItem label="确认名称" prop="title">
                    <Input v-model="formValidate.filename" disabled></Input>
                </FormItem>
                <FormItem label="大小" prop="size">
                    <Input v-model="formValidate.size"></Input>
                </FormItem>
                <FormItem label="格式" prop="mimetype">
                    <Input v-model="formValidate.mimetype" disabled></Input>
                </FormItem>
                <FormItem label="路径" prop="path">
                    <Input v-model="formValidate.path"></Input>
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
    export default {
        data () {

            return {
                formValidate: {
                    filename: '',
                    size: '',
                    destination: ''
                },
                 ids:[],
                modal: false,
                filter:{
                    list:[],
                    total:0,
                    page:1,
                    rows:10,
                    filename:''
                },
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        
                    },
                    {
                        
                        title: '文件名',
                        key: 'filename',
                    },
                    {
                        title: '大小',
                        key: 'size',
                        sortable: true
                    },
                    {
                        title: '格式',
                        key: 'mimetype',
                        
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
                                }, '查看'),
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
            
            handleSubmit (name) {
                    
                if(this.formValidate._id && this.formValidate._id.length>0){
                    //如果传入id了，就是编辑页，打开编辑页-----否则是新建，input里面没东西
                    this.$http.put(`http://localhost:3000/upload/data/${this.formValidate._id}`,this.formValidate)
                    .then(res=>{
                        this.$Message.success('提交成功!');
                        this.modal = false;
                        this.getData();
                    })
                }else{
                    this.$http.post('http://localhost:3000/upload/data',this.formValidate)
                    .then(res=>{
                        this.$Message.success('提交成功!');
                        this.modal = false;
                        this.getData();
                    })
                }         
              
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
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
            onSelectionChange(selection){
                if(selection && selection.length>0){
                     var ids = [];
                     let selectionLen = selection.length;
                     for(let i=0;i<selectionLen;i++){
                         ids.push(selection[i]._id);
                     }
                     this.ids = ids;
                      this.getDataList();
                }
            },
            onDeletes(){

                 this.$Modal.confirm({
                    title: '确认删除数据',
                    content: '<p>确认删除该记录吗？</p>',
                    onOk: () => {
                   
                        this.$http.post('http://localhost:3000/upload/deletes',{ids:this.ids.toString()})
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
                        
                        this.$http.delete(`http://localhost:3000/upload/data/${id}`)
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
                 this.$http.post('http://localhost:3000/upload/list',this.filter)
                .then(res=>{
                    console.log(res)
                    this.filter.list = res.data.rows;
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
                console.log(this.filter.filename)
                this.getData();
            },
            getDataList(){
                this.$http.post('http://localhost:3000/cate/list',this.filter)
                .then(res=>{
                    // console.log(res)
                    // this.filter.list =  res.data;
                    this.cateData[0].children = res.data;

                })
            }
            
        },
        created(){
            this.getData();
        }
    }
</script>
