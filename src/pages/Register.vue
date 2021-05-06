<style scoped>
    .logo{
        text-align: center;
        margin-bottom: 20px;
        font-size: 30px;
    }
    a { color:#464c5b; transition:0.5s; }
    a:hover { color:#3399ff; }
</style>
<template>
    <Row type="flex" justify="center" align="middle" class="code-row-bg">
        <Col span="1" style="height:100vh"></Col>
        <Col :xs="{span:18}" :md="{span: 10}" :lg="{span:6}">
            <div class="logo">
                <a href="/">ZBlog</a>
            </div>
            <Card style="width:100%">
                <div>
                    <!-- 发邮件加载 -->
                    <Spin size="large" fix v-if="loading"></Spin>
                    <!-- 设置验证框架 -->
                    <Form ref="registerData" :model="registerData" label-position="top" :rules="registerRule">
                        <FormItem label="注册邮箱" prop="mail">
                            <Input v-model="registerData.email" :disabled="registerData.token !=''" @keyup.enter.native="getEmailCode()" placeholder="请输入邮箱来注册">
                                <Icon type="ios-mail-outline" slot="prepend"></Icon>
                            </Input>  
                        </FormItem>
                        <FormItem label="验证码" v-if="registerData.token !=''" prop="code">
                            <Input v-model="registerData.code" placeholder="">
                                <Icon type="md-key" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="用户名" v-if="registerData.token !=''" prop="userName">
                            <Input placeholder="输入用户名" v-model="registerData.userName">
                                <Icon type="ios-person-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="密码" v-if="registerData.token !=''" prop="passwd">
                            <Input type="password" placeholder="输入密码" v-model="registerData.passwd">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem label="确认密码" v-if="registerData.token !=''" prop="passwdCheck">
                            <Input type="password"  placeholder="确认密码"  v-model="registerData.passwdCheck">
                                <Icon type="ios-lock-outline" slot="prepend"></Icon>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button v-if="registerData.token ==''" type="primary" @click="getEmailCode()">获取验证码</Button>
                            <Button v-if="registerData.token !=''" type="primary" @click="register('registerData')">注册</Button>
                            <Button @click="toLogin()" style="margin-left: 8px">返回登录</Button>
                            <!-- <a :underline="false" href="/login" style="margin-left:10px">忘记密码？</a> -->
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </Col>
        <Col span="1"></Col>
    </Row>
</template>
<script>
    import md5 from 'js-md5';
    export default {
        data(){
            // 验证逻辑
            const validatorCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入验证码'));
                }else if(value.length != 6){
                    callback(new Error('验证码格式不正确'));
                } else {
                    callback()
                }
            };

            const validatorUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入你的用户名'));
                } else {
                    callback()
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入你的密码'));
                } else {
                    if (this.registerData.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.registerData.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入你的新密码'));
                } else if(value.length < 6){
                    callback(new Error('密码不能少于6位'));
                } else if (value !== this.registerData.passwd) {
                    callback(new Error('两次输入不匹配！'));
                } else {
                    callback();
                }
            };
            const validateMail = (rule, value, callback) => {
                if (this.registerData.email == '') {
                    callback(new Error('邮箱不能为空！'));
                } else {
                    callback();
                }
            };
            
            return{
                // 验证配置,应该与验证的对象名相一致
                registerRule: {
                    code:[
                        { validator: validatorCode, trigger: 'blur'}
                    ],
                    userName:[
                        { validator: validatorUserName, trigger: 'blur'}
                    ],
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    mail: [
                        { validator: validateMail, trigger: 'blur' }
                    ],
                },
                loading: false,
                registerData:{
                    email:'',
                    code:'',
                    token:'',
                    userName:'',
                    passwd:'',
                    passwdCheck:''
                },
                
            }
        },
        methods:{
            toLogin(){
                this.$router.push("/login")
            },
            getEmailCode(){
                this.loading = true
                var emreg=/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
                if(emreg.test(this.registerData.email)==false){
                    this.$Modal.info({
                        title: "",
                        content: "请检查输入的邮箱！"
                    });
                }
                else{
                    this.Request.GetMailCode({email:this.registerData.email})
                    .then(result=>{
                        if(result.data.code==200){
                            this.registerData.token=result.data.message
                            this.$Modal.info({
                                title: "",
                                content: "已发送至邮箱，请注意查收(10分钟有效)"
                            });
                        }else if(result.data.code==302){
                            this.$Modal.info({
                                title: "",
                                content: "邮箱已被注册，请更换！"
                            });
                            this.registerData.token=''
                        }else{
                            this.$Modal.info({
                                title: "",
                                content: "服务器错误！"
                            });
                        }
                        this.loading = false
                    })                    
                }

            },
            register(name){
                 this.$refs[name].validate((valid) => {
                    if (valid) {
                        //md5加密密码
                        this.registerData.passwd = md5(this.registerData.passwd)
                        this.Request.UserRegister(this.registerData)
                        .then(result => {
                            //清空密码
                            this.registerData.passwdCheck = ''
                            this.registerData.passwd = ''
                            if(result.data.code == 200){
                                this.$router.push("/login")
                                this.$Message.success('注册成功');
                            }else if (result.data.code == 301){
                                //用户名被注册
                                this.$Message.info(result.data.message)
                                this.registerData.userName = ''
                            }else if (result.data.code == 302){
                                //邮箱验证码错误
                                this.$Message.info(result.data.message)
                                this.registerData.code = ''
                            }
                        })
                    } else {
                        this.$Message.error('请检查输入');
                    }
                })
            }
        }
    }
</script>