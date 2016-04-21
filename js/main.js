
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
}
