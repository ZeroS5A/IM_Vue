<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>博客管理</BreadcrumbItem>
                <BreadcrumbItem>已发送</BreadcrumbItem>
            </Breadcrumb>
            <Card dis-hover>
                <Row>
                    <span>筛选</span>
                    <Select v-model="postData.classId" @on-change="changeClass" placeholder="选择板块" style="width:200px;margin-left:20px">
                        <Option v-for="item in classList" :value="item.classId" :key="item.classId">{{ item.name }}</Option>
                    </Select>
                    <Select placeholder="选择标签" @on-change="selectTag" :label-in-value="true" style="width:200px;margin-left:10px">
                        <Option v-for="item in tagsList" :value="item.tagsId" :key="item.tagsId">{{ item.tagName }}</Option>
                    </Select>
                </Row>
                <div style="min-height:70vh;margin-top:20px">
                    <Table border :columns="tableTitle" :data="blogList">
                        <template slot-scope="{ row }" slot="name">
                            <strong>{{ row.name }}</strong>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <Button type="primary" size="small" @click="toBlog(index)">查看</Button>
                            <Button type="warning" size="small"@click="editBlog(index)">编辑</Button>
                            <Button type="error" size="small" @click="deleteBlog(index)">删除</Button>
                        </template>
                    </Table>
                </div>
                <!-- 页面选择器 -->
                <Row type="flex" justify="center" class="code-row-bg" style="margin-top:20px">
                    <Page :total="pageNumData.total" :page-size="pageNumData.pageSize" @on-change="changePage" show-elevator />
                </Row>
            </Card>
        </Content>
    </Layout>
</template>
<script >
    export default {
        data(){
            return{
                pageNumData:{
                    total:0,
                    pageNum:0,
                    pageSize:0,
                },
                postData:{
                    title:'%',
                    pageNum:0,
                    classId:'%',
                    tag:'%'
                },
                tableTitle:[
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '发布时间',
                        key: 'blogDate',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '浏览量',
                        key: 'browse',
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
                classList:[],
                tagsList:[]
            }
        },
        methods:{
            toBlog(e){
                this.$router.push('/blog/'+this.blogList[e].blogId);
            },
            editBlog(e){
                this.$router.push('/admin/editBlog/'+this.blogList[e].blogId);
            },
            deleteBlog(e){
                // if(confirm("确定删除这篇文章吗?")){
                //     this.Request.DeleteBlog({blogId:this.blogList[e].blogId})
                //     .then(result=>{
                //         if(result.data.code==200){
                //             this.$Message.info("删除成功")
                //             this.getBlogList()
                //         }
                //     })                   
                // }
                this.$Modal.confirm({
                    title: "确定要删除吗？",
                    onOk: () => {
                        this.Request.DeleteBlog({blogId:this.blogList[e].blogId})
                        .then(result=>{
                            if(result.data.code==200){
                                this.$Message.info("删除成功")
                                this.getBlogList()
                            }
                        })
                    }
                });
            },
            getBlogList(){
                this.postData.pageNum = this.pageNumData.pageNum
                this.Request.GetBlogListByUserId(this.postData)
                .then(result=>{
                    if(result.data.code==200){
                        this.blogList=result.data.data.list
                        this.pageNumData={
                            total:result.data.data.total,
                            pageNum:result.data.data.pageNum,
                            pageSize:result.data.data.pageSize,
                        }
                    }
                    else if(result.data.code==404){
                        this.$Message.error("暂无数据")
                        this.blogList=[]
                    }
                    else{
                        this.$Message.error("无法获取数据")
                    }
                })    
            },
            //页面切换操作
            changePage(e){
                this.pageNumData.pageNum=e
                this.getBlogList()
            },
            //选择板块
            changeClass(e){
                this.tagsList=[]
                this.postData.pageNum=0
                this.postData.tag='%'
                this.postData.title='%'
                
                this.Request.GetTagsList(this.postData)
                .then(response=>{
                    if(response.data.code==200){
                        this.tagsList=response.data.data
                        this.postData.tag='%'
                    }else{
                        alert("获取标签失败！")
                    }
                })
                this.getBlogList()
            },
            //选择标签
            selectTag(e){
                this.postData.tag=e.value
                this.postData.title=''
                this.postData.pageNum=0
                this.getBlogList()
            },
        },
        mounted(){
            this.getBlogList(),
            //获取分类数据
            this.Request.GetClassificationList()
            .then(response=>{
                if(response.data.code==200){
                    this.classList=response.data.data
                }
            })
        }
    }
</script>