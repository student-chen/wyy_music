import { request } from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { formatDate } from "../../utils/time.js"
import { showToastMedal , showToastMedalSuccess} from "../../utils/toast.js"

Page({
    data: {
        checked: false,
        currentName: "",
        userInfo: {},
        gender: {
            "0": "保密",
            "1": "男",
            "2": "女",
        }
    },

    onLoad: function (options) {

    },
    // 选择手机或者邮箱登录
    handleLogin: function (event) {
        let name = event.currentTarget.dataset.name;
        if(this.data.checked === false) {
            showToastMedal("请勾选协议");
            return;
        }
        if (name === "phone") {
            this.setData({ currentName: "phone" });
        }
        if (name === 'email') {
            this.setData({ currentName: "email" });
        }
        
    },
    // 勾选协议
    handleChoose: function () {
        this.data.checked = !this.data.checked;
    },
    // 手机登录监听手机号码输入
    phoneAccountInput: function (event) {
        let phone = event.detail.value;
        this.setData({ phoneAccount: phone });
    },
    // 监听手机登录的密码输入
    phonePasswordInput: function (event) {
        let psd = event.detail.value;
        this.setData({ phonePassword: psd });
    },
    // 手机登录
    handlePhoneLogin: function () {
        let time = new Date().getTime();
        if (!this.data.phoneAccount || !this.data.phonePassword) {
            showToastMedal("请填写您的账号与密码");
            return;
        }

        let phone = this.data.phoneAccount;
        if (!/^1[0-9]{10}$/.test(phone)) {
            showToastMedal("请认真填写您的手机号码");
            return;
        }

        request({ url: '/login/cellphone', data: { phone: phone, password: this.data.phonePassword, timestamp: time } }).then( (res) => {
            showToastMedalSuccess("登录成功");
            let cookie = res.header;
            this.setData({
                userInfo: {
                    userId: res.data.profile.userId,                                // id
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

            wx.setStorageSync('userInfo', this.data.userInfo);                      // 将个人信息存储Storage
            wx.setStorageSync('cookie', cookie);                                    // 将cookie存储Storage

            wx.navigateBack({ delta: 1 });
        }).catch((err) => {
            console.log(err);
        });
    },

    // 监听邮箱账号
    emailAccountInput: function (event) {
        let email = event.detail.value;
        this.setData({ emailAccount: email });
    },
    // 监听邮箱密码
    emailPasswordInput: function (event) {
        let emailPsd = event.detail.value;
        this.setData({ emailPassword: emailPsd });
    },

    // 邮箱登录
    handleEmailLogin: function () {
        let time = new Date().getTime();

        if (!this.data.emailAccount || !this.data.emailPassword) {
            showToastMedal("请填写您的账号与密码");
            return;
        }

        let email = this.data.emailAccount;
        if (!/^[a-zA-Z]\w{5,17}@163.com/.test(email)) {
            showToastMedal("请认真填写您的邮箱");
            return;
        }

        request({url: '/login', data: { email: email, password: this.data.phonePassword, timestamp: time } }).then((res) => {
            this.setData({
                userInfo: {
                    userId: res.data.profile.userId,                                // id
                    userName: res.data.account.userName,                            // 用户名
                    nickName: res.data.profile.nickname,                            // 昵称
                    userAvatar: res.data.profile.avatarUrl,                         // 头像
                    userGender: this.data.gender[res.data.profile.gender],          // 性别
                    userBirthday: formatDate(res.data.profile.birthday, "en-date"),                       // 生日
                    signature: res.data.profile.signature,                          // 个性签名
                    userVip: res.data.account.vipType,                              // 是否为vip
                    userVipVersion: res.data.account.viptypeVersion,                // vip等级
                    backgroundUr: res.data.profile.backgroundUrl,                   // 个人设置背景
                    userToken: res.data.token,                                      // 验证token
                }
            });
            wx.setStorageSync('userInfo', this.data.userInfo);                      // 存储Storage
            wx.navigateBack({ delta: 1 });
        })
    },
    // 关闭弹窗
    handleClose: function () {
        this.setData({ currentName: "" });
    }
})