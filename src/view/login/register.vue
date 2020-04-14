<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    class="register"
    width="600px"
    :show-close="true"
  >
    <div slot="title" class="title">用户注册</div>
    <!-- 先写上,true, 回头再去掉,不然关不掉 -->
    <!-- 
      el-dialog
      visible.sync属性控该弹窗口是否显示
      slot可以重写title
      width属性用于设置宽度
      show-close	是否显示关闭按钮
    -->

    <!-- 上传头像
            el-upload
           1:上传地址  action
           2：参数     name="值" 该值就是上传文件的参数(在后台注册接口找)
           3:是否显示已上传文件列表    show-file-list  现在是单个,就不用了
           4:上传成功的回调函数   on-success
              成功回调函数里面有个res就是接口返回信息
              上传成功后须在form表单数据里面保存一下该图像avatar值
           5：上传前的处理（还没调用上传接口前的处理）       before-upload
              上传前处理它有一个file文件信息，通过file文件信息能够限制上传格式（file.type），大小等控制  (file.size以字节)
              该回调函数return的值就是控制让不让你通过  true通过  false不通过

        -->

    <el-form :model="form" label-width="70px" :rules="rules" ref="form">
      <el-form-item label="头像" prop="avatar">
        <!-- 无法双向绑定值,所 只能用, 部分校证法 -->
        <el-upload
          class="avatar-uploader"
          :action="baseUrl + '/uploads'"
          name="image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input type="" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="" v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input type="" v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type=""
          :show-password="true"
          v-model="form.password"
        ></el-input>
      </el-form-item>
      <el-form-item label="图形码" prop="code">
        <el-row>
          <el-col :span="17">
            <el-input type="" v-model="form.code"></el-input>
          </el-col>
          <el-col :span="6" :offset="1" class="imgCode">
            <!--现在这里不显图片?? -->
            <!-- 分析: 不能有Input框包着,直接就是图片就行-->
            <!-- 图形码与 下面的 验证码相距太远,经F12是图形的.col影响,所以就加了个类名,改了高度 -->
            <img class="imgCode" :src="codeUrl" alt="" @click="clickCodeUrl" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="rcode">
        <el-row>
          <el-col :span="17">
            <el-input type="" v-model="form.rcode"></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <!-- 这是个buton不是input -->
            <el-button @click="getRcode" :disabled="totalTime != 20"
              >获取用户验证码
              <span v-if="totalTime != 20">{{ totalTime }}</span>
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 在dialog只有title footer 可以重定 设slot -->
    <div slot="footer" class="btnCenter">
      <!-- 直接写了结果进去, 没有再写一个 新的取消事件. -->
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
      <!--  -->
    </div>
  </el-dialog>
</template>
<script>
// import axios from "axios";
//import getPhoneCode from "@/api/register.js";
import { getPhoneCode, register } from "@/api/register.js";
export default {
  name: "register",
  data() {
    return {
      dialogFormVisible: false,
      imageUrl: "",
      baseUrl: process.env.VUE_APP_URL,
      codeUrl: process.env.VUE_APP_URL + "/captcha?type=sendsms",
      totalTime: 20,

      form: {
        //保存头像地址 ,这里加了form 是后面验证 参数之一????
        avatar: "",
        email: "",
        username: "",
        password: "",
        code: "",
        rcode: ""
      },
      rules: {
        avatar: [{ required: true, message: "请上传头像", trigger: "change" }],

        username: [
          { required: true, message: "昵称不能为空", trigger: "change" },
          { min: 3, max: 6, message: "字符长度为3-6个", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 5, message: "长度3-5个字符", trigger: "change" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              let _reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
              if (_reg.test(value)) {
                callback();
              } else {
                callback("请输入正确的邮箱地址");
              }
            }
          }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "change" },
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

        code: [
          { required: true, message: "请输入图形码", trigger: "change" },
          {
            min: 4,
            max: 4,
            message: "请输入正确四位验证码",
            trigger: "change"
          }
        ],

        rcode: [
          { required: true, message: "请输入手机码证码", trigger: "change" },
          {
            min: 4,
            max: 4,
            message: "请输入正确手机四位验证码",
            trigger: "change"
          }
        ]
      }

      // :action="baseUrl + '/uploads'" 要绑定,不然就是字符串
    };
  },
  watch: {
    dialogFormVisible(newVal) {
      if (newVal == false) {
        //表单清空
        this.$refs.form.resetFields();
        //图片没双向绑,另清空
        this.imageUrl = "";
      }
    }
  },

  methods: {
    //上传前处理
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/jpeg/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 它return是布尔值,控制让不让你通过, true 就是通过, false 不通过
    //加这一步,上传成功处理 先写上传前,再写上传成功后;
    handleAvatarSuccess(res) {
      console.log(res);
      //res就是上传图片调用接口成功返回值
      this.imageUrl = this.baseUrl + "/" + res.data.file_path;
      // 获取保存?
      this.form.avatar = res.data.file_path;
      //在这加一方法去验证 :参数,可能是 数组/单个 就是单张图片,数组,['avatar1','avatar2'],这时会回两个结果, 下面这样写,就好了,
      //不用写成数组的???
      this.$refs.form.validateField("avatar");
    },
    // 全局校验
    submitClick() {
      this.$refs.form.validate(valid => {
        if (valid) {
          register(this.form).then(res => {
            console.log("注册返回信息", res);
            // 如果 api封装的好，这个判断 是可以省掉的，如果在响应拦截里面把所有处理都写好了，这里只要能收到数据就是200的数据
            //200这个就可以省掉了     //

            // 返回undefined???

            this.$message.success("恭喜你注册成功");
            this.dialogFormVisible = false;
          });
        }
      });
    },
    //图形验证码 点击变更
    clickCodeUrl() {
      this.codeUrl =
        process.env.VUE_APP_URL + "/captcha?type=sendsms&t=" + Date.now();
    },
    //获取手机验证码

    getRcode() {
      console.log(111);
      let _pass = true;
      this.$refs.form.validateField(["code", "phone"], error => {
        if (error != "") {
          _pass = false;
          //如果返回的信息不为空,那么就是有错误;
          //下面针对 ,错误信息来 详解一下;,不能放在这里,否刚会返回两条验证码.因为这里是返回两条校验码
        }
      });
      if (_pass === false) {
        return;
      } else {
        // axios({
        //   // url: "process.env.VUE_APP_URL + '/sendsms' ",
        //   //这种写法是错的, 没有双引号
        //   url: process.env.VUE_APP_URL + "/sendsms",
        //   //
        //   method: "post",
        //   data: {
        //     code: this.form.code,
        //     phone: this.form.phone,
        //   },
        //   withCredentials: true,
        // }).then((res) => {
        //   console.log(res);
        //   //  得到的信息是数值  得转为字符串  加个 空字符中 ""  就可以转化了
        //   this.$message.success(res.data.data.captcha + "");
        // });

        //先自减1秒, 会有1秒的延迟
        this.totalTime--;
        let timeId = setInterval(() => {
          this.totalTime--;
          if (this.totalTime <= 0) {
            //不让点击
            clearInterval(timeId);
            //重新赋值
            this.totalTime = 20;
          }
        }, 1000);

        getPhoneCode({
          code: this.form.code,
          phone: this.form.phone
        }).then(res => {
          window.console.log(res);
          this.$message.success(res.data.captcha + "");
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
/* //这里加了,
//区域,
//只能它用,
//全局,
//就再加一个style,
// 看下面 */
.register {
  .title {
    height: 53px;
    background: rgba(3, 192, 249, 1);
    color: #fff;
    text-align: center;
    line-height: 53px;
  }
  .imgCode {
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<style lang="less">
// 下面是 上传框的样式,如果不能, 再加一个style
//加了下面两个
.register {
  .el-dialog_header {
    .title {
      padding: 0;
    }
  }
}
.avatar-uploader {
  width: 178px;
  margin: 0 auto;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.btnCenter {
  text-align: center;
}
</style>
