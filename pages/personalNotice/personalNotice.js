import {request, requestNoShowLoading} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal, showToastMedalSuccess } from "../../utils/toast.js"
Page({

  data: {
    currentID: "1",
    myNoticInfo: {},
    myFansInfo: {},
    currentType: "notice",
    limit: "99",
    genderType: {
      "0": "保密",
      "1": "男",
      "2": "女"
    }
  },

  onLoad: function (options) {
    let id = options.id;
    let status = options.curretnStatus;
    this.setData({
      "userId": id,
      "currentID": status
    });
    if (this.data.currentID == "1") {
      this.handlePersonalNoticed(true);
    } else {
      this.handlePersonalFans(true);
    }
  },
  onShow: function () {
   let cancel = setInterval(this.getPersonalFansNoLoading, 10000);
   this.setData({ cancel : cancel})
  },
  onHide: function () {
    clearInterval(this.data.cancel);
  },
  async handlePersonalNoticed() {
    this.setData({ currentID: "1", currentType: "notice"});
    const res = await requestNoShowLoading({ url: "/user/follows", data: { uid: this.data.userId, limit: this.data.limit} });
    let result = res.data;
    this.setData({
      "myNoticInfo": result.follow.map( (item) => ({
        "id": item.userId,
        "nickname": item.nickname,
        "avatarUrl": item.avatarUrl,
        "signature": item.signature,
        "gender": this.data.genderType[item.gender],
        "vipTpye": item.vipRights != "" ? item.vipRights : "",
      }))
    });
  },
  async handlePersonalFans() {
    this.setData({ currentID: "2", currentType: "fan" });
    const res = await requestNoShowLoading({ url: '/user/followeds', data: { uid: this.data.userId, limit: this.data.limit} });
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
      const res = await requestNoShowLoading({ url: '/follow',  data: { id: uid, t: 1} });
      if (res.data.code ==  200) {
        this.getPersonalFans();
        this.setData({ currentID: "2", currentType: "fan" });
        showToastMedalSuccess("关注成功");
      }
    } else {
      const res = await requestNoShowLoading({ url: '/follow', data: { id: uid, t: 0} });
      if (res.data.code == 200) {
        this.getPersonalFansNoLoading();
        this.setData({ currentID: "2", currentType: "fan" });
        showToastMedal("已取消关注");
      }
    }
    
  },
  getPersonalFans: function () {
    requestNoShowLoading({ url: '/user/followeds', data: { uid: this.data.userId, limit: this.data.limit} }).then( (res) => {
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
  getPersonalFansNoLoading: function () {
    requestNoShowLoading({ url: '/user/followeds', data: { uid: this.data.userId, limit: this.data.limit} }).then( (res) => {
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