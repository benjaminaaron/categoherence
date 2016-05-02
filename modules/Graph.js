var Node = require('./Node.js');

var Graph = function() {
    this.ROOT = new Node(null, 'ROOT');
};

Graph.prototype = {
    show: function() {
        this.ROOT.show();
    }
};

module.exports = Graph;
