
var Session = function(data) {
    this.data = data; // TODO better "info" or "meta"... ?
    this.submissions = [];
    //this.result
    
    this.showData();
};

Session.prototype = {
    showData: function() {
        console.log('---------- start: ' + this.data.id);
        console.log(this.data);
        console.log('---------- end: ' + this.data.id);
    }
};

module.exports = Session;
