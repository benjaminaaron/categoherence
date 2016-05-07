var Node = require('./Node.js');

var Graph = function() {
    this.ROOT = new Node('ROOT', '');
};

Graph.prototype = {
    toString: function() {
        return this.ROOT.toString(0);
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
    _loopThroughLevel1and2: function(innerCallback, eoInnerCallback, eoOuterCallback) {
        var newLevel1 = {};
        var level1keys = Object.keys(this.ROOT.children);
        for(var i = 0; i < level1keys.length; i ++) {
            var level1node = this.ROOT.children[level1keys[i]];
            var level2keys = Object.keys(level1node.children);
            var newLevel2 = {};
            for(var j = 0; j < level2keys.length; j ++) {
                var level2node = level1node.children[level2keys[j]];
                innerCallback(level1node, level2node, newLevel1, newLevel2);
            }
            eoInnerCallback(level1node, newLevel2);
        }
        eoOuterCallback(newLevel1);
    },
    insertNewLevel2: function(getValueCallback, type) {
        var innerCallback = function(level1node, level2node, newLevel1, newLevel2) {
            var value = getValueCallback(level2node.value);
            var node = newLevel2[value];
            if(!node)
                node = newLevel2[value] = new Node(type, value);
            node.children[level2node.value] = level2node;
        }; 
        var eoInnerCallback = function(level1node, newLevel2) {
            level1node.children = newLevel2;
        };
        this._loopThroughLevel1and2(innerCallback, eoInnerCallback, function(){});
    },
    swapLevels1and2: function() {
        var innerCallback = function(level1node, level2node, newLevel1, newLevel2) {
            var newLevel1node = newLevel1[level2node.value];
            if(!newLevel1node)
                newLevel1node = newLevel1[level2node.value] = new Node(level2node.type, level2node.value);
            var newLevel2node = newLevel1node.children[level1node.value] = new Node(level1node.type, level1node.value);
            newLevel2node.children = level2node.children;
        }; 
        var eoOuterCallback = function(newLevel1) {
            this.ROOT.children = newLevel1;
        }.bind(this);
        this._loopThroughLevel1and2(innerCallback, function(){}, eoOuterCallback);
    },
    initGroupingsGraph: function(groupingPatterns, set) {
        for(var i = 0; i < groupingPatterns.length; i ++) {
            var groupingNode = this.ROOT.children[groupingPatterns[i]] = new Node('GROUPING', groupingPatterns[i]);
            groupingNode.createGroupingSubgraph(set);
        }
    }
};

module.exports = Graph;
