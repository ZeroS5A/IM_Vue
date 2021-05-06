<style scoped>

</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>用户管理</BreadcrumbItem>
            </Breadcrumb>
            <Card>
                <Table border :columns="tableTitle" :data="blogList">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" @click="resetUser(index)">预览</Button>
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
                tableTitle:[
                    {
                        title: '帖子ID',
                        key: 'blogId',
                        width: 100,
                        align: 'center',
                        sortable: true
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
                        sortable: true
                    },
                    {
                        title: '摘要',
                        key: 'content',
                        align: 'center',
                        sortable: true
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
                blogList:[]
            }
        },
        mounted(){
            this.Request.GetBlogList()
            .then(res=>{
                if(res.data.code === 200){
                    this.blogList = res.data.data
                }
            })
        },
        methods:{

        }
    }
</script>