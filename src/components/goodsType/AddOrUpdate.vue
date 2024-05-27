<template>
    <el-dialog
            :title="title"
            :visible.sync="addDialogVisible"
            @close="closeDia"
            :before-close="closeDia"
            @open="openDia"
            width="30%">
        <el-form :model="dataForm" status-icon :rules="rules" ref="dataForm" label-width="100px">
            <el-form-item label="类型名：" prop="typeName">
                <el-input v-model="dataForm.typeName" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDia">取 消</el-button>
            <el-button type="primary" @click="addSubmit('dataForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: {
            // 用来控制弹出层的隐藏和显示
            addDialogVisible: {
                type: Boolean,
                default: false
            },
            // 要修改的信息
            updateData: {
                type: Object
            }
        },
        data() {
            return {
                dataForm: {
                    typeName: ''
                },
                rules: {
                    typeName: [
                        { required: true, message: '请输入类型名', trigger: 'blur' }
                    ]
                },
                // 弹窗标题
                title: '新增类型',
            }
        },
        methods: {
            // 关闭弹窗
            closeDia() {
                // 清空表单
                this.$refs['dataForm'].resetFields();
                this.$emit('closeDialog', false)
            },
            // 弹窗打开初始化方法
            openDia() {
                // 如果要修改的ID不为空则 查询要修改的信息
                if(this.updateData) {
                    this.dataForm.typeName = this.updateData.typeName
                    this.dataForm.id = this.updateData.id
                    if(this.updateData.id) {
                        // 标题改为修改
                        this.title = '修改类型'
                    }
                }
            },
            // 表单提交事件
            addSubmit(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        // 发起请求
                        let { data : res } = await this.$request.postForm(`/system/goodsType/saveOrUpdate`, this.dataForm)
                        if(res.code == 1) {
                            this.$message.success("操作成功！")
                            setTimeout(() => {
                                // 关闭弹窗
                                this.$emit('closeDialog', true)
                                // 清空表单
                                this.$refs[formName].resetFields();
                            }, 1000)
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style lang="less" scoped>

</style>