import {request, requestNoShowLoading} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal, showToastMedalSuccess } from "../../utils/toast.js"
var cancel;
Page({

  data: {
    currentID: "1",
    userInfo: {},
    myNoticInfo: {},
    myFansInfo: {},
    limit: "99",
    currentType: "notice",
    genderType: {
      "0": "保密",
      "1": "男",
      "2": "女"
    }
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({ userInfo: userInfo });
    this.handleMyNotice(true);
  },
  onShow: function () {
    let that = this;
    that.cancel = setInterval(that.getMyFansNoLoading, 10000);
  },
  onHide: function () {
    let that = this;
    clearInterval( that.cancel);
  },
  onUnload:function () {
    let that = this;
    clearInterval( that.cancel);
  },
  async handleMyNotice() {
    this.setData({ currentID: "1", currentType: "notice"});
    const res = await request({ url: "/user/follows", data: {uid: this.data.userInfo.userId, limit: this.data.limit } });
    let result = res.data;
    this.setData({
      "myNoticInfo": result.follow.map( (item) => ({
        "id": item.userId,
        "nickname": item.nickname,
        "avatarUrl": item.avatarUrl,
        "signature": item.signature,
        "gender": this.data.genderType[item.gender],
        "vipType": item.vipRights != "" ? item.vipRights : "",
      }))
    });
  },
  async handleMyFans() {
    this.setData({ currentID: "2", currentType: "fan" });
    const res = await request({ url: '/user/followeds', data: {uid: this.data.userInfo.userId, limit: this.data.limit } });
    let result = res.data;
    this.setData({
      "myFansInfo": result.followeds.map( (item) => ({
        "id": item.userId,
        "nickname": item.nickname,
        "avatarUrl": item.avatarUrl,
        "gender": this.data.genderType[item.gender],
        "followed": item.followed ? "已关注": "关注"
      }))
    });
  },
  async handleNoticeStatus (event) {
    let uid = event.currentTarget.dataset.id;
    let name = event.currentTarget.dataset.name;
    if( name == "关注") {
      const res = await requestNoShowLoading({ url: '/follow', data: { id: uid, t: 1} });
      if (res.data.code ==  200) {
        this.getMyFansNoLoading();
        this.setData({ currentID: "2", currentType: "fan" });
        showToastMedalSuccess("关注成功");
      }
    } else {
      const res = await requestNoShowLoading({ url: '/follow', data: { id: uid, t: 0} });
      if (res.data.code == 200) {
        this.getMyFansNoLoading();
        this.setData({ currentID: "2", currentType: "fan" });
        showToastMedal("已取消关注");
      }
    }
    
  },
  getMyFans: function () {
    request({ url: '/user/followeds?uid=' + this.data.userInfo.userId + "&limit=" + this.data.limit}).then( (res) => {
      let result = res.data;
      this.setData({
        "myFansInfo": result.followeds.map( (item) => ({
          "id": item.userId,
          "nickname": item.nickname,
          "avatarUrl": item.avatarUrl,
          "gender": this.data.genderType[item.gender],
          "followed": item.followed ? "已关注": "关注"
        }))
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  getMyFansNoLoading: function () {
    requestNoShowLoading({ url: '/user/followeds?uid=' + this.data.userInfo.userId + "&limit=" + this.data.limit}).then( (res) => {
      let result = res.data;
      this.setData({
        "myFansInfo": result.followeds.map( (item) => ({
          "id": item.userId,
          "nickname": item.nickname,
          "avatarUrl": item.avatarUrl,
          "gender": this.data.genderType[item.gender],
          "followed": item.followed ? "已关注": "关注"
        }))
      });
    }).catch((err) => {
      console.log(err);
    });
  },
  handlePersonalDetail: function (event) {
    let userId = event.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/personal-detail/personal-detail?id=' + userId });
  }
})