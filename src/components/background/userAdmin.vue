<style scoped>

</style>
<template>
    <Layout :style="{marginLeft: '200px'}">
        <Content :style="{padding: '0 16px 16px'}">
            <Breadcrumb :style="{margin: '16px 0'}">
                <BreadcrumbItem>用户管理</BreadcrumbItem>
            </Breadcrumb>
            <Card>
                <Table border :loading="loading" :columns="tableTitle" :data="userList">
                    <template slot-scope="{ row }" slot="userName">
                        <strong>{{ row.userName }}</strong>
                    </template>
                    <template slot-scope="{ row }" slot="status">
                        <strong v-if="getUserStatus(row.userName)=='Online'" style="color:blue">在线</strong>
                        <strong v-else >离线</strong>
                    </template>
                    <template slot-scope="{ row, index }" slot="action">
                        <Button type="primary" size="small" @click="resetUser(row.userName)">重置</Button>
                        <Button :type="row.isban?'primary':'warning'" size="small"@click="banUser(row)">{{row.isban?'解封':'封禁'}}</Button>
                        <Button type="error" size="small" @click="deleteUser(row.userName)">删除</Button>
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
                        title: '用户名',
                        slot: 'userName',
                        align: 'center'
                    },
                    // {
                    //     title: 'TimID',
                    //     key: 'userTimId',
                    //     align: 'center',
                    //     sortable: true
                    // },
                    {
                        title: 'E-mail',
                        key: 'email',
                        align: 'center',
                        // sortable: true
                    },
                    {
                        title: '角色',
                        key: 'role',
                        align: 'center',
                        // sortable: true
                    },
                    {
                        title: '状态',
                        slot: 'status',
                        align: 'center',
                        width: 100,
                        sortable: true
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 200,
                        align: 'center'
                    }
                ],
                userList:[],
                userOnline:{}
            }
        },
        mounted(){
            this.getUserList()
        },
        computed: {

        },
        methods:{
            getUserList(){
                this.Request.GetUserList()
                .then(res=>{
                    if(res.data.code === 200){
                        this.userList = res.data.data.userList
                        this.loading = false
                        // 获取在线状态
                        if(res.data.data.timOnlineData){
                            res.data.data.timOnlineData.QueryResult.forEach(item=>{
                                this.userOnline[item.To_Account]=item.State
                            })
                        }
                    }
                })
            },
            resetUser(userName){
                this.$Modal.confirm({
                    title: '确定重置该用户的密码吗？',
                    content:'该用户的密码将被重置为’123456‘',
                    onOk: () => {
                                                
                    },
                });
            },
            banUser(item){
                if(item.isban){
                    console.log("解禁请求")
                    this.$Modal.confirm({
                        title: '确定解禁该用户吗？',
                        onOk: () => {
                            this.loading = true
                            this.Request.UnBanUser(item.userName)
                            .then(res=>{
                                if(res.data.data = 200){
                                    this.$Message.info('操作成功');
                                    this.getUserList()
                                    this.loading = false
                                }
                            })                        
                        },
                    });
                }
                else{
                    console.log("封禁请求")
                    this.$Modal.confirm({
                        title: '确定封禁该用户吗？',
                        content:'如该用户在线，则会被强制下线',
                        onOk: () => {
                            this.loading = true
                            this.Request.BanUser(item.userName)
                            .then(res=>{
                                if(res.data.data = 200){
                                    this.$Message.info('操作成功');
                                    this.getUserList()
                                    this.loading = false
                                }
                            })                        
                        },
                    });
                }
            },
            deleteUser(userName){
                this.$Modal.confirm({
                    title: '确定删除该用户？',
                    content:'该操作不可逆',
                    onOk: () => {
                                                
                    },
                });
            },
            getUserStatus(userName){
                return this.userOnline[userName]
            }
        }
    }
</script>