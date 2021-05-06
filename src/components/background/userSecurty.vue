<style scoped>

</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>我的信息</BreadcrumbItem>
                <BreadcrumbItem>密码安全</BreadcrumbItem>
            </Breadcrumb>
            <Card dis-hover>
            <Row>
                <Col span="11">
                    <div style="width:80%;margin-top:20px">
                        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                            <FormItem label="原密码" prop="rowpw">
                                <Input type="password" v-model="formCustom.rowpw"></Input>
                            </FormItem>
                            <FormItem label="新密码" prop="passwd">
                                <Input type="password" v-model="formCustom.passwd"></Input>
                            </FormItem>
                            <FormItem label="确认密码" prop="passwdCheck">
                                <Input type="password" v-model="formCustom.passwdCheck"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formCustom')">更改</Button>
                                <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
                            </FormItem>
                        </Form>                    
                    </div><Divider type="vertical" />                
                </Col>
                <Col span="2"></Col>
                <Col span="11">
                <div style="margin-top:20px;width:80%">
                    <Form :label-width="80">
                        <FormItem label="原邮箱">
                            <Input v-model="UserData.email" disabled placeholder=""/>  
                        </FormItem>
                        <FormItem label="新邮箱">
                            <Input v-model="validateEmail.email" placeholder=""/>  
                        </FormItem>
                        <FormItem label="验证码" v-if="validateEmail.token !=''" >
                            <Input v-model="validateEmail.code" placeholder="" />
                        </FormItem>
                        <FormItem>
                            <Button v-if="validateEmail.token ==''" type="primary" @click="getEmailCode">获取验证码</Button>
                            <Button v-if="validateEmail.token !=''" type="primary" @click="updateEmail">修改</Button>   
                        </FormItem>
                    </Form>
                </div>   
                </Col>
            </Row>
            </Card>
        </Content>
    </Layout>
</template>
<script >
    import md5 from 'js-md5';
    export default {
        data () {
            const validateRowpw = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('输入你的原密码'));
                }
                else if(value.length < 6){
                    callback(new Error('密码不能少于6位'));
                } 
                else {
                    // //检查密码
                    // setTimeout(() => {
                    //     var postData={
                    //         userName:this.UserData.userName,
                    //         password:md5(this.formCustom.rowpw)
                    //     }
                    //     this.Request.UserLogin(postData)
                    //     .then(result=>{
                    //         if(result.data.code==302){
                    //             callback(new Error('原密码错误'));
                    //         }else if(result.data.code==303){
                    //             callback(new Error('此账户已被封禁'));
                    //         // 写入数据
                    //         }else if(result.data.code==200){
                    //             callback()
                    //         }else{
                    //             this.$Message.error(result.data.message);
                    //         }
                    //     })
                    // }, 500);
                    callback()
                }
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('输入你的新密码'));
                }
                else if(value.length < 6){
                    callback(new Error('密码不能少于6位'));
                }
                else if(value.length > 16){
                    callback(new Error('密码长度超出限制'));
                }
                else if (value == this.formCustom.rowpw) {
                    callback(new Error('不能与原密码相同'));
                } 
                else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入你的新密码'));
                } else if(value.length < 6){
                    callback(new Error('密码不能少于6位'));
                } else if(value.length > 16){
                    callback(new Error('密码长度超出限制'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入不匹配！'));
                } else {
                    callback();
                }
            };
            
            
            return {
                UserData:JSON.parse(localStorage.getItem("UserData")),
                validateEmail:{
                    email:'',
                    code:'',
                    token:''
                },
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    rowpw: ''
                },
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    rowpw: [
                        { validator: validateRowpw, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var postData={
                            rowpasswd:md5(this.formCustom.rowpw),
                            passwd:md5(this.formCustom.passwd)
                        }
                        this.Request.UpdatePassWd(postData)
                        .then(result=>{
                            if(result.data.code==200){
                                this.$Message.info("更改密码成功，需要重新登录")
                                localStorage.clear()
                                this.$router.push("/login")
                            }
                            else if(result.data.code == 302){
                                this.$Message.info("原密码不匹配，请重新输入")
                                this.handleReset()
                            }
                            else{
                                this.$Message.error(result.data.message)
                            }
                        })
                    } else {
                        this.$Message.error('请检查输入');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            getEmailCode(){
                var emreg=/^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/;
                if(emreg.test(this.validateEmail.email)==false){
                    this.$Modal.info({
                        title: "",
                        content: "邮箱格式错误！"
                    });
                }
                else if(this.validateEmail.email == this.UserData.email){
                    this.$Modal.info({
                        title: "",
                        content: "不能和原邮箱相同！"
                    });
                }
                else{
                    this.Request.GetMailCode({email:this.validateEmail.email})
                    .then(result=>{
                        if(result.data.code==200){
                            this.validateEmail.token=result.data.message
                            this.$Modal.info({
                                title: "",
                                content: "已发送至邮箱，请注意查收(10分钟有效)"
                            });
                        }else if(result.data.code==302){
                            this.$Modal.info({
                                title: "",
                                content: "邮箱已存在！"
                            });
                            this.validateEmail.token=''
                        }
                    })                    
                }

            },
            updateEmail(){
                if(this.validateEmail.code.length != 6){
                    this.$Modal.info({
                        title: "",
                        content: "验证码格式错误，请检查"
                    });
                }else{
                    this.Request.UpdateEmail(this.validateEmail)
                    .then(result=>{
                        if(result.data.code==200){
                            this.$Message.info("更新邮箱成功，需要重新登录")
                            localStorage.clear()
                            this.$router.push("/login")
                        }else if(result.data.code==302){
                            this.$Modal.info({
                                title: "",
                                content: "验证码错误，请检查"
                            });
                        }else if(result.data.code==303){
                            this.$Modal.info({
                                title: "",
                                content: "验证码已过期"
                            });
                            this.validateEmail.token=''
                        }
                    })
                }
            }
        }
    }
</script>