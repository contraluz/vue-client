<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-logo{
        width: 200px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
        color: white;
        line-height: 30px;
        text-align: center;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-ceiling{
        background: #464c5b;
        padding: 10px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 200px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }
    .layout-hide-text .layout-text{
        display: none;
    }
    .ivu-col{
        transition: width .2s ease-in-out;
    }
</style>
<template>
    <div>
        <div v-if="login">
            <div class="layout" :class="{'layout-hide-text': spanLeft < 5}">
                <div class="layout-ceiling">
                    <div class="layout-ceiling-main">
                        <a href="#">欢迎您  {{formInline.name}}</a>| &nbsp;
                        <a href="#">帮助中心</a> |
                        <a href="#">安全中心</a> |
                        <a href="#">服务大厅</a>
                    </div>
                </div>
                <div class="layout-header">
                    <div class="layout-logo">
                        中共中央政治局后台信息管理系统
                    </div>
                </div>
                

                <Row type="flex">
                    <Col :span="spanLeft" class="layout-menu-left">
                        <Menu active-name="1" theme="dark" width="auto">
                            <div class="layout-logo-left"></div>
                            <MenuItem name="1">
                                <Icon type="ios-navigate" :size="iconSize"></Icon>
                                <span class="layout-text">
                                    <router-link to="/" exact active-class="active">首页</router-link>
                                </span>
                            </MenuItem>
                            <MenuItem name="2">
                                <Icon type="ios-keypad" :size="iconSize"></Icon>
                                <span class="layout-text">
                                    <router-link to="/user" >用户</router-link>
                                </span>
                            </MenuItem>
                            <MenuItem name="3">
                                <Icon type="ios-analytics" :size="iconSize"></Icon>
                                <span class="layout-text"><router-link to="cate" >分类</router-link></span>
                            </MenuItem>
                            <MenuItem name="4">
                                <Icon type="ios-navigate" :size="iconSize"></Icon>
                                <span class="layout-text"><router-link to="/news" >新闻</router-link></span>
                            </MenuItem>
                            <MenuItem name="5">
                                <Icon type="ios-keypad" :size="iconSize"></Icon>
                                <span class="layout-text"><router-link to="/comment" >评论</router-link></span>
                            </MenuItem>
                            <MenuItem name="6">
                                <Icon type="ios-analytics" :size="iconSize"></Icon>
                                <span class="layout-text"><router-link to="/upload" >上传</router-link></span>
                            </MenuItem>
                            <MenuItem name="7">
                                <Icon type="ios-keypad" :size="iconSize"></Icon>
                                <span class="layout-text"><router-link to="/product" >产品</router-link></span>
                            </MenuItem>
                        </Menu>
                    </Col>
                    <Col :span="spanRight">
                        <div class="layout-header">
                            <Button type="text" @click="toggleClick">
                                <Icon type="navicon" size="32"></Icon>
                            </Button>
                        </div>
                        <div class="layout-breadcrumb">
                            <Breadcrumb>
                                <BreadcrumbItem href="#">首页</BreadcrumbItem>
                                <BreadcrumbItem href="#">用户中心</BreadcrumbItem>
                                <BreadcrumbItem>用户设置</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                        <div class="layout-content">
                            <div class="layout-content-main">
                                <router-view></router-view>
                            </div>
                        </div>
                        <div class="layout-copy">
                            2013-2018 &copy; San Francisco
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
        <div v-else>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <FormItem prop="name">
                    <Input type="text" v-model="formInline.name" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input type="password" v-model="formInline.password" placeholder="Password">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
import {mapGetters,mapActions} from "Vuex";
import md5 from 'crypto-js/md5';
    export default {
        data () {
            return {
                spanLeft: 5,
                spanRight: 19,
                 formInline: {
                    name: '',
                    password: ''
                },
                ruleInline: {
                    name: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            ...mapGetters(["login"]),
            iconSize () {
                return this.spanLeft === 5 ? 14 : 24;
            },
            
        },
        // handleSubmit(name) {
        //         this.$refs[name].validate((valid) => {
        //             if (valid) {
        //                  this.formInline.password=md5( this.formInline.password).toString();
        //                 this.$http.post(`http://localhost:3000/users/checkLogin/`,this.formInline)
        //                 .then(res=>{
        //                     console.log(res);
        //                     if(res.data.status==404){
        //                              this.$Message.info(res.data.msg);
        //                     }else{      
        //                         sessionStorage.login=true;
        //                         this.checkLogin( sessionStorage.login);    
        //                         this.$Message.success('登录成功');
        //                     }
        //                 })                      
        //                 // localStorage.login = true;                       
        //             } else {
        //                 this.$Message.error('表单验证失败!');
        //             }
        //         })
        //     }
        // },
        //   created(){
        //     this.checkLogin( sessionStorage.login); 
        // }
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                         this.formInline.password=md5( this.formInline.password).toString();
                        this.$http.post(`http://localhost:3000/users/checkLogin/`,this.formInline)
                        .then(res=>{
                            console.log(res);
                            if(res.data.status==404){
                                     this.$Message.info(res.data.msg);
                            }else{      
                                sessionStorage.login=true;
                                this.checkLogin( sessionStorage.login);    
                                this.$Message.success('登录成功');
                            }
                        })                      
                        // localStorage.login = true;                       
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            ...mapActions(['checkLogin']),
            toggleClick () {
                if (this.spanLeft === 5) {
                    this.spanLeft = 2;
                    this.spanRight = 22;
                } else {
                    this.spanLeft = 5;
                    this.spanRight = 19;
                }
            }
        },
        created(){
            this.checkLogin( sessionStorage.login );
        }
    }
</script>