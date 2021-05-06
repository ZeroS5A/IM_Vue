<style scoped>
    .avatar{
        margin: 0 auto;
        width: 100%;
        text-align: center;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>我的信息</BreadcrumbItem>
                <BreadcrumbItem>基本信息</BreadcrumbItem>
            </Breadcrumb>
            <Card dis-hover>
            <Row>
                <Col span="4">
                    <div class="avatar">
                        <Avatar :src="UserData.avatar" size="100" class="avatar"/>
                        <Upload
                        action="https://lczeros.cn/MyBlog/upload/image/"
                        name="image"
                        accept="image/jpeg, image/png"
                        :headers="headers"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :show-upload-list="false"
                        :on-error="handleError"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSizeError"
                        :on-success="uploadSuccess">
                        <p style="margin-top:5px"><a :underline="false">修改头像</a></p>
                        </Upload>
                    </div> 
                </Col>
                <Col span="20">
                    <a :underline="false">{{UserData.userName}}</a>
                    <Tag  style="margin-left:10px">LV1</Tag>
                    <Breadcrumb  style="margin-top:10px">
                        <BreadcrumbItem to="/">
                            <Icon type="md-bookmarks"></Icon> 博客:{{UserData.blogNum}}
                        </BreadcrumbItem>
                        <BreadcrumbItem to="/">
                            <Icon type="logo-buffer"></Icon> 粉丝:暂无
                        </BreadcrumbItem>
                        <BreadcrumbItem to="/">
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Divider/>
                    <!-- 个人信息表(还未做验证) -->
                    <Form ref="UserData" :model="UserData" :rules="ruleValidate" :label-width="80" style="width:500px">
                        <FormItem label="昵称" prop="name">
                            <Input v-model="UserData.nickName" placeholder="输入昵称"></Input>
                        </FormItem>
                        <FormItem label="邮箱" prop="mail">
                            <Input v-model="UserData.email" readonly placeholder="输入电邮"></Input>
                        </FormItem>
                        <FormItem label="职业" prop="">
                            <Input v-model="UserData.occupation" placeholder="发现更多同类型的人"></Input>
                        </FormItem>
                        <FormItem label="性别" prop="gender">
                            <RadioGroup v-model="UserData.gender">
                                <Radio label='a'>男</Radio>
                                <Radio label='b'>女</Radio>
                                <Radio label='c'>保密</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="个人简介" prop="summary">
                            <Input v-model="UserData.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="介绍一下自己吧..."></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="updateUserData('UserData')">保存</Button>
                            <Button @click="handleReset('UserData')" style="margin-left: 8px">重置</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            </Card>
        </Content>
    </Layout>
</template>
<script>
    export default {
        data(){
            //验证
            const validateName = (rule, value, callback) => {
                if (this.UserData.nickName == '') {
                    callback(new Error('用户名不能为空！'));
                } else {
                    callback();

                }
            };
            const validateMail = (rule, value, callback) => {
                if (this.UserData.email == '') {
                    callback(new Error('邮箱不能为空！'));
                } else {
                    callback();
                }
            };
            return{
                headers: { Authorization: localStorage.getItem('token') },
                UserData: {},
                ruleValidate : {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    mail: [
                        { validator: validateMail, trigger: 'blur' }
                    ],
                }
            }
        },
        methods:{
            getUserData(){
                this.Request.GetUserData()
                .then(result=>{
                    if(result.data.code==200){
                        this.UserData=result.data.data 
                    }
                })
            },
            updateUserData(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.Request.UpdateUserData(this.UserData)
                        .then(result=>{
                            if(result.data.code==201){
                                this.$Message.success('保存正常，需要重新登陆');
                                //更新本地缓存
                                //localStorage.setItem("UserData",JSON.stringify(this.UserData))
                                //需要重新登录
                                localStorage.clear()
                                this.$router.push("/login")
                            }else if(result.data.code==200){
                                this.$Message.success('保存正常');
                                //更新本地缓存
                                localStorage.setItem("UserData",JSON.stringify(this.UserData))
                            }
                            else if(result.data.code==304)
                                this.$Message.info('该用户名已被注册，请更换');
                            else{
                                this.$Message.error(result.data.message);
                            }
                        })
                    } else {
                        this.$Message.error("请检查输入！");
                    }
                })
            },
            uploadSuccess(result){
                this.UserData.avatar=result.data.imgUrl
                this.UserData.imgName=result.data.imgName
            },
            handleError () {
                this.$Message.error('文件上传失败')
            },
            handleFormatError () {
                this.$Message.error('文件类型不支持')
            },
            handleMaxSizeError () {
                this.$Message.error('文件大小不可超过2M')
            }
        },
        mounted(){
            this.getUserData()
        }
    }
</script>