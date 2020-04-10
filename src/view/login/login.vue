<template>
  <div class="login">
    <div class="left">
      <div class="title">
        <img src="@/assets/img/login-logo.png" alt="" />
        <span class="titleName">黑马面面</span>
        <span class="titleLine">|</span>
        <span class="titleName2">用户登录</span>
      </div>
      <!-- form表单 -->
      <el-form :model="form" :rules="rules" ref="form">
        <!-- 测试提交5 -->
        <!-- 测试提交6 -->
        <!-- 测试提交67 -->
        <el-form-item prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            :show-password="true"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-row class="passEvent">
            <el-col :span="17" class="box">
              <el-input
                class="code"
                v-model="form.code"
                placeholder="请输入验证码"
                prefix-icon="el-icon-key"
              ></el-input>
            </el-col>
            <el-col :span="6" :offset="1" class="codeImg"
              ><img :src="codeImgUrl" alt="" @click="clickCode" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="ischecked">
          <el-checkbox v-model="form.ischecked" ref="ischecked">
            <span class="colorWord">我已阅读并同意</span>
            <el-link type="primary" disabled>用户协议</el-link>
            <span class="colorWord">和</span>
            <el-link type="primary" disabled>隐私条款</el-link>
          </el-checkbox>
        </el-form-item>
        <!--  我已阅读并同意, 可以不加link  不然,会因为权重, 改变不了 <el-link type="info">我已阅读并同意</el-link>-->

        <el-form-item>
          <el-button type="primary" class="btn" @click="loginClick"
            >登录</el-button
          >
          <!-- 一点击 注册,就显 对话框 ???? -->
          <el-button type="primary" class="btn" @click="registerClick"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
      <!--也写在表单里吗? 我觉得不写 -->
      <register ref="register"></register>
    </div>

    <!-- <el-row>
           
            <el-col :span="4" class="box"></el-col>
        </el-row> -->

    <div class="right">
      <img src="../../assets/img/login_banner_ele.png" alt="" />
    </div>
  </div>
</template>

<script>
//"@/login/register.vue" 是与login同级

// 登录页,肯定是有, 保存 token,所以,得传进来方法
import register from "./register.vue";
import { toLogin } from "@/api/login.js";
import { saveToken } from "@/utils/token.js";
export default {
  //兄弟 组件间传值, 现在没有经过,路由, 头回用到,兄弟传值

  components: {
    register
  },
  // 方便查找, 在后台vue 里
  name: "login",
  data() {
    return {
      codeImgUrl: process.env.VUE_APP_URL + "/captcha?type=login",
      form: {
        phone: "",
        passWord: "",

        code: "",
        ischecked: false
      },
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              let _reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
              if (_reg.test(value)) {
                callback();
              } else {
                callback("请输入11位数的手机号码");
              }
            }
          }
        ],

        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 10, message: "长度3-10个字符", trigger: "change" }
        ],

        code: [
          { required: true, message: "请输入验证码", trigger: "change" },
          { min: 4, max: 4, message: "请输入正确的验证码", trigger: "change" }
        ],
        ischecked: [
          { required: true, message: "请先阅读,并打勾", trigger: "change" },
          // 用的是部分校验法 validateField 不对,也是用 自定义,校验
          {
            validator: (rule, value, callback) => {
              if (value == true) {
                callback();
              } else {
                callback("请勾选协议");
              }
            }
          }
        ]
      }
    };
  },
  // mounted() {
  //   alert(process.env.VUE_APP_URL);
  // },

  methods: {
    loginClick() {
      this.$refs.form.validate(result => {
        if (result == true) {
          //这个为真时, 就登录呀 发请求
          // 因为有了 request.js 已经把200以外的,所以情况处理了, 现在只有成功200 才会边来这边, 加了,请求头,data都得去掉一个
          toLogin(this.form).then(res => {
            this.$message.success("恭喜你,登录成功");
            window.console.log("登录信息", res);

            // 这里就是最先可以保存 token的地方
            // 保存token
            saveToken(res.data.token);
          });
        }
        // result 这个是可以别的
        // 对这个ture 有个同化?  老师与我们写的不一样
        // if (result) {
        //   this.$message.success("恭喜你,登录成功");
        // } else {
        //   this.$message.error("温馨提示:登录不成功,请重新登录");
        // }
      });
    },
    registerClick() {
      this.$refs.register.dialogFormVisible = true;
    },
    clickCode() {
      // 点击后,地址加随机数,/ 现在时间
      this.codeImgUrl =
        process.env.VUE_APP_URL + "/captcha?type=login&tt=" + Date.now();
    }
  }
};
</script>

<style lang="less">
.login {
  // width: 1400px;
  //app.vue处的, 去掉了,div  直接就是v-router

  //要么就是,在base.css 加上,.app 高度100%
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  //弹性布局
  display: flex;
  justify-content: space-around;
  align-items: center;

  .left {
    width: 478px;
    height: 550px;
    background: rgba(245, 245, 245, 1);

    //内边距
    padding: 43px;
    box-sizing: border-box;
    .title {
      margin-bottom: 29px;
      .titleName {
        font-size: 24px;
        font-family: SourceHanSansCN;
        font-weight: 400;
        color: rgba(12, 12, 12, 1);
        margin-left: 16px;
        margin-right: 14px;
      }

      .titleLine {
        font-size: 24px;
        color: #ccc;
        margin-right: 12px;
      }
      .titleName2 {
        font-size: 22px;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(12, 12, 12, 1);
      }
    }
    .codeImg img {
      width: 100%;
      height: 40px;
      border: 1px dashed red;
    }
    .colorWord {
      color: #666;
    }
    .passEvent {
      // margin-bottom: 32px;

      #userTel {
        margin-bottom: 29px;
      }
      .passWordImg {
        margin-top: 25px;
      }
    }
    .btn {
      width: 100%;
      height: 40px;
    }
    .btn:nth-child(2) {
      //这里如果不用 margin-left:0, 那么, 就用转行符<br>
      margin-left: 0px;
      margin-top: 26px;
    }
  }
}
</style>
