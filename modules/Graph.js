var Node = require('./Node.js');

var Graph = function() {
    this.ROOT = new Node(null, 'ROOT', null);
};

Graph.prototype = {
    toString: function() {
        return this.ROOT.toString();
    }
};

module.exports = Graph;
