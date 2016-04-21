
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
