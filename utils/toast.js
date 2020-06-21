// export const showToastMedal = () => {
//     return new Promise( ({title}) => {
//         wx.showToast({
//             title: title,
//             icon: 'none',
//             duration: 1000,
//             mask: true
//         });
//     })
// }

export const showToastMedal = function (title) {
    wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000,
        mask: true
    });
}

export const showToastMedalSuccess = function (title) {
    wx.showToast({
        title: title,
        icon: 'success',
        duration: 2000,
        mask: true
    });
}