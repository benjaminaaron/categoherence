
var Graph = function() {
    this.nodes = [];
    this.ROOT = new Node(null);
    this.nodes.push(this.ROOT);
};

Graph.prototype = {
    init: function() {
    }
};

module.exports = Graph;
