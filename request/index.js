let ajaxTimes = 0;
let cookie;
export const request = (params) => {
    ajaxTimes++;
    // 防止数据过大加载时间过长，用户点击速度过快的卡顿
    wx.showLoading({
        title: '数据加载中',
        mask: true
    });

    const baseURL = "http://localhost:3000";
    const cookies = wx.getStorageSync("cookie");
    if (!cookies) {
        cookie = "";
    } else {
        cookie = cookies['Set-Cookie'];
    }
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseURL + params.url,
            header: { 
                "Content-Type": "application/json",
                "Cookie": cookie
            },
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                }
            }
        });
    })
}

export const requestNoShowLoading = (params) => {

    const baseURL = "http://localhost:3000";
    const cookies = wx.getStorageSync("cookie");
    if (!cookies) {
        cookie = "";
    } else {
        cookie = cookies['Set-Cookie'];
    }
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            url: baseURL + params.url,
            header: { 
                "Content-Type": "application/json",
                "Cookie": cookie
            },
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    setTimeout(function () {
                        wx.hideLoading();
                    }, 1000);
                }
            }
        });
    })
}