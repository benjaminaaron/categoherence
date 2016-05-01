
var Graph = function(groups, splitting, scoreRule) {
    this.nodes = [];
    this.ROOT = new Node(null);
    this.nodes.push(this.ROOT);
};

Graph.prototype = {
    init: function() {
    }
};

module.exports = Graph;
