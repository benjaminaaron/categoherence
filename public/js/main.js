
function setupNotie(notie, socket) {    
    socket.on('success', function(msg) {
        notie.alert(1, msg);
    });
    socket.on('info', function(msg) {
        notie.alert(4, msg, 3);
    });
    socket.on('err', function(msg) {
        notie.alert(3, msg, 3);
    });
};

function getSessionIdFromURL() {
    var arr = window.location.href.split('/');
    if(arr[arr.length - 1].length == 0) // to accommodate case of "/" at end of URL
        arr.pop();
    if(arr[arr.length - 1] == 'results')
        arr.pop();
    return arr.pop();
};

function getFormattedTimestamp(unixTimestamp) {
    var d = new Date(unixTimestamp * 1000);
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
};

function generateHexString(length) { // from http://stackoverflow.com/a/5399414
    var str = '';
    while(str.length < length)
        str += Math.random().toString(16).substring(2);
    return str.substring(0, length);
};

function getURLparams(url) {
    var params = {};
    if(url.length > 0) {
        var arr = url.substring(1).split('&');
        for(var i = 0; i < arr.length; i ++)
            if(arr[i].split('=').length > 1)
                params[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
    return params;
};
