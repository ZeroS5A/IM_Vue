<style scoped>
    .header{
        background-color: white;
        -moz-box-shadow:0px -2px 10px #888; -webkit-box-shadow:0px -2px 10px #888; box-shadow:0px -2px 10px #888;
        position: fixed;
        z-index: 999;
        width: 100%;
        height: auto;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
    .header-left{
        float:right;
        margin-right:10px;
    }
    .header-right{
        width:250px;
        float:left;
        margin-left:10px
    }
    @media screen and (max-width: 990px) {
        .header-left{
            float:left;
            margin-right:10px;
        }
        .header-right{
            width:150px;
            float:right;
            margin-left:10px
        }
        .header{
            padding: 0 15px;
            line-height: 40px;
        }
        .avatar{
            display:none;
        }
    }
</style>
<template>
<Header class="header">
    <Row type="flex" align="middle">
        <Col :xs="{span: 8, order: 1}" :md="{span: 8, order: 1}" :lg="{span: 4, order: 1}">
            <a style="justify-content: flex-start; height:40px; font-size:17px" href="/">ZIM</a>
        </Col>
        <Col :xs="{span: 16, order: 4}" :md="{span: 8, order: 3}" :lg="{span: 8, order: 2}">
            <!-- <div class="header-left">
                <a href="/" style="color:#3399ff">首页</a>
                <a style="color:#3399ff;margin-left:5px" type="text" @click="toPage('/admin/userInformation')">个人中心</a>
                <a style="color:#3399ff;margin-left:5px" type="text" @click="toPage('/chatRoom')">聊天室</a>                
            </div> -->
        </Col>
        <Col :xs="{span: 7, order: 2}" :md="{span: 16, order: 4}" :lg="{span: 8, order: 3}">
            <!-- <Input class="header-right" @on-search="search" v-model="searchData" search placeholder="搜标题、搜标签" /> -->
        </Col>
        <Col :xs="{span: 9, order: 3}" :md="{span: 16, order: 2}" :lg="{span: 4, order: 4}">
            <div style="justify-content: flex-end;float:right;width:100%">
                <!-- <a style="float:right;margin-left:10px" @click="toPage('/blog/3')">帮助</a> -->
                <div style="float:right" v-if="UserData==null">
                    <a :underline="false" @click="toPage('/login')">登录</a>
                    <!-- <a :underline="false" @click="toPage('/register')">注册</a> -->
                </div>
                <div style="float:right;" v-else>
                    <Avatar class="avatar" :src="UserData.avatarUrl" />
                    <Dropdown>
                        <a href="javascript:void(0)">
                            {{UserData.userName}}
                            <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <!-- <DropdownItem><a style="color:#657180" @click="toPage('/admin/sended')">博客管理</a></DropdownItem>
                            <DropdownItem><a style="color:#657180" @click="toPage('/admin/newBlog')">新建博客</a></DropdownItem> -->
                            <DropdownItem divided><div @click="logout()">登出</div> </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>                
            </div>
        </Col>
        <Col :xs="{span: 8, order: 5}" :md="{span: 0}" :lg="{span: 0}">
            <Dropdown style="float:right">
                <a href="javascript:void(0)">
                    分类
                    <Icon type="ios-keypad"></Icon>
                </a>

                <!-- 子分类 -->
                <DropdownMenu slot="list">
                    <!-- 公告栏 -->
                    <Dropdown placement="right-start">
                        <DropdownItem>
                            <Icon type="ios-arrow-back"></Icon>
                            公告栏
                        </DropdownItem>
                        <DropdownMenu slot="list">
                            <DropdownItem><a @click="toBlog(1)">关于注册</a></DropdownItem>
                            <DropdownItem><a @click="toBlog(2)">关于网站</a></DropdownItem>
                            <DropdownItem><a @click="toBlog(3)">联系作者</a></DropdownItem>
                            <DropdownItem><a @click="toBlog(4)">更新公告</a></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <!-- 三大件 -->
                    <Dropdown divided placement="right-start">
                        <DropdownItem>
                            <Icon type="ios-arrow-back"></Icon>
                            今日推荐
                        </DropdownItem>
                        <DropdownMenu slot="list">
                            <DropdownItem><a @click="changeLabel('A')">推荐阅读</a></DropdownItem>
                            <DropdownItem><a @click="changeLabel('B')">近期热门</a></DropdownItem>
                            <DropdownItem><a @click="changeLabel('C')">最新博文</a></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <!-- 列表标签 -->
                    <Dropdown placement="left-start" v-for="items in classList" :key="items.classId">
                        <DropdownItem >
                            <a @click.prevent="changeClass(items)">
                                <Icon type="ios-arrow-back"></Icon>
                                {{items.name}}
                            </a>
                        </DropdownItem>
                        <DropdownMenu slot="list">
                            <DropdownItem v-for="item in items.tTagsList" :key="item.classId" ><a @click="changeLabel(item)">{{item.tagName}}</a></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </DropdownMenu>
            </Dropdown>
        </Col>
    </Row>
</Header>
</template>
<script >
    export default {
        data(){
            return{
                UserData:JSON.parse(localStorage.getItem("UserData")),
                searchData:''
            }
        },
        props:{
            'classList':Array,
            'changeLabel':Function,
            'changeClass':Function,
            'toBlog':Function
        },
        methods:{
            logout(){
                // if(confirm("确定退出账户吗？")){
                //     localStorage.clear()
                //     this.UserData = null
                //     this.$router.push({ path: '/' }).catch(data => {  })
                // }
                this.$Modal.confirm({
                    title: "确定要登出吗？",
                    onOk: () => {
                        localStorage.clear()
                        this.UserData = null
                        this.$router.push({ path: '/login' }).catch(data => {  })

                        let promise = this.Tim.logout();
                        promise.then((imResponse) => {
                            console.log(imResponse.data); // 登出成功
                        }).catch(function(imError) {
                            console.warn('logout error:', imError);
                        });
                    }
                });
            },
            //向父组件传值
            search(){
                this.$router.push({ path: '/' }).catch(data => {  })
                this.$emit('searchData',this.searchData)
            },
            toPage(page){
                this.$router.push(page)
            }
        }

    }
</script>