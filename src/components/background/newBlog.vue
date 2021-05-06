<style scoped>
.w-e-text-container{
    height: 700px !important;
}
</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>博客管理</BreadcrumbItem>
                <BreadcrumbItem>新博客</BreadcrumbItem>
            </Breadcrumb>
            <Row type="flex" justify="center" align="top" class="code-row-bg" style="min-height:85vh">
                <Col span="19">
                    <Card dis-hover>
                        <Row type="flex" justify="center" align="middle">
                            <Col span="16"><Input v-model="BlogData.title" maxlength="40" size="large" show-word-limit placeholder="请输入文章标题" /></Col>
                            <Col span="4" offset="4">
                            <div>
                                <i-switch v-model="isMd" :before-change="changeEditor" true-color="#13ce66" false-color="#3480d3" size="large">
                                    <span slot="open">MD</span>
                                    <span slot="close">Html</span>
                                </i-switch>
                            </div>
                            </Col>
                        </Row>
                        <!-- 富文本编辑器 -->
                        <div v-show="isMd==false">
                            <div ref="editor" style="text-align:left;margin-top:20px;height:50vh"></div>
                        </div>
                        <!-- Md编辑器 -->
                        <div v-show="isMd" style="margin-top:20px;">
                            <mavon-editor
                            ref=md
                            style="z-index:1000;min-height: 500px;"
                            v-model="BlogData.blogContentMd"
                            :boxShadow='false'
                            :preview='false'
                            @imgAdd="uploadImg"
                            @save="saveBlog"
                            :tabSize='4'
                            />
                        </div>
                        <div style="text-aligin:center;margin-top:20px">
                            <Button @click="saveBlog" v-if='isShowSave'>暂时保存</Button>
                            <Button @click="submitBlog" type="primary">发布文章</Button>
                        </div>
                        
                    </Card>
                </Col>
                <Col span="5">
                    <Collapse :value="open">
                        <Panel name="1">
                            发布板块
                            <p slot="content">
                                <Select v-model="BlogData.classId" @on-change="changeClass" placeholder="选择板块">
                                    <Option v-for="item in classList" :value="item.classId" :key="item.classId">{{ item.name }}</Option>
                                </Select>
                                <!-- <Select v-model="BlogData.tagsList" :disabled="BlogData.classId==''" filterable allow-create @on-create="handleCreate" multiple placeholder="选择标签" style="margin-top:10px">
                                    <Option v-for="item in labelList" :value="{tagsId:item.tagsId}" :key="item.tagsId">{{ item.tagName }}</Option>
                                </Select> -->

                                <Select v-model="linsTag" @on-change="addTag" placeholder="选择/创建标签" :disabled="BlogData.classId==''" :label-in-value="true" filterable allow-create @on-create="handleCreate" style="margin-top:10px">
                                    <Option v-for="item in labelList" :value="item.tagsId" :key="item.tagsId">{{ item.tagName }}</Option>
                                </Select>
                                <Divider>已添加的标签</Divider>
                                <Tag color="primary" closable @on-close="delTag(item)" v-for="item in BlogData.tagsList" :key="item.tagsId">{{item.tagName}}</Tag>
                                <!-- <Select v-model="linsTag" multiple>
                                    <Option v-for="item in labelList" :value="item" :label-in-value="true" :key="item.tagsId">{{ item.tagName }}</Option>
                                </Select> -->
                            </p>
                        </Panel>
                        <Panel name="2">
                            简介描写
                            <p slot="content">
                                <Input v-model="BlogData.summary" maxlength="100" :rows="4" show-word-limit type="textarea" placeholder="该博主没有写简介噢" />
                            </p>
                        </Panel>
                        <Panel name="3">
                            文章设定
                            <p slot="content">
                            </p>
                        </Panel>
                    </Collapse>
                    
                </Col>
            </Row>
        </Content>
    </Layout>
</template>
<script >
    import E from 'wangeditor'
    
    export default {
        name: 'editor',
        data(){
            return{
                editorContent: '',
                editor : null,
                open:[1,2],
                isMd:true,
                BlogData:{
                    title:'',
                    classId:'',
                    tagsList:[],
                    type:1,
                    summary:"该博主没有写简介噢",
                    blogContentHtml:'',
                    blogContentMd:'',
                    imageList:[]
                },
                editorType:[
                    {
                        id:'1',
                        type:'HTML编辑器'
                    },{
                        id:'2',
                        type:'MD编辑器'
                    }
                ],
                classList:[],
                labelList:[],
                linsTag:[],
                isShowSave: true
            }
        },
        methods: {
            //选择板块
            changeClass(e){
                this.BlogData.tagsList=[]
                var postData={
                    classId:this.BlogData.classId
                }
                this.Request.GetTagsList(postData)
                .then(response=>{
                    if(response.data.code==200){
                        this.labelList=response.data.data
                    }else{
                        alert("获取标签失败！")
                    }
                })
            },
            //新添加标签
            handleCreate (val) {
                var postData={
                    tagName:val,
                    classification:this.BlogData.classId
                }
                this.Request.InsertTags(postData)
                .then(response=>{
                    if(response.data.code==200){
                        this.labelList.push({
                            tagsId: response.data.data.tagsId,
                            tagName: response.data.data.tagName
                        });
                        this.BlogData.tagsList.push({
                            tagsId: response.data.data.tagsId,
                            tagName: response.data.data.tagName
                        })
                        // this.linsTag=''
                    }else{
                        alert("添加失败！")
                    }
                })

            },
            //添加标签
            addTag(e){
                if (e.value == e.label)
                    return
                var data = {
                    tagsId: e.value,
                    tagName: e.label
                }
                if(this.BlogData.tagsList.findIndex((value)=>value.tagsId==e.value) == -1){
                    this.BlogData.tagsList.push(data)
                }
                else
                    this.$Message.info("标签重复")
            },
            //删除标签
            delTag(item){
                const index = this.BlogData.tagsList.indexOf(item);
                this.BlogData.tagsList.splice(index,1)
            },
            //选择编辑器
            changeEditor () {
                return new Promise((resolve) => {
                    this.$Modal.confirm({
                        title: '确认要切换编辑器吗？',
                        content: '<p style="color:blue">这将清空你所有的内容</p>',
                        onOk: () => {
                            //清空内容
                            this.BlogData.blogContentMd='',
                            this.BlogData.blogContentHtml='',
                            this.BlogData.imageList=[]
                            this.editor.txt.clear()
                            resolve();
                        }
                    });
                });
            },
            //md编辑器上传照片
            uploadImg(pos,img){
                var formdata = new FormData();
                formdata.append('image', img);
                this.Request.UploadImage(formdata)
                .then(result=>{
                    if(result.data.code==200){
                        //获取md对象返回上传的url
                        this.$refs.md.$img2Url(pos, result.data.data.imgUrl);
                        this.BlogData.imageList.push(result.data.data.imgName)
                    }else{
                        this.$Message.error("上传失败！"+result.data.message)
                    }
                })
            },
            // 暂存到本地
            saveBlog() {
                // 如果是编辑博客，则直接提交
                if (this.isShowSave){
                    localStorage.setItem("BlogData",JSON.stringify(this.BlogData))
                    this.$Notice.info({title: '已暂存'});
                }else{
                    this.submitBlog()
                }

            },
            //提交博客
            submitBlog(){
                if(this.BlogData.title==""){
                    this.$Notice.error({title: '请输入标题',});
                }else if(this.BlogData.classId==''){
                    this.$Notice.error({title: '请选择一个板块',});
                }else if((this.BlogData.blogContentHtml.length == 0 || this.BlogData.blogContentHtml == "<p><br></p>") && this.BlogData.blogContentMd.length == 0){
                    this.$Notice.error({title: '请输入正文',});
                }else{
                    // 保存到local,防止token过期
                    localStorage.setItem("BlogData",JSON.stringify(this.BlogData))
                    this.Request.InsertBlog(this.BlogData)
                    .then(result=>{
                        if(result.data.code==200){
                            this.isShowSave = false
                            this.$Message.success("发送成功");
                            this.$router.push({path:'/admin/sended'});
                            localStorage.removeItem("BlogData")
                        }else if(result.data.code==504){
                            this.$Message.info("标签添加失败或无标签")
                        }else{
                             this.$Message.error(result.data.message)
                        }
                    })
                }
            },
            //设置富文本编辑器
            setEditor(){
                var that = this
                this.editor=new E(this.$refs.editor)
                this.editor.customConfig.onchange = (html) => {
                    this.BlogData.blogContentHtml = html
                }
                this.editor.customConfig.zIndex = 0 // 配置编辑区域的 z-index
                // this.editor.customConfig.uploadImgServer = '/upload/image' // 上传图片到服务器 配置服务器端地址
                // this.editor.customConfig.uploadImgHeaders = {
                //     'Authorization': localStorage.getItem('token'),
                // }
                // this.editor.customConfig.uploadFileName = 'image'
                // this.editor.customConfig.uploadImgMaxLength = 1 // 限制一次最多上传 1 张图片
                // this.editor.customConfig.uploadImgTimeout = 60000
                // this.editor.customConfig.uploadImgHooks = {
                //     // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                //     // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                //     customInsert: function (insertImg, result, editor) {
                //     // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                //     // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                //     // 举例：假如上传图片成功后，服务器端返回的是 {data:'....'} 这种格式，即可这样插入图片：
                //         insertImg(result.data.imgUrl)
                        
                //     // result 必须是一个 JSON 格式字符串！！！否则报错
                //     },
                //     success: function (xhr, editor, result) {
                //         // 图片上传并返回结果，图片插入成功之后触发
                //         that.BlogData.imageList.append(result.data.imgName)
                //     },
                // }

                //自定义图片上传
                this.editor.customConfig.customUploadImg = function (files, insert) {
                    // files 是 input 中选中的文件列表
                    // insert 是获取图片 url 后，插入到编辑器的方法
                    var formdata = new FormData();
                    formdata.append('image', files[0]);
                    that.Request.UploadImage(formdata)
                    .then(result=>{
                        if(result.data.code==200){
                            //插入图片
                            insert(result.data.data.imgUrl)
                            if(that.BlogData.imageList == null)
                                that.BlogData.imageList=[]
                            that.BlogData.imageList.push(result.data.data.imgName)
                        }else{
                            that.$Message.error("上传失败！"+result.data.message)
                        }
                    })
                    // 上传代码返回结果之后，将图片插入到编辑器中
                }
                this.editor.create()
            }
        },
        
        mounted() {
            this.setEditor()
            //获取分类数据
            this.Request.GetClassificationList()
            .then(response=>{
                if(response.data.code==200){
                    this.classList=response.data.data
                }
            })
            //是否是修改博客
            if(this.$route.params.id!=null){
                this.isShowSave = false
                this.Request.GetBlog({blogId:this.$route.params.id,token:localStorage.getItem("token")})
                .then(Result => {
                    if (Result.data.code === 200) { // 成功
                        this.BlogData = Result.data.data
                        //设置编辑器
                        if(Result.data.data.blogContentHtml != ''){
                            this.isMd=false
                            this.editor.txt.html(Result.data.data.blogContentHtml)
                        }else if(Result.data.data.blogContentHtml == ''){
                            this.isMd=true
                        }
                        
                        //设置标签
                        this.labelList=Result.data.data.tagsList

                        //设置标签
                        var postData={
                            classId:this.BlogData.classId
                        }
                        this.Request.GetTagsList(postData)
                        .then(response=>{
                            if(response.data.code==200){
                                this.labelList=response.data.data
                            }else{
                                alert("获取标签失败！")
                            }
                        })
                    } else { // 失败
                        this.$Message.error(Result.data.data.message) // 提示
                    }
                })
            }
            // 检测数据恢复
            if (localStorage.getItem('BlogData') !== null) {
                this.$Modal.confirm({
                    title: "检测到上次保存数据",
                    content: "是否恢复",
                    onOk: () => {
                        this.BlogData = JSON.parse(localStorage.getItem('BlogData'))
                        localStorage.removeItem("BlogData")
                    },
                    onCancel: () => {
                        localStorage.removeItem("BlogData")
                    }
                });
            }
        },
        beforeRouteLeave (to, from, next) {
            if (this.isShowSave && (this.BlogData.title !== '' || this.BlogData.blogContentHtml !== '' || this.BlogData.blogContentMd !== '')){
                this.$Modal.confirm({
                    title: "确定离开页面吗？",
                    content: "离开将不保存数据",
                    onOk: () => {
                        this.BlogData=[]
                        this.editor.txt.clear()
                        next()
                    },
                });
            }
            else{
                this.BlogData=[]
                this.editor.txt.clear()
                next()                
            }

        }
    }
</script>