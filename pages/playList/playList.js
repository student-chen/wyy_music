import {request, requestNoShowLoading} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal , showToastMedalSuccess} from "../../utils/toast.js"

Page({

  data: {
    currentID: "1",
    playList: {},
    limit: "99",
    category: false,
    allList: [],
    currentName: "全部歌单",
    tag: {
      "0": "华语",
      "1": "轻音乐",
      "2": "民谣"
    }
  },

  onLoad: function (options) {
    this.handlePlayList(true);
  },
  // 获取推荐歌单
  handlePlayList: function () {
    request({ url: '/related/playlist', data: { id: 1 } }).then( (res) => {
      showToastMedalSuccess("获取歌单成功");
      let result = res.data;
      this.setData({
        "currentID": "1",
        "playList": result.playlists.map( (item) => ({
          "id": item.id,
          "title": item.name,
          "image_url": item.coverImgUrl,
          "creator": {
            "userId": item.creator.userId,
            "nickname": item.creator.nickname
          }
        }))
      })
    }).catch( (err) => { 
      showToastMedal("获取歌单失败");
      console.log(err);
    });
  },
  // 获取歌单详情
  handlePlayListDetail: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/playList-detail/playList-detail?id='+ id });
  },
  // 获取歌单种类
  async handleCategoryList () {
    this.setData({ category: true });
    let res = await requestNoShowLoading({ url: '/playlist/catlist' });
    let result = res.data;
    let allList = result.all.name;
    this.setData({ 
      "allList": {
        "id": "0",
        "name": "全部歌单"
      },
      "categoryList": result.sub.map( (item, index) => ({
        "id": index+1,
        "name": item.name
      }))
    });
  },
  // 点击切换歌单种类
  handleCategoryListDetail: function (event) {
    let name = event.currentTarget.dataset.name;
    this.setData({ 
      "currentName": name
    });
  },
  // 根据种类获取歌单
  handleConfirmCategoryDetail: function () {
    this.setData({ category: false });
    let title = this.data.currentName;
    console.log(title);
    request({ url: '/top/playlist/highquality', data: { limit: this.data.limit, cat: title} }).then( (res) => {
      if(res.data.playlists !== "") {
        showToastMedalSuccess("获取歌单成功");
        let result = res.data;
        this.setData({
          "playList": result.playlists.map( (item) => ({
              "id": item.id,
              "title": item.name,
              "image_url": item.coverImgUrl,
              "creator": {
                "userId": item.creator.userId,
                "nickname": item.creator.nickname,
                "signature": item.creator.signature
              }
          }))
        });
      } else {
        this.setData({ "playList": [] });
      }
    }).catch( (err) => {
      showToastMedal("获取歌单失败");
      console.log(err);
    });
  },
  // 获取精品歌单
  handleHighQuality: function () {
    this.setData({ currentID: "2", currentName: "全部歌单", playList: {} });
    request({ url: '/top/playlist/highquality', data: { limit: this.data.limit } }).then( (res) => {
      showToastMedalSuccess("获取歌单成功");
      console.log(res.data);
      let result = res.data;
      this.setData({
        "playList": result.playlists.map( (item) => ({
            "id": item.id,
            "title": item.name,
            "image_url": item.coverImgUrl,
            "play_count": (item.playCount / 10000).toFixed(1),
            "creator": {
              "userId": item.creator.userId,
              "nickname": item.creator.nickname,
              "signature": item.creator.signature
            }
        }))
      })
    }).catch( (err) => {
      showToastMedal("获取歌单失败");
      console.log(err);
    });
  },
  // 获取华语 、 轻音乐 、 民谣 
  handleCategoryPlayList: function (event) {
    this.setData({ playList: {} });
    let index = event.currentTarget.dataset.index;
    let title = this.data.tag[index];

    if (title === "华语") {
      this.setData({ currentID: "3" });
    } else if (title === "轻音乐") {
      this.setData({ currentID: "4" });
    } else if (title === "民谣") {
      this.setData({ currentID: "5" });
    }
    
    request({ url: '/top/playlist/highquality', data: { limit: this.data.limit } }).then( (res) => {
      showToastMedalSuccess("获取歌单成功");
      console.log(res.data);
      let result = res.data;
      this.setData({
        "playList": result.playlists.map( (item) => ({
            "id": item.id,
            "title": item.name,
            "image_url": item.coverImgUrl,
            "creator": {
              "userId": item.creator.userId,
              "nickname": item.creator.nickname,
              "signature": item.creator.signature
            }
        }))
      })
    }).catch( (err) => {
      showToastMedal("获取歌单失败");
      console.log(err);
    });
  }
})