var Node = require('./Node.js');

var Graph = function() {
    this.ROOT = new Node('ROOT', null);
};

Graph.prototype = {
    toString: function() {
        return this.ROOT.toString();
    },
    clone: function() {
        var cloneGraph = new Graph();
        this.ROOT.clone(cloneGraph.ROOT);
        return cloneGraph;
    },
    handle: function(group) {
        var sizeNode = this.ROOT.children[group.size];
        if(!sizeNode)
            sizeNode = this.ROOT.children[group.size] = new Node('SIZE', group.size);
        if(!sizeNode.children[group.groupId])
            sizeNode.children[group.groupId] = new Node('LEAF', group.groupId);
    },
    insertScoreLevel: function(getScoreCallback) {
        var keys = Object.keys(this.ROOT.children);
        for(var i = 0; i < keys.length; i ++)
            this.ROOT.children[keys[i]].insertScoreLevel(getScoreCallback);
    },
    swapLevels1and2: function() {
        var newLevel1 = {};
        var level1keys = Object.keys(this.ROOT.children);
        for(var i = 0; i < level1keys.length; i ++) {
            var level1node = this.ROOT.children[level1keys[i]];
            var level2keys = Object.keys(level1node.children);
            for(var j = 0; j < level2keys.length; j ++) {
                var level2node = level1node.children[level2keys[j]];
                var newLevel1node = newLevel1[level2node.value];
                if(!newLevel1node)
                    newLevel1node = newLevel1[level2node.value] = new Node(level2node.type, level2node.value);
                var newLevel2node = newLevel1node.children[level1node.value] = new Node(level1node.type, level1node.value);
                newLevel2node.children = level2node.children;
            }
        }
        this.ROOT.children = newLevel1;
    }
};

module.exports = Graph;
