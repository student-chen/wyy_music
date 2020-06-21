import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime.js"
import { showToastMedal , showToastMedalSuccess} from "../../utils/toast.js"

Page({
	data: {
		"banner": []
	},
	onLoad: function () {
		this.handleBanner();
	},
	handleBanner: function () {
		request({ url: '/dj/banner' }).then((res) => {
			showToastMedal("获取Banner成功");
			this.setData({
				"banner": res.data.data.map(( item) => ({
                    "id": item.targetId,
                    "image": item.pic,
                    "navigation": item.url,
                    "type": item.typeTitle
                }))
			})
		}).catch((err) =>{
			showToastMedal("获取Banner失败");
		})
	},
	handlePlayList: function () {
		wx.navigateTo({ url: '/pages/playList/playList' });
	},
	smartOpen: function (event) {
		let navigation = event.currentTarget.dataset.navigation;
		console.log(navigation);

	}
})
