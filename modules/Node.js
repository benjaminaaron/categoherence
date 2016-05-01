
var Node = function(parent) {
    this.parent = parent;
    this.children = [];
};

Node.prototype = {
    addChild: function(child) {
        this.children.push(child);
    }
};

module.exports = Node;
