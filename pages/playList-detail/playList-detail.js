import {request,requestNoShowLoading} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal , showToastMedalSuccess} from "../../utils/toast.js"

Page({

  data: {
      playlist_id: '',
      playlist_detail: [],
      currentStyle: true,
  },

  onLoad: function (options) {
    let id = options.id;
    this.setData({ "playlist_id": id });
    this.handlePlayListDetail(true);
  },
  async handlePlayListDetail () {
    let res = await requestNoShowLoading({ url: '/playlist/detail', data: { id: this.data.playlist_id}  });
    console.log(res.data);
    let result = res.data;
    this.setData({
      "playlist_detail": {
        "id": result.playlist.id,                             // 歌单id
        "title": result.playlist.name,                        // 歌单标题
        "background_image": result.playlist.coverImgUrl,      // 歌单背景图
        "playCount": result.playlist.playCount > 10000 ? (result.playlist.playCount / 10000).toFixed(1)+'万' : result.playlist.playCount,               // 播放量
        "userInfo": {
          "user_id": result.playlist.creator.userId,          // 创作者id
          "avatarUrl": result.playlist.creator.avatarUrl,     // 创作者头像
          "user_name": result.playlist.creator.nickname       // 创作者昵称
        },
        "tags": result.playlist.tags.map( (item, index) => ({ //标签
          "id": index,
          "name": item
        })),
        "description": result.playlist.description,           // 歌单简介
      }
    })
  },
  handleDescriptionDetail: function () {
    this.setData({ currentStyle: false });
  },
  handleClose: function () {
    this.setData({ currentStyle: true });
  },
  handlePreserve: function () {
    console.log("保存成功");
  },
  onShareAppMessage: function () {

  }
})