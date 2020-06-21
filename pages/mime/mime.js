import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal } from "../../utils/toast.js"

Page({
    data: {
        userInfo: {},
        currentIndex: 0,
        signing: "签到",
    },
    onLoad: function (options) {
        setInterval(this.getOnLoad, 1000);
    },
    getOnLoad: function () {
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo.userToken) {
            this.setData({ userInfo: userInfo, currentIndex: 1});
        } else {
            this.setData({ userInfo: "", currentIndex: 0 })
        }
    },
    handleLogin: function () {
        wx.navigateTo({ url: '/pages/login/login' });
    },
    // 注册
    handleRegister: function () {
        wx.navigateTo({ url: '/pages/register/register' });
    },
    // 签到
    handleDailySigning: function () {
        request({ url: '/daily_signin?type=0'}).then( (res) => {
            if(res.data.code == "200") {
                showToastMedal("签到成功");
            } 
            if(res.data.code == "-2"){
                showToastMedal("请勿重复签到");
            }
            this.setData({ signing: "已签到" });
        }).catch((err) => {
            console.log(err)
        })
    },
    // 退出登录
    handlelogout: function () {
        request({ url: '/logout' }).then((res) => {
            showToastMedal("已成功退出登录");
            wx.removeStorageSync('userInfo');
            wx.removeStorageSync('cookie');
        }).catch((err) => {
            showToastMedal("退出登录失败...")
        })
    },
    // 我的消息
    handleMyMessage: function () {
        wx.navigateTo({ url: '/pages/myMessage/myMessage'});
    },
    // 我的关注
    handleMyNotice: function () {
        wx.navigateTo({ url: '/pages/myNotice/myNotice' });
    },
    // 个人主页
    handleMyDetail: function () {
        let id = this.data.userInfo.userId;
        wx.navigateTo({ url: '/pages/personal-detail/personal-detail?id=' + id});
    },
    // 设置中心
    handleSetting: function () {
        let userInfo = wx.getStorageSync("userInfo");
        let uid = userInfo.userId;
        request({ url: '/user/detail', data: { uid: uid } }).then ((res)=> {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    },
})