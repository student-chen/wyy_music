import {request , requestNoShowLoading} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal , showToastMedalSuccess} from "../../utils/toast.js"
import { correctImage } from '../../utils/utils.js'
import { formatDate } from "../../utils/time.js"
var cancel;
Page({
  data: {
    personalInfo:{},
    genderType: {
      "0": "保密",
      "1": "男",
      "2": "女"
    },
    currentID: "1",
    curretnType: "dongtai",
    limit: 50,
  },

  onLoad: function (options) {
    let userId = options.id;
    let userInfo = wx.getStorageSync("userInfo");
    if (userId == userInfo.userId) {
      this.setData({ sameId: true});
    } else {
      this.setData({ sameId: false});
    }
    this.setData({ userId: userId});
    this.handlePersonalDetailInfo(true);
    this.handleDynamic(true);
  },
  // onShow:function () {
  //   this.getSingerId(true);
  //   this.handleSingerSongs(true);
  // },
  // onHide: function () {
  //   let that = this;
  //   clearInterval(that.cancel);
  // },
  // onUnload: function () {
  //   let that = this;
  //   clearInterval(that.cancel);
  // },
  getSingerId () {
    request({ url: '/user/detail', data: { uid: this.data.userId } }).then( (res) => {
      let result = res.data;
      this.setData({
         "artistId": result.profile.artistId ? result.profile.artistId : null,
      });
    }).catch( (err) => {
      console.log(err);
    });
  },
  async handlePersonalDetailInfo() {
    const res = await request({ url: '/user/detail', data: { uid: this.data.userId } });
    let result = res.data;
    let tag = [];
    let desc;
    if(result.profile.mainAuthType) {

      if ( result.profile.mainAuthType.desc !== [] && result.profile.mainAuthType.desc !== "" && result.profile.mainAuthType.desc !== null) {
        desc = result.profile.mainAuthType.desc;
      }

      if(result.profile.mainAuthType.tags !== [] && result.profile.mainAuthType.tags !== "" &&  result.profile.mainAuthType.tags !== null){
        for(let i = 0; i < result.profile.mainAuthType.tags.length; i++){
          tag.push(result.profile.mainAuthType.tags[i]);
        } 
      } else {
        tag = [];
      }
      this.setData({ tags:  [desc, ...tag]});
    }

    this.setData({
      "personalInfo": {
        // 用户ID
        "userId": this.data.userId,
        // 歌手ID 
        "artistId": result.profile.artistId ? result.profile.artistId : null,
        // 背景
        "background_imageUrl": result.profile.backgroundUrl,
        // 用户艺术名或昵称
        "nickname": result.profile.artistName ? result.profile.artistName : result.profile.nickname,
        // 用户头像
        "avatarUrl": result.profile.avatarUrl,
        // 该用户你是否关注
        "followed": result.profile.followed,
        // 该用户是否关注你
        "followMe": result.profile.followMe,
        // 关注数
        "notice_number": result.profile.follows,
        // 粉丝数
        "fans_number": result.profile.followeds > 10000 ? (result.profile.followeds / 10000).toFixed(1) + '万' : result.profile.followeds,
        // 你已关注的时间
        "follow_time": result.profile.followTime != null ? result.profile.followTime : "暂未关注",
        // 用户等级
        "level": result.level,
        // 用户出生面年月日
        "birthday": formatDate(result.profile.birthday, "en-year").substring(2),
        // 用户性别
        "gender": this.data.genderType[result.profile.gender],
      }
    });
  },
  async handlePersonalDetailInfoNoShowLoading() {
    const res = await request({ url: '/user/detail', data: { uid: this.data.userId } });
    let result = res.data;
    let tag = [];
    let desc;
    if(result.profile.mainAuthType) {

      if ( result.profile.mainAuthType.desc !== [] && result.profile.mainAuthType.desc !== "" && result.profile.mainAuthType.desc !== null) {
        desc = result.profile.mainAuthType.desc;
      }

      if(result.profile.mainAuthType.tags !== [] && result.profile.mainAuthType.tags !== "" &&  result.profile.mainAuthType.tags !== null){
        for(let i = 0; i < result.profile.mainAuthType.tags.length; i++){
          tag.push(result.profile.mainAuthType.tags[i]);
        } 
      } else {
        tag = [];
      }
      this.setData({ tags:  [desc, ...tag]});
    }
    
    this.setData({
      "personalInfo": {
        // 用户ID
        "userId": this.data.userId,
        // 歌手ID 
        "artistId": result.profile.artistId ? result.profile.artistId : null,
        // 背景
        "background_imageUrl": result.profile.backgroundUrl,
        // 用户艺术名或昵称
        "nickname": result.profile.artistName ? result.profile.artistName : result.profile.nickname,
        // 用户头像
        "avatarUrl": result.profile.avatarUrl,
        // 该用户你是否关注
        "followed": result.profile.followed,
        // 该用户是否关注你
        "followMe": result.profile.followMe,
        // 关注数
        "notice_number": result.profile.follows,
        // 粉丝数
        "fans_number": result.profile.followeds > 10000 ? (result.profile.followeds / 10000).toFixed(1) + '万' : result.profile.followeds,
        // 你已关注的时间
        "follow_time": result.profile.followTime  !== null ? result.profile.followTime : ""
      }
    });
  },
  handleNotice: function (event) {
    let follow = event.currentTarget.dataset.follow;
    if (follow == true) {
      this.handleUnnoticed();
    } else {
      this.handleNoticed();
    }
  },
  handleNoticed: function () {
    let uid = this.data.userId;
    request({ url: '/follow', data: { id: uid, t: 1} }).then( (res) => {
      this.handlePersonalDetailInfo(true);
      let that = this;
      that.cancel = setInterval(this.handlePersonalDetailInfoNoShowLoading, 10000);
      showToastMedalSuccess("已成功关注");
    }).catch( (err) => {
      showToastMedal("关注失败");
      console.log(err);
    });
  },
  handleUnnoticed: function () {
    let uid = this.data.userId;
    request({ url: '/follow', data: { id: uid, t: 0} }).then( (res) => {
      let result = res.data;
      if (result.code == 200) {
        this.handlePersonalDetailInfo(true);
        let that = this;
        that.cancel = setInterval(this.handlePersonalDetailInfoNoShowLoading, 10000);
        showToastMedalSuccess("已成功取消关注");
      }
    }).catch( (err) => {
      showToastMedal("取消关注失败");
      console.log(err);
    });
  },
  // 查看TA的关注
  handlePersonalNoticed: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/personalNotice/personalNotice?id=" + id + "&curretnStatus=1"});
  },
  // 查看TA的粉丝
  handlePersonalFans: function (event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/personalNotice/personalNotice?id=" + id + "&curretnStatus=2"});
  },
  async handleSingerSongs () {
    this.setData({ currentID: "1", curretnType: "singer" });
    const res = await request({ url: '/user/detail', data: { uid: this.data.userId } });
    let result = res.data;
    let artistId = result.profile.artistId;
    request({ url: "/artists", data: { id: artistId } }).then( (res) => {
      console.log(res.data);
      let result = res.data;
      this.setData({
        "singerSongs": {
          // 歌手ID
          "singerId": result.artist.id,
          // 歌曲信息
          "songs": result.hotSongs.map( (item, index) => ({
            // 序号
            "songId": index + 1,
            // 歌曲名
            "songName": item.name,
            // 作者
            "songCreator": item.ar.map( (a) => ({
              "name": a.name,
            })),
            // 歌曲出处
            "songProvenance": item.al.name,
            // 有原唱 
            "originalSinger": item.alia[0],
          }))
        }
      });
    }).catch( (err) => {
      console.log(err);
    });
  },
  // 用户动态
  async handleDynamic () {
    this.setData({ currentID: "3",  curretnType: "dynamic"});
    const res = await request({ url: "/user/event", data: { uid: this.data.userId, limit: 100 } });
    let result = res.data;
    console.log(result);
    this.setData({
      "dynamicInfo": result.events.map( (item) => ({
        // 动态ID
        "dynamicId": item.id,
        // 歌手头像
        "avatarUrl": item.user.avatarUrl,
        // 歌手昵称
        "nickname": item.user.nickname,
        // 会员等级
        "vipType": item.user.vipRights != "" ? item.user.vipRights : "",
        // 动态内容
        "dynamicContent": JSON.parse(item.json),
        // 含有网址
        "dynamicContent_link": JSON.parse(item.json).msg.split(">>"),
        // 含有@的人
        "dynamicContent_personal": JSON.parse(item.json).msg.split(">>")[0].split("@"),
        // 发布时间
        "date_time": formatDate(item.showTime, "cn-date"),
        // 歌手云圈
        "tailMark": item.tailMark ? item.tailMark.markTitle : "",
        // 转发数
        "insiteForwardCount": item.insiteForwardCount,
        // 评论数
        "commentCount": item.info.commentCount,
        // 点赞数
        "likedCount": item.info.likedCount,
        // 判断是发布视频还是分享专辑
        "resourceTitle": item.info.commentThread.resourceTitle ? item.info.commentThread.resourceTitle.split("：") : "",
        // 动态内容中的图片
        "dynamicPics": item.pics.map( (photo, index) => ({
          // 图片序号
          "id": index,
          // 原始图片宽度
          "imageWidth": photo.width,
          // 原始图片高度
          "imageHeight": photo.height,
          // 图片路径
          "imageUrl": photo.originUrl
        }))
       }))
    });
    for(let i = 0; i < this.data.dynamicInfo.length; i++){
      if(this.data.dynamicInfo[i].dynamicContent.video) {
        let id = this.data.dynamicInfo[i].dynamicContent.video.videoId;
        request({ url: "/video/url", data:{ id: id } }).then( (res) => {
          let result = res.data;
          this.setData({ videoUrl: result.urls[0].url });
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  },
  // 点击图片全屏查看
  handlePreviewImage: function (event) {
    let allImageList = [];
    let currentUrl;
    let src_1 = event.currentTarget.dataset.src_1;
    let src_2 = event.currentTarget.dataset.src_2;
    if ( src_2 === undefined) {
      currentUrl = src_1;
    } else {
      currentUrl = src_2;
    }
    let imageList = event.currentTarget.dataset.list;
    let url = event.currentTarget.dataset.url;
    if(!imageList) {
      this.setData({ allImageList: [url] });
    } else {
      this.setData({ 
        allImageList: imageList.map(function (photo) {
          return photo.imageUrl;
        })
      });
    }
    wx.previewImage({
      current: currentUrl, 
      urls: this.data.allImageList,
    });
  },
  // 获取歌手专辑
  handleAlbum: function (){
    this.setData({ currentID: "2",  curretnType: "album"});
    let id = this.data.personalInfo.artistId;
    request({url: "/artist/album", data: {id: id, limit: this.data.limit} }).then( (res) => {
      let result = res.data;
      console.log(result);
      this.setData({
        "albumInfo": {
          "albumTotal": result.artist.albumSize, // 专辑总数
          "albumDetail": result.hotAlbums.map( (item) => ({
            "albumId": item.id, // 专辑id
            "albumImage": item.blurPicUrl, // 专辑封面
            "albumName": item.name, // 专辑名
            "albumSize": item.size, // 专辑含有的歌曲数量
            "albumDateTime": formatDate(item.publishTime, "en-year-month-date"), // 专辑发布的时间
            "albumType": item.subType, // 专辑类型
            "albumAlias": item.alias != "" || item.alias != null ? item.alias[0] : "", // 专辑出处
          }))
        }
      });
    }).catch( (err) => {
      console.log(err);
    });
  },
})