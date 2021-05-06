<style scoped>
    .layout{
        border: 0px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo{
    width: 100px;
    height: 30px;
    border-radius: 3px;
    float: left;
    top: 15px;
    left: 20px;
    }
    .layout-nav{
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
    .header{
        background-color: white;
        -moz-box-shadow:0px -2px 10px #333333; -webkit-box-shadow:0px -2px 10px #333333; box-shadow:0px -2px 10px #333333;
        position: fixed;
        z-index: 999;
        width: 100%;
        height: 60px;
    }
</style>
<template>
    <div class="layout">
        <Header class="header">
            <Menu mode="horizontal" theme="light" active-name="1">
                <div class="layout-logo">
                    <a href="/">ZIM 后台管理</a>
                </div>
                <div style="float:right" v-if="UserData">
                    <Avatar :src="UserData.avatarUrl" />
                    <Dropdown>
                        <a href="javascript:void(0)">
                        {{UserData.userName}}
                        <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <!-- <DropdownItem>我的信息</DropdownItem>
                            <DropdownItem>新建博客</DropdownItem> -->
                            <DropdownItem divided><div @click="logout()">登出</div> </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>  
            </Menu>
        </Header>
        <div style="margin-top:60px">
            <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
                <Menu :active-name="pageName" :style="{marginTop: '20px'}" theme="dark" width="auto" @on-select="selectName">
                    <MenuItem name="/">即时通讯</MenuItem>
                    <MenuItem name="/">系统监控</MenuItem>
                    <MenuItem name="/">用户管理</MenuItem>
                    <MenuItem name="/">广场管理</MenuItem>

                    <!-- <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-contact" size="15"></Icon>
                            用户管理
                        </template>
                        <MenuItem name="/admin/userInformation">基本信息</MenuItem>
                        <MenuItem name="/admin/userSecurty">密码及安全</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-keypad"></Icon>
                            广场管理
                        </template>
                        <MenuItem name="/admin/newBlog">新建</MenuItem>
                        <MenuItem name="/admin/sended">已发送</MenuItem>
                        <MenuItem name="/admin/recover">回收站</MenuItem>
                    </Submenu> -->
                    <!-- <Submenu name="3">
                        <template slot="title">
                            <Icon type="ios-analytics"></Icon>
                            Item 3
                        </template>
                        <MenuItem name="3-1">Option 1</MenuItem>
                        <MenuItem name="3-2">Option 2</MenuItem>
                    </Submenu> -->
                </Menu>
            </Sider>
            <router-view/>
        </div>
        
    </div>
</template>
<script>

    export default {
        data(){
            return{
                UserData:JSON.parse(localStorage.getItem("UserData")),
                pageName:this.$route.path
            }
        },
        methods:{
            logout(){
                // if(confirm("确定退出账户吗？")){
                //     localStorage.clear()
                //     this.$router.push('/login');
                // }
                this.$Modal.confirm({
                    title: "确定要登出吗？",
                    onOk: () => {
                        localStorage.clear()
                        this.$router.push('/login');
                        let promise = this.Tim.logout();
                        promise.then((imResponse) => {
                            console.log(imResponse.data); // 登出成功
                        }).catch(function(imError) {
                            console.warn('logout error:', imError);
                        });
                    }
                });
            },
            
            selectName(e){
                this.$router.push({path:e}).catch(data => {  });
            },
        },
        mounted() {
            // this.Request.testApi()
            // .then(Response=>{
            //     console.log(Response)
            // })
        },
    }
</script>
