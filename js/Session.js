
var Session = function(data) {
    this.data = data;
    this.showSet();
}

Session.prototype = {
    showSet: function() {
        console.log('---------- start: ' + this.data.id);
        console.log(this.data);
        console.log('---------- end: ' + this.data.id);
    }
}

module.exports = Session;
