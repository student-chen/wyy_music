# 小程序名称: wyy_music
	网易云音乐小程序

# 接口地址: 
	1、文档地址: https://binaryify.github.io/NeteaseCloudMusicApi/#/;
	2、接口代码地址: https://github.com/Binaryify/NeteaseCloudMusicApi;

# 启动后端服务:
	## 本地后端服务启动
	通过git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git，接口代码成功后；
	cmd进入NeteaseCloudMusicApi文件夹中，首先输入npm install回车安装依赖；
	然后输入node app.js 回车启动服务；
	（值得一提的是，我这里是windows系统，同时你的3000端口已经占用，你可以通过git bash或者cmder设置未使		用过的端口开启服务，方法是：set PORT=4000 && node app.js）
	当界面显示：server running @ http://localhost:3000表示启动成功。
	
	## 域名服务启动
	具体方法可在(https://binaryify.github.io/NeteaseCloudMusicApi/#/)查看。

# 文件介绍:
	1、components 	// 整个开发过程做组件;
	2、images 	  	// 图片;
	3、lib		  	// 开发过程中的第三方组件runtime;
	4、pages 	  	// 小程序的所有页面
		{
			index  				// 首页;
			find   				// 发现;
			video  				// 视频;
			mime   				// 我的;
			login  				// 登录;
			register 			// 注册;
			myMessage 			// 我的消息;
			myNotice			// 我的关注;
			personal-detail		// 个人信息;
			personalNotice		// 个人关注与粉丝;
			playList			// 歌单列表;
			playList-detail 	// 歌单详情;
			playList-detail 	// 歌词详情;
		}
	5、request	  	// 小程序封装的js请求方法
	6、styles	  	// 小程序样式表
	7、utils	  	// 小程序封装的方法
		{
			time.js  	// 时间类方法
			toast.js	// 提示框类方法
			utils.js	// 图片处理类方法
		}
	8、app.js	  	// 小程序的全局方法
	9、app.json	  	// 小程序的配置
	10、app.wxss  	// 小程序的全局样式
	11、README.md	// 小程序的文档
	12、project.config.json		// 小程序项目配置文件
	13、sitemap.json			// 小程序的描述文档