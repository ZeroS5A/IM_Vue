<style>
    .content{
        /* margin-top: 75px; */
        min-height: 100vh;
        width: 99%;
    }
    .foot{
        position: fixed;
        bottom: 0px;
    }
    .display{display: none}
    .chatCard{
        margin: 0 auto;
        margin-top: 80px;
        width: 80%;
        height: 85vh;
    }
    .chatTextBox textarea{
        border: none !important;
        box-shadow: none !important;
        border: none !important;
        resize: none;
        padding: 15px;
    }
    .chatTextBox textarea:enabled {
        border: none!important;
        box-shadow: none !important;
    }
    .chatTextBox textarea:hover {
        border: none !important;
        box-shadow: none !important;
    }
    .chatTextBox textarea:focus {
        border: none !important;
        box-shadow: none !important;
    }
    /* 重写iview的滚动框高度,使用deep穿透 */
    .leftScotll /deep/ .ivu-scroll-container {
        height:78vh !important;
    }
    .rightScotll /deep/ .ivu-scroll-container {
        height:61vh !important;
    }
    .userItem {
        padding: 10px;
        cursor: pointer;
    }
    .userItem /deep/ .ivu-list-item-meta-description {
      width: 100px;
      white-space: nowrap;/*设置不换行*/
      overflow: hidden; /*设置隐藏*/
      text-overflow: ellipsis; /*设置隐藏部分为省略号*/
    }
    .userItem:hover {
        background-color: #ddd;
    }
    .userItemSel {
        padding: 10px;
        cursor: pointer;
        background-color: #ddd;
    }
    .userItemSel /deep/ .ivu-list-item-meta-description {
      width: 100px;
      white-space: nowrap;/*设置不换行*/
      overflow: hidden; /*设置隐藏*/
      text-overflow: ellipsis; /*设置隐藏部分为省略号*/
    }
    .messageItem-L {
        display: flex;
        margin-top: 20px;
        padding-left: 20px;
    }
    .messageItemText-L {
        float: left;
        margin-left:10px;
        max-width: 60%;
        padding: 6px 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 3px;
        border: 0.1px solid#eee;
        /* -moz-box-shadow:0px 0px 2px #888;box-shadow:0px 0px 2px #888; */
    }
    .messageItemBox-L{
        margin-right: -12px;
        z-index: 2;
        margin-top: 8px;
        width:0;
        height:0;
        border-top:6px solid transparent;
        border-bottom:6px solid transparent;
        border-right:8px solid #fff;
        /* border: 0.1px solid#eee; */
    }
    .messageItem-R {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
        padding-right: 20px;
    }
    .messageItemText-R {
        float: left;
        margin-right:10px;
        padding: 6px 10px;
        max-width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #3399ff;
        border-radius: 3px;
        border: 0.1px solid#eee;
        /* -moz-box-shadow:0px 0px 2px #888;box-shadow:0px 0px 2px #888; */
    }
    .messageItemBox-R{
        margin-left: -14px;
        margin-top: 8px;
        z-index: 2;
        width:0;
        height:0;
        border-top:6px solid transparent;
        border-bottom:6px solid transparent;
        border-left:8px solid #3399ff;
        /* border: 0.1px solid#eee; */
    }
    /* 中屏 */
    @media screen and (max-width: 990px) {
      .chatCard{
        margin: 0 auto;
        margin-top: 80px;
        width: 100%;
        height: 85vh;
      }
      .display{display: none}
    }
    /* 小屏 */
    @media screen and (max-width: 768px) {
      .chatCard{
        margin: 0 auto;
        margin-top: 80px;
        width: 100%;
        height: 88vh;
      }
      .display{display: inline}
    }

</style>

<template>
  <Layout>
      <Drawer title="消息列表" :scrollable="true" placement="left" v-model="openChartList">
        <div style="width:100%; height:100%; position:absolute; margin: -16px">
            <div v-for="user in ConversationList" :class="chartTitle==user.userName?'userItemSel':'userItem'" @click="chooseUser(user.userName)" :key="user.userName">
                <Row type="flex" justify="start" align="middle">
                <Col span="22">
                    <ListItemMeta
                        :avatar="user.avatar"
                        :title="user.userName"
                        :description="(usrMessageList[user.userName]==null || usrMessageList[user.userName].data.length==0)?'暂无消息':usrMessageList[user.userName].data[usrMessageList[user.userName].data.length-1].message"
                    />
                </Col>
                <Col span="2">
                    <Badge v-if="(chartTitle !== user.userName && usrMessageList[user.userName]!=undefined)" :count="usrMessageList[user.userName].unRead"></Badge>
                </Col>
                </Row>
            </div>
        </div>
      </Drawer>

      <HomeNav />
      <Content class="content">
      <Card class="chatCard" :padding='0' dis-hover>
          <Row>
              <Col :lg="{span:6}" :md="{span:7}" :xs="{span:0}">
                  <div style="height:85vh;background-color: #f2f2f2;">
                      <!-- 标题 -->
                      <div style="top: 0;height:8%; width:100%; background-color: #ededed; position:absolute; display: flex;justify-content: center;align-items: center;">
                           <p>消息列表</p>
                      </div>
                      <!-- 信息对象 -->
                      <div style="top: 8%;height:92%; width:100%; position:absolute;">
                          <Scroll class="leftScotll">
                              <div v-for="dialog in ConversationList" :class="chartTitle==dialog.toAccount?'userItemSel':'userItem'" @click="chooseUser(dialog)" :key="dialog.conversationID">
                                  <Row type="flex" justify="start" align="middle">
                                  <Col span="22">
                                      <ListItemMeta
                                          :avatar="dialog.userProfile.avatar?dialog.userProfile.avatar:'http://im.lczeros.cn/ZimData/images/avatar/861ad3bfa725978e68a8e5707d0a9079.png'"
                                          :title="dialog.userProfile.userID"
                                          :description="dialog.lastMessage.messageForShow"
                                      />
                                  </Col>
                                  <Col span="2">
                                      <Badge v-if="dialog.unreadCount!=0" :count="dialog.unreadCount"></Badge>
                                  </Col>
                                  </Row>
                              </div>
                          </Scroll>
                      </div>
                  </div>
              </Col>
              <Col :lg="{span:18}" :md="{span:17}" :xs="{span:24}">
                  <div style="height:85vh;background-color: #f4f4f4;">
                      <!-- 标题 -->
                      <Row type="flex" justify="center" align="middle" style="height:8%;">
                          <Col span="8">
                            <div class="display">
                              <Tooltip
                                content="消息列表"
                                placement="top-start"
                                style="margin-left:20px"
                              >
                                <Badge dot :count="totMessage">
                                    <Icon type="md-people" size="20" @click="openChartList = true"/>
                                </Badge>
                              </Tooltip>
                            </div>
                          </Col>
                          <Col span="8" style="display: flex;justify-content: center;align-items: center;">{{chartTitle}}</Col>
                          <Col span="8" style="height:100%;display: flex;justify-content: flex-end;align-items: center;">
                              <Tooltip
                                  v-if="chartTitle!='未选择'"
                                  content="退出私聊"
                                  placement="top-end"
                                  style="margin-right:20px"
                              >
                                  <!-- <Icon type="md-exit" size="20" @click="backPubChart()"/> -->
                              </Tooltip>
                          </Col>
                      </Row>
                      <!-- 聊天内容 -->
                      <div style="top:8%;height:72%;width:100%;position:absolute;background-color: #f8f8f8;">
                          <div ref=messageBox style="overflow:auto; height:61vh !important;padding-bottom: 15px;">
                              <!-- 聊天内容 -->
                              <div v-for="item in messageList">
                                  <div v-if="item.from != UserData.userName" class="messageItem-L">
                                      <Avatar style="margin-right:5px" class="avatar" :src="item.avatar" />
                                      <div class="messageItemBox-L"></div>
                                      <div class="messageItemText-L">
                                          <p style="word-break:break-all;white-space: pre-line;">{{item.payload.text}}</p>
                                      </div>
                                  </div>
                                  <div v-else class="messageItem-R">
                                      <div class="messageItemText-R">
                                          <p style="color:#fff;word-break:break-all;white-space: pre-line;">{{item.payload.text}}</p>
                                      </div>
                                      <div class="messageItemBox-R"></div>
                                      <Avatar style="margin-left:5px"  class="avatar" :src="UserData.avatarUrl" />
                                  </div>
                              </div>
                          </div>
                      </div>
                      <!-- 输入框 -->
                      <div style="bottom:0; height:20%; width:100%; position:absolute;background-color: white;">
                          <Input ref=sendInput @on-keyup="checkInput" v-model="sendTextMessage" :maxlength="250" class="chatTextBox" type="textarea" :rows="3" placeholder="开始聊天...." />
                      </div>
                      <!-- 发送按钮 -->
                      <div style="bottom:25px; right:25px; height:2%; position:absolute; background-color: white;">
                          <Button @click="sendMessage()" size="small" type="primary">发送</Button>
                      </div>
                  </div>
              </Col>
          </Row>
      </Card>
      </Content>
      <!-- <HomeFooter class="foot"></HomeFooter> -->
    </Layout>
</template>

<script>
    // 引入组件
    import HomeNav from "@/components/frontground/Home-Nav";
    import HomeFooter from "@/components/frontground/Home-Footer";

    export default {
        name: 'websocket',
        components: {
                //导航条
                HomeNav,
                HomeFooter
        },
        data(){
            return{ 
                pubmessageList: [],
                usrMessageList: {},
                stompClient: null,
                timer: null,
                socket: null,
                sendData: {
                    toUserName: null,
                    fromUserAvatar: '',
                    message: '',
                },
                sendType:'/sendPub',
                openChartList:false,
                totMessage: 0,

                UserData:JSON.parse(localStorage.getItem("UserData")),
                chartTitle:'未选择',
                dialogData: {},
                messageList: [],
                sendTextMessage:''
                
            }
        },
        mounted() {
            console.log("mouted")
            // this.Request.GetUserData()
            if(this.isLogin){
                // this.getDialog()
            }
            if(!this.UserData){
               this.$Message.info('请先登录')
               this.$router.push("/login")
            }
            else{
                this.timLogin(this.UserData.userTimId,this.UserData.userSig)
            }
        },
        beforeDestroy: function() {
            // 页面离开时断开连接,清除定时器
            // this.disconnect()
            // clearInterval(this.timer)
        },
        computed: {
            isLogin(){
				return this.$store.state.isLogin;
			},
            ConversationList(){
                return this.$store.state.userConversationList
            },
            getNewMessage() {
				return this.$store.state.newMessage
			}
        },
        watch: {
			getNewMessage(msgs){
				console.log("收到新信息！",msgs)
				msgs.forEach((msg)=>{
					if (msg.conversationID === this.dialogData.conversationID){
						this.messageList.push(msg)
                        this.handelRead(this.dialogData.conversationID)
						this.endScoll()
					}
				})
			}
		},
        methods: {
            // timSDK 登录
			timLogin: function (userID, userSig) {
				let promise = this.Tim.login({userID, userSig});
				promise.then((imResponse)=>{
					if (imResponse.data.repeatLogin === true) {
						// 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
						console.log(imResponse.data.errorInfo);
					}
				})
				.catch(function(imError) {
					console.warn('login error:', imError); // 登录失败的相关信息
					this.$store.commit('changeLoginState',false)
				})
            },
            sendMessage() {
				if(this.sendTextMessage<0){
					return;
				}
				
				console.log(this.dialogData.to)
				
				// 1. 创建消息实例，接口返回的实例可以上屏
				let message = this.Tim.createTextMessage({
				  to: this.dialogData.to,
				  conversationType: this.dialogData.type,
				  payload: {
				    text: this.sendTextMessage
				  }
				});
				// 2. 发送消息
				let promise = this.Tim.sendMessage(message);
				promise.then((imResponse) => {
				    // 发送成功
                    this.sendTextMessage = '';//清空输入框
                    this.messageList.push(imResponse.data.message)
					this.endScoll()
				}).catch(function(imError) {
                    // 发送失败
                    console.warn('sendMessage error:', imError);
				});
            },
            // 选择用户
            chooseUser(dialog){
                this.chartTitle = dialog.toAccount
                this.getMsgList(dialog)

                this.handelRead(dialog.conversationID)
            },
            // 已读信息上报
            handelRead(conversationID){
                let promise = this.Tim.setMessageRead({conversationID});
				promise.then(function(imResponse) {
				}).catch(function(imError) {
				  console.warn('setMessageRead error:', imError);
				});
            },
            // 获取对话内容
            getMsgList(dialog){
				let promise = this.Tim.getMessageList({conversationID:dialog.conversationID, count: 15});
                promise.then((imResponse) => {
                    const messageList = imResponse.data.messageList; // 消息列表。
                    const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
                    const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
                        
                    this.dialogData = {
                        conversationID: dialog.conversationID,
                        nextReqMessageID,
                        isCompleted,
                        type: dialog.type,
                        to: dialog.toAccount
                    }
                    
                    console.log(messageList)
                    this.messageList = messageList
                    this.endScoll()
				})
            },
            // 转换信息格式
            transMsg(msg){

            },
            backPubChart(){
                this.messageList = []
                this.messageList = this.pubmessageList
                this.sendType = '/sendPub'
                this.sendData.toUserName = null
                this.chartTitle = '公共区域'
                // this.$refs.sendInput.focus()
            },
            checkInput(e) {
                if (e.key==='Enter' && e.ctrlKey === true){
                    this.sendMessage()
                }
            },
            endScoll() {
                // 新消息置底
                setTimeout(() => {
                    console.log(this.$refs)
                    this.$refs.messageBox.scrollTop = this.$refs.messageBox.scrollHeight+100;                     
                }, 10);

            }
        }
    }
</script>
