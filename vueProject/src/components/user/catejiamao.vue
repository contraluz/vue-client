<template>
    <div>
        <Tree :data="filter.list" ref="tree" :render="renderContent" @click="getSelectedNodes"></Tree>
         <Form  :label-width="80">
            <FormItem label="_id">
                <Input placeholder="该记录的_id,可以为空"></Input>
            </FormItem>
            <FormItem label="内容">
                <Input placeholder="请输入内容" ></Input>
            </FormItem>
            <FormItem>
                    <Button type="primary" >提交</Button>
                    <Button type="ghost" style="margin-left: 8px">重置</Button>
                </FormItem>
        </Form>
    </div>
    
</template>
<script>
    export default {
        data () {
            return {
                filter:{
                    list:[],
                    name:''
                },
                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                }
            }
        },
        methods: {
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
                const children = data.children || [];
                children.push({
                    title: 'appended node',
                    expand: true
                });
                this.$set(data, 'children', children);
            },
            remove (root, node, data) {
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            },
             getData(){
            this.$http.get('http://localhost:3000/cate/list',this.filter)
            .then(res=>{
                // console.log(res.data);
                this.filter.list = res.data;

                })
            },
            getSelectedNodes(){
                console.log(123);
               console.log(this.$refs.Tree.getSelectedNodes());
            }
        
        },
        created(){
            this.getData();
        }
    }
</script>



<!--<template>
    <div>
        <Tree :data="filter.list" ref="tree"  @click="getSelectedNodes"></Tree>
         <Form :label-width="80">
            <FormItem label="_id">
                <Input placeholder="该记录的_id,可以为空"></Input>
            </FormItem>
            <FormItem label="内容">
                <Input placeholder="请输入内容" ></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" >提交</Button>
                <Button type="ghost" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
    
</template>


 <script>
  
    export default {
        data () {
            return {
                filter:{
                    list:[],
                    name:''
                }
            }
        },
        methods:{
            getData(){
            this.$http.get('http://localhost:3000/cate/list',this.filter)
            .then(res=>{
                // console.log(res.data);
                this.filter.list = res.data;

                })
            },
            getSelectedNodes(){
                console.log(123);
               console.log(this.$refs.Tree.getSelectedNodes());
            }
        },
        created(){
            this.getData();
        }
        
    }
</script>  -->
