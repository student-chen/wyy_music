export const correctImage = function (url, width, height) {

	// if (url.indexOf("http://jjtravel.qiniudn.com/") === 0) {
	// 	url = url.replace("http://jjtravel.qiniudn.com/", "http://qiniu.jjtravel.com/");
	// }

    if (url.indexOf("http:") === 0) {
        url = url.replace("http:", "https:");
    }


	if (/\/w\/([0-9]+)\/h\/([0-9]+)$/.test(url)) {
		url = url.split("w").slice(0, -1).join("w");
		if (!width) {
			width = 400;
		}
		if (!height) {
			 height = Math.round(width * 0.75);
		}
		url += `w/${width}/h/${height}`;
	}

	return url;

};