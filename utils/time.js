export const getDate = function (time) {

    if (!time) {
        time = Date.now();
    }

    if (typeof time === "number") {
        time = new Date(time);
    } else {
        time = new Date(time.getTime());
    }

    time.setHours(0);
    time.setMinutes(0);
    time.setSeconds(0);
    time.setMilliseconds(0);

    return time;

};

export const formatDate = function (time, format) {

    if (typeof time === "number") {
        time = new Date(time);
    }

    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();

    let hours = ("0" + time.getHours()).slice(-2);
    let minutes = ("0" + time.getMinutes()).slice(-2);
    let seconds = ("0" + time.getSeconds()).slice(-2);

    switch (format) {
        case "cn-date": { return `${year}年${month}月${date}日`; };
        case "cn-date-no-month" : { return `${year}年`;};
        case "cn-date-no" : { return `${year}`;};
        case "cn-date-no-year": { return `${month}月${date}日`; };
        case "cn-time": { return `${hours}:${minutes}:${seconds}`; };
        case "cn-no-seconds": { return `${year}年${month}月${date}日 ${hours}:${minutes}`; };
        case "cn": { return `${year}年${month}月${date}日 ${hours}:${minutes}:${seconds}`; };
        case "en-date": { return `${year}-${month}-${date}`; };
        case "en-date-no-year": { return `${month}-${date}`; };
        case "en-no-year": { return `${hours}:${minutes}`};
        case "en-time": { return `${hours}:${minutes}:${seconds}`; };
        case "en-no-seconds": { return `${year}-${month}-${date} ${hours}:${minutes}`; };
        case "en": { return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`; };
        case "en-year": { return `${year}`; };
        case "en": { return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`; };
        case "en-year-month-date": { return `${year}.${month}.${date}`; };
        default: { throw new Error(`Unknown time format[${format}]`); };
    }

};

export const parseDate = function (date) {

    let result = new Date(date);
    if (isFinite(result.getTime())) {
        return result;
    }

    let parts = date.trim().split(/[^0-9]/).map((string) => {
        return parseInt(string);
    }).filter((number) => isFinite(number));

    switch (parts.length) {
        case 1: { return new Date(parts[0]); };
        case 3: { return new Date(parts[0], parts[1] - 1, parts[2]); };
        case 6: { return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]); };
        default: {
            throw new Error(`Invalid date[${date}]`);
        };
    }

};

