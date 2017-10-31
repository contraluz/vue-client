<template>
<div>
    <Tree :data="cateData" :render="renderContent"></Tree>
    <Modal
            v-model="cateModal"
            title="数据操作"
        >
            <Form ref="formValidate" :model="formValidate"  :label-width="80">                
                <FormItem label="数据内容" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入内容"></Input>
                </FormItem>
                
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
        </Modal>
          <Modal
            v-model="cateModal_2"
            title="数据操作"
        >
            <Form  :model="formValidate"  :label-width="80">                
                <FormItem label="数据内容" prop="title">
                    <Input v-model="formValidate.title" placeholder="请输入内容"></Input>
                </FormItem>
                
                <FormItem>
                    <Button type="primary" @click="update()">提交</Button>
                </FormItem>
            </Form>
        </Modal>
</div>
    
</template>
<script>
    export default {
        data () {
            return {
               selfId:'',
                formValidate: {
                    title: '',
                    parentId:'',
                },
                ids:[],
                cateModal: false,
                cateModal_2:false,
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
                                }, [
                                    h('Button', {
                                        props: Object.assign({}, this.buttonProps, {
                                            icon: 'ios-plus-empty',
                                            type: 'primary'
                                        }),
                                        style: {
                                            width: '52px'
                                        },
                                        on: {
                                            click: () => { this.append(data) }
                                        }
                                    })
                                ])
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
             handleSubmit () {
                    console.log(this.formValidate)
              this.$http.post('http://localhost:3000/cate/data',this.formValidate)
              .then(res=>{
                  
                  this.cateModal=false;
                  this.$Message.info('添加成功');
                  this.getData();
              })
             },
             handleReset (name) {
                this.$refs[name].resetFields();
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
                    }, [
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-plus-empty'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => { this.append(data) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-color-wand-outline'
                            }),
                            style: {
                                marginRight: '8px'
                            },
                            on: {
                                click: () => { this.edite(data) }
                            }
                        }),
                        h('Button', {
                            props: Object.assign({}, this.buttonProps, {
                                icon: 'ios-minus-empty'
                            }),
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        })
                    ])
                ]);
            },
            append (data) {
                console.log(data);
                this.cateModal = true;
                this.formValidate.parentId=data._id;
                console.log(this.formValidate);
            },
              edite(data){
                 this.cateModal_2 = true;
                this.formValidate.parentId=data.parentId;
                this.selfId=data._id;
                console.log(this.selfId);
            },
            update(){
                 console.log(112) 
                this.$http.put(`http://localhost:3000/cate/data/${this.selfId}`,this.formValidate)
              .then(res=>{  
                  console.log(112)               
                  this.cateModal_2=false;
                  this.$Message.info('修改成功');
                  this.getData();
              })
            },
          
            remove (root, node, data) {
                //root 所有节点，当前节点，parent是下标总的为0 ，其余123..，data 就是其值
                console.log(data._id)
                this.$Modal.confirm({ 
                    title: '确认删除数据',
                    content: '<p>确认删除该记录吗？</p>',
                    onOk: () => {
                        const parentKey = root.find(el => el === node).parent;
                        const parent = root.find(el => el.nodeKey === parentKey).node;
                        const index = parent.children.indexOf(data);
                        parent.children.splice(index, 1); 
                       
                        this.$http.delete(`http://localhost:3000/cate/data/${data._id}`)
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
                this.$http.get('http://localhost:3000/cate/list',this.filter)
                .then(res=>{
                    // this.filter.list =  res.data;
                    this.cateData[0].children = res.data;

                    })
                },
            
            },
        created(){
            this.getData();
        }
    }
</script>
