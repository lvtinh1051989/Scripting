let isQuantumultX = $task != undefined; 
let isSurge = $httpClient != undefined;

var $done = (obj={}) => {
    var isRequest = typeof $request != "undefined";
    if (isQuantumultX) {
        return isRequest ? $done({}) : ""
    }
    if (isSurge) {
        return isRequest ? $done({}) : $done()
    }
}

var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};

var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};

var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion

// #region 
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 


if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion


Date.prototype.format = function(fmt) {
    var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
    if (/(y+)/i.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return fmt;
};


function dateDiff(startDate, endDate) {
    //2002-12-18格式  
    var sdate, edate, days
    sdate = new Date(startDate)
    edate = new Date(endDate)
    //把相差的毫秒数转换为天数
    days = parseInt((sdate - edate) / 1000 / 60 / 60 / 24)
    return days;
}

const dayarr = [ 
    [ "Happy Wedding", "2018-01-18" ],
    [ "Năm nay", "2020-12-31" ],
    [ "Lễ tình nhân", "2020-02-14" ], 
    [ "Sinh nhật Hồ", "2020-02-16" ],
    [ "Sinh nhật Tính", "2020-05-10" ],
    [ "Sinh nhật Tâm", "2020-05-19" ],
    [ "Sinh nhật Bảo An", "2020-10-10" ],
]

day();

function valcal(days) {
    if (days == 0)
        return " Hôm nay"
    else if (days > 0)
        return "Còn lại : " + days + " Ngày"
    else
        return "Đã qua : " + Math.abs(days) + " Ngày"
}

function day() {
    var now = new Date()
    var nowStr = now.format("yyyy-MM-dd")
    var content = "";
    for ( var i in dayarr) {
        var d = dateDiff(dayarr[i][1], nowStr)
        if(isNaN(d))
            continue
        var u = valcal(d)
        content += dayarr[i][0] + "🔈" + u + "\n"
    }
    console.log(content);
    $notification.post('Days Countdown', "", content)    
}


$done()