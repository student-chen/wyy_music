import {request, requestNoShowLoading} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal } from "../../utils/toast.js"
import { formatDate } from "../../utils/time.js"

var cancel;
Page({

  data: {
    currentID: "1",
    messageInfo: {},
    userInfo: {},
    personal: true, // 私信
    comment: false, // 评论
    aite: false,    // @我
    notice: false,  // 通知
    type: {
      "1": "直播",
      "2": "专辑",
      "6": "消息",
      "7": "MV",
      "8": "专栏文章",
      "12": "预告",
    }
  },

  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    this.setData({"userInfo": userInfo});
    this.handlePrivateLetters(true);
  },
  // onShow: function () {
  //   let that = this;
  //   that.cancel = setInterval(that.onLoad, 5000);
  // },
  // onHide: function () {
  //   let that = this;
  //   clearInterval( that.cancel);
  // },
  // onUnload:function () {
  //   let that = this;
  //   clearInterval( that.cancel);
  // },
  // 私信
  async handlePrivateLetters () {
    this.setData({
      currentID: "1",
      personal: true, // 私信
      comment: false, // 通知
      aite: false,    // @我
      notice: false,  // 评论
    });
    const res = await request({ url: '/msg/private?limit=100' });
    let result = res.data;
    let nowDate = new Date();
    this.setData({
      // "messageInfo": []
      "newMsgCount": result.newMsgCount,
      "messageInfo": result.msgs.map( (item) => ({
          "id": item.fromUser.userId,
          "nickname": item.fromUser.artistName ? item.fromUser.artistName : item.fromUser.nickname,        
          "avatarUrl": item.fromUser.avatarUrl,
          "lastMsg": JSON.parse(item.lastMsg), 
          "data_time": formatDate(nowDate, "cn-date-no") - formatDate(item.lastMsgTime, "cn-date-no") > 0 ? formatDate(item.lastMsgTime, "cn-date") : formatDate(item.lastMsgTime, "cn-date-no-year")
      }))
    })
  },
  // 通知
  async handleComment () {
    this.setData({
      currentID: "4",
      personal: false,  // 私信
      comment: true,    // 通知
      aite: false,      // @我
      notice: false,    // 评论
    });
    const res = await request({ url: '/msg/notices' });
    let result = res.data;
    let nowDate = new Date();
    this.setData({
      // "commentInfo": []
      "commentInfo": result.notices.map( (item) => ({
        "id": item.id,
        "data_time": formatDate(nowDate, "cn-date-no") - formatDate(item.time, "cn-date-no") > 0 ? formatDate(item.time, "cn-date") : formatDate(item.time, "cn-date-no-year"),
        "commentContent": JSON.parse(item.notice)
      }))
    })
  },
  // 评论
  async handleDiscuss () {
    this.setData({
      currentID: "2",
      personal: false,  // 私信
      comment: false,    // 通知
      aite: false,      // @我
      notice: true,    // 评论
    });
    let uid = this.data.userInfo.userId;
    let res = await request({ url: '/msg/comments', data: { uid: uid } });
    let result = res.data;
    let nowDate = new Date();
    this.setData({
      "noticeInfo": result.comments.map( (item) => ({
        "shareContent": JSON.parse(item.resourceJson),
        "noticeUser": {
          "id": item.user.userId,
          "nickname": item.user.nickname,
          "avatarUrl": item.user.avatarUrl
        },
        "noticeContent": item.content,
        "myContent": item.beRepliedContent,
        "date_time": formatDate(nowDate, "cn-date-no") - formatDate(item.time, "cn-date-no") > 0 ? formatDate(item.time, "cn-date") : formatDate(item.time, "cn-date-no-year"),
      }))
    });
  },
  // @我
  async handleAite () {
    this.setData({
      currentID: "3",
      personal: false,  // 私信
      comment: false,    // 通知
      aite: true,      // @我
      notice: false,    // 评论
    });
    let res = await request({ url: '/msg/forwards?limit=100' });
    let result = res.data;
    let nowDate = new Date();
    let userInfo = wx.getStorageSync("userInfo");
    let aiteMe = userInfo.nickname;
    this.setData({
      "aiteInfo": result.forwards.map( (item) => ({
        "aiteContent": JSON.parse(item.json),
        "aiteMe": JSON.parse(item.json).comment.content.split(" "),
        "date_time": formatDate(nowDate, "cn-date-no") - formatDate(item.time, "cn-date-no") > 0 ? formatDate(item.time, "cn-date") : formatDate(item.time, "cn-date-no-year"),
      }))
    });
  },
  handlePersonalDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/personal-detail/personal-detail?id=' + id });
  },
  handlePlaySong:function (event) {
    let songId = event.currentTarget.dataset.songId;
    wx.navigateTo({ url: "/pages/playSong/playSong?id=" + songId});
  },
})