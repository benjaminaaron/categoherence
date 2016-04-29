
var Node = function(parent) {
    this.parent = null;
    this.children = [];
};

Node.prototype = {
    addChild: function(child) {
        this.children.push(child);
    }
};

module.exports = Node;
