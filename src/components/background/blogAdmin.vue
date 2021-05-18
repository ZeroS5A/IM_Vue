<style scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Modal
            :title="title"
            v-model="isShow"
            :closable="false"
            cancel-text=""
            class-name="vertical-center-modal">
             <Row v-if="imageList.length === 1" type="flex" justify="center" align="middle" class="code-row-bg">
                <Col>
                    <img height='200vh' width="auto" style="margin-top: 10rpx;" :src="imageList[0]" mode="widthFix"></img>
                </Col>
             </Row>
            <Row v-else>
                <Col span="8" :key="id" v-for="(img,id) in imageList">
                    <img height="auto" width="100vh" style="margin-top: 10rpx;" :src="img"></img>
                </Col>
            </Row>
            <Divider orientation="left">评论区</Divider>
            <div v-if="selectIndex" style="margin-top: 20rpx; padding: 0 6px; width: 100%;background-color:#F6F6F6;">
                <div v-for="comment in blogList[selectIndex].commentList">
                    <p :key="comment.id" style="word-break:break-all;margin-top: 5px;">
                        <span style="color: #007AFF;" >{{comment.userName}}：</span>
                        {{comment.content}}
                    </p>
                </div>
            </div>
        </Modal>
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>广场管理</BreadcrumbItem>
            </Breadcrumb>
            <Card>
                <Table border :loading="loading" :columns="tableTitle" :data="blogList">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" @click="showModel(row,index)">预览</Button>
                        <Button type="error" size="small" @click="deleteUser(index)">删除</Button>
                    </template>
                </Table>
            </Card>
        </Content>
    </Layout>
</template>
<script >
    export default {
        data(){
            return{
                loading:true,

                tableTitle:[
                    {
                        title: '帖子ID',
                        key: 'blogId',
                        width: 100,
                        align: 'center',
                        // sortable: true
                    },                    
                    {
                        title: '发帖人',
                        key: 'userName',
                        width: 150,
                        align: 'center'
                    },
                    {
                        title: '发帖时间',
                        key: 'postTime',
                        width: 200,
                        align: 'center',
                        sortable: true,
                        render: (h, params) => {
                            console.log(params.row.postTime)
                            return h('p',this.format(params.row.postTime))
                        }
                    },
                    {
                        title: '摘要',
                        key: 'content',
                        align: 'center',
                        // sortable: true
                    },
                    {
                        title: '点赞数',
                        key: 'likeNum',
                        width: 100,
                        align: 'center',
                        sortable: true
                    },

                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
                blogList:[],

                isShow:false,
                title:'',
                imageList:[],
                selectIndex:''
                
            }
        },
        mounted(){
            this.Request.GetBlogList()
            .then(res=>{
                if(res.data.code === 200){
                    this.blogList = res.data.data
                    this.loading = false
                }
            })
        },
        methods:{
            showModel(item,index){
                
                this.title = item.content,
                this.imageList = JSON.parse(item.imageList)
                this.selectIndex = index
                console.log(this.imageList)
                this.getCommentList(item.blogId,index)
            },
            getCommentList(blogId,i){
				this.Request.GetCommentList(blogId)
				.then(res=>{
					this.blogList[i].commentList = res.data.data
                    this.isShow = blogId
				})
			},
            add0(m){return m<10?'0'+m:m },
            format(time){
                //shijianchuo是整数，否则要parseInt转换
                var time = new Date(time);
                var y = time.getFullYear();
                var m = time.getMonth()+1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
            }
        }
    }
</script>