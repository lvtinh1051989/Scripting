
//Smart Qx&Surge + @Neurogam
let isQuantumultX = $task !== undefined;
let isSurge = $httpClient !== undefined;
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
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
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        response.body = data;
                        resolve(response, {
                            error: error
                        });
                    })
                }
            })

        }
    }
}
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
//end

/*
[Script]
cron "0 6 * * *" script-path=Shopee_checkin.js

http-request ^https:\/\/shopee\.vn\/me\/setting max-size=0,script-path=shopee_getcookie.js

MITM = shopee.vn
*/
  var shopeeUrl = {
    url: 'https://shopee.vn/mkt/coins/api/v2/checkin',
    headers: {
      Cookie: $persistentStore.read("CookieSP"),
    }
  }
$httpClient.post(shopeeUrl, function(error, response, data){
  if (error) {
$notification.post("Shopee checkin", "", "Lỗi kết nối‼️")
    $done(); 
  } 
 else{
 if(response.status == 200)
{
let obj= JSON.parse(data);
if(obj["data"]["success"])
{
var user = obj["data"]["username"];
var coins = obj["data"]["increase_coins"];
$notification.post("Shopee " + user, "", "Đã nhận được " + coins + "💰");
    $done();
}
}
else{
$notification.post("Shopee Cookie đã hết hạn‼️", "", "Hãy đăng nhập lại 🔓");
}
}
});
