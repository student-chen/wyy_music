Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoimage: "block" ,//默认显示封面
    bindplay: null,
    _index:0,
  },
  //点击播放按钮，封面图片隐藏,播放视频
  bindplay: function (e) {
    var index = e.currentTarget.dataset.id;
    var that = this;
    this.setData({
      index: index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext("myVideo" + that.data._index)
    videoContextPrev.seek(0)
    videoContextPrev.pause()

    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext('myVideo' + index)
      videoContext.play();
      that.data._index = index;
    }, 100)
  },
})