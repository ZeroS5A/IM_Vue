<style scoped>

</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>用户管理</BreadcrumbItem>
            </Breadcrumb>
            <Card>
                <Table border :columns="tableTitle" :data="userList">
                    <template slot-scope="{ row }" slot="name">
                        <strong>{{ row.name }}</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" @click="resetUser(index)">重置</Button>
                        <Button :type="row.isban?'primary':'warning'" size="small"@click="banUser(index)">{{row.isban?'解封':'封禁'}}</Button>
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
                        title: '用户名',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: 'TimID',
                        key: 'userTimId',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: 'E-mail',
                        key: 'email',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '角色',
                        key: 'role',
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
                userList:[]
            }
        },
        mounted(){
            this.Request.GetUserList()
            .then(res=>{
                if(res.data.code === 200){
                    this.userList = res.data.data
                }
            })
        },
        methods:{

        }
    }
</script>