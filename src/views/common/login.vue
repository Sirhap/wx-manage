<template>
    <div class="site-wrapper site-page--login">
        <div class="site-content__wrapper">
            <div class="site-content">
                <div class="brand-info">
                    <h2 class="brand-info__text">微信后台管理系统</h2>
                    <p class="brand-info__intro">微信公众号后台管理系统。</p>
                </div>
                <div class="login-main">
                    <h3 class="login-title">管理员登录</h3>
                    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
                        <el-form-item prop="userName">
                            <el-input v-model="dataForm.userName" placeholder="帐号"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
                        </el-form-item>
                        <el-form-item prop="captcha">
                            <el-row :gutter="20">
                                <el-col :span="14">
                                    <el-input v-model="dataForm.captcha" placeholder="验证码">
                                    </el-input>
                                </el-col>
                                <el-col :span="10" class="login-captcha">
                                    <img :src="captchaPath" @click="getCaptcha()" @error="handleCaptchaError" alt="验证码">
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getUUID } from '@/utils'
export default {
    data() {
        return {
            dataForm: {
                userName: '',
                password: '',
                uuid: '',
                captcha: ''
            },
            dataRule: {
                userName: [
                    { required: true, message: '帐号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ],
                captcha: [
                    { required: true, message: '验证码不能为空', trigger: 'blur' }
                ]
            },
            captchaPath: '',
            captchaError: false
        }
    },
    created() {
        this.getCaptcha()
    },
    methods: {
        // 处理验证码图片加载错误
        handleCaptchaError() {
            if (!this.captchaError) {
                this.captchaError = true
                this.$message.error('验证码加载失败，请点击图片重试')
            }
        },
        // 提交表单
        dataFormSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$http({
                        url: this.$http.adornUrl('/sys/login'),
                        method: 'post',
                        data: this.$http.adornData({
                            'username': this.dataForm.userName,
                            'password': this.dataForm.password,
                            'uuid': this.dataForm.uuid,
                            'captcha': this.dataForm.captcha
                        })
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$cookie.set('token', data.token)
                            this.$router.replace({ name: 'home' })
                        } else {
                            this.getCaptcha()
                            this.$message.error(data.msg)
                        }
                    })
                }
            })
        },
        // 获取验证码
        getCaptcha() {
            this.captchaError = false
            this.dataForm.uuid = getUUID()
            // 先检查验证码接口是否可用
            this.$http({
                url: this.$http.adornUrl('/captcha'),
                method: 'get',
                params: this.$http.adornParams({
                    'uuid': this.dataForm.uuid
                }),
                responseType: 'blob'  // 指定响应类型为blob
            }).then(({data}) => {
                if (data instanceof Blob) {
                    // 如果返回的是图片数据
                    this.captchaPath = URL.createObjectURL(data)
                } else {
                    // 如果返回的是JSON数据
                    this.captchaPath = this.$http.adornUrl(`/captcha?uuid=${this.dataForm.uuid}&t=${new Date().getTime()}`)
                }
            }).catch(() => {
                // 如果接口调用失败，使用传统方式
                this.captchaPath = this.$http.adornUrl(`/captcha?uuid=${this.dataForm.uuid}&t=${new Date().getTime()}`)
            })
        }
    }
}
</script>

<style lang="scss">
.site-wrapper.site-page--login {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(38, 50, 56, 0.5);
    overflow: hidden;
    &:before {
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        content: "";
        background-color: #fa8bff;
        background-image: linear-gradient(
            45deg,
            #fa8bff 0%,
            #2bd2ff 52%,
            #2bff88 90%
        );
        background-size: cover;
    }
    .site-content__wrapper {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 0;
        margin: 0;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: transparent;
    }
    .site-content {
        min-height: 100%;
        padding: 30px 500px 30px 30px;
    }
    .brand-info {
        margin: 220px 100px 0 90px;
        color: #fff;
    }
    .brand-info__text {
        margin: 0 0 22px 0;
        font-size: 48px;
        font-weight: 400;
        text-transform: uppercase;
    }
    .brand-info__intro {
        margin: 10px 0;
        font-size: 16px;
        line-height: 1.58;
        opacity: 0.6;
    }
    .login-main {
        position: absolute;
        top: 0;
        right: 0;
        padding: 150px 60px 180px;
        width: 470px;
        min-height: 100%;
        background-color: #fff;
    }
    .login-title {
        font-size: 16px;
    }
    .login-captcha {
        overflow: hidden;
        > img {
            width: 100%;
            cursor: pointer;
        }
    }
    .login-btn-submit {
        width: 100%;
        margin-top: 38px;
    }
}
</style>
