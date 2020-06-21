import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { formatDate } from "../../utils/time.js"
import { showToastMedal, showToastMedalSuccess } from "../../utils/toast.js"
Page({

  data: {
    showRemind: "获取动态码",
    disabled: false,
    userInfo: {},
    gender: {
      "0": "保密",
      "1": "男",
      "2": "女",
    }
  },

  onLoad: function (options) {

  },

  // 监听注册的手机号
  accountInput: function (event) {

    let phone = event.detail.value;
    this.setData({ phone: phone });

  },

  // 监听注册的密码
  passwordInput: function (event) {

    let psd = event.detail.value;
    this.setData({ password: psd });

  },

  // 监听注册的昵称
  nicknameInput: function (event) {

    let nickname = event.detail.value;
    this.setData({ nickname: nickname });

  },

  // 监听注册的验证码
  captchaInput: function (event) {

    let captcha = event.detail.value;
    this.setData({ captcha: captcha });

  },

  // 发送验证码
  handleSendCodes: function () {

    let phone = this.data.phone;

    if (!/^1[0-9]{10}$/.test(phone)) {
      showToastMedal("请认真填写您的手机号码");
      return;
    }
    request({ url: '/captcha/sent?phone=' +  phone }).then((res) => {

      if (res.data.code == "400") {
        showToastMedal(res.data.message);
        return;
      } else {
        showToastMedal("验证码发送成功");
        let that = this;
        let number = 60;
        that.setData({
          timer: setInterval(function () {
            number--;
            that.setData({
                "disabled": true,
                "showRemind": number + "s"
            });
            if(number == 0){
                clearInterval(that.data.timer);
                that.setData({
                    "disabled": false,
                    "showRemind": "再次发送"
                })
            }
          },1000)
        });
      }
    }).catch((err) => {
      console.log(err);
      if(err.code == "400"){
        showToastMedal(err.message);
        return;
      }
    })
  },
  handleRegister: function () {

    let phone = this.data.phone;
    let psd =  this.data.password;
    let nickname =  this.data.nickname;
    let captcha =  this.data.captcha;

    if(!phone || !psd || !nickname || !captcha){
      showToastMedal("请将信息填写完整");
      return;
    }

    request({ url: '/register/cellphone', data: { phone: phone, password: psd, captcha: captcha, nickname: nickname} }).then((res) => {
        if(res.data.code == "505") {
          showToastMedal(res.data.message);
          return;
        } else if (res.data.code == "503") {
          showToastMedal(res.data.message);
          return;
        } else {
          showToastMedalSuccess("注册成功");
          this.setData({
              userInfo: {
                  userId: res.data.account.id,                                    // 用户id
                  userName: res.data.account.userName,                            // 用户名
                  nickName: res.data.profile.nickname,                            // 昵称
                  userAvatar: res.data.profile.avatarUrl,                         // 头像
                  userGender: this.data.gender[res.data.profile.gender],          // 性别
                  userBirthday: formatDate(res.data.profile.birthday, "en-date"), // 生日
                  signature: res.data.profile.signature,                          // 个性签名
                  userVip: res.data.account.vipType,                              // 是否为vip
                  userVipVersion: res.data.account.viptypeVersion,                // vip等级
                  backgroundUr: res.data.profile.backgroundUrl,                   // 个人设置背景
                  userToken: res.data.token                                       // 验证token
              }
          });
          wx.setStorageSync('userInfo', this.data.userInfo);                      // 存储Storage
          wx.navigateBack({ delta: 1 });
        }
    }).catch((err) => {
      console.log(err);
    })
  }
})