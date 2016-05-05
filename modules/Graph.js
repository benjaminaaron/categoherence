var Node = require('./Node.js');

var Graph = function() {
    this.ROOT = new Node('ROOT', null);
};

Graph.prototype = {
    toString: function() {
        return this.ROOT.toString();
    },
    handle: function(group) {
        var sizeNode = this.ROOT.children[group.size];
        if(!sizeNode)
            sizeNode = this.ROOT.children[group.size] = new Node('SIZE', group.size);
        if(!sizeNode.children[group.groupId])
            sizeNode.children[group.groupId] = new Node('LEAF', group.groupId);
    },
    insertScoreLevel: function() {
        var keys = Object.keys(this.ROOT.children);
        for(var i = 0; i < keys.length; i ++)
            this.ROOT.children[keys[i]].insertScoreLevel();
    }
};

module.exports = Graph;
