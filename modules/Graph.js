const Node = require('./Node.js');

let Graph = function() {
    this.ROOT = new Node('ROOT', '');
};

Graph.prototype = {
    toString: function() {
        return this.ROOT.toString(0);
    },
    clone: function() {
        let cloneGraph = new Graph();
        this.ROOT.clone(cloneGraph.ROOT);
        return cloneGraph;
    },
    handle: function(group) {
        let sizeNode = this.ROOT.children[group.size];
        if (!sizeNode)
            sizeNode = this.ROOT.children[group.size] = new Node('SIZE', group.size);
        if (!sizeNode.children[group.groupId])
            sizeNode.children[group.groupId] = new Node('LEAF', group.groupId);
    },
    _loopThroughLevel1and2: function(innerCallback, eoInnerCallback, eoOuterCallback) {
        let newLevel1 = {};
        let level1keys = Object.keys(this.ROOT.children);
        for (let i = 0; i < level1keys.length; i ++) {
            let level1node = this.ROOT.children[level1keys[i]];
            let level2keys = Object.keys(level1node.children);
            let newLevel2 = {};
            for (let j = 0; j < level2keys.length; j ++) {
                let level2node = level1node.children[level2keys[j]];
                innerCallback(level1node, level2node, newLevel1, newLevel2);
            }
            eoInnerCallback(level1node, newLevel2);
        }
        eoOuterCallback(newLevel1);
    },
    insertNewLevel2: function(getValueCallback, type) {
        let innerCallback = function(level1node, level2node, newLevel1, newLevel2) {
            let value = getValueCallback(level2node.value);
            let node = newLevel2[value];
            if (!node)
                node = newLevel2[value] = new Node(type, value);
            node.children[level2node.value] = level2node;
        }; 
        let eoInnerCallback = function(level1node, newLevel2) {
            level1node.children = newLevel2;
        };
        this._loopThroughLevel1and2(innerCallback, eoInnerCallback, function(){});
    },
    swapLevels1and2: function() {
        let innerCallback = function(level1node, level2node, newLevel1, newLevel2) {
            let newLevel1node = newLevel1[level2node.value];
            if (!newLevel1node)
                newLevel1node = newLevel1[level2node.value] = new Node(level2node.type, level2node.value);
            let newLevel2node = newLevel1node.children[level1node.value] = new Node(level1node.type, level1node.value);
            newLevel2node.children = level2node.children;
        }; 
        let eoOuterCallback = function(newLevel1) {
            this.ROOT.children = newLevel1;
        }.bind(this);
        this._loopThroughLevel1and2(innerCallback, function(){}, eoOuterCallback);
    },
    initGroupingsGraph: function(groupingPatterns, set, getBinStringsCallback) {
        for (let i = 0; i < groupingPatterns.length; i ++) {
            let groupingNode = this.ROOT.children[groupingPatterns[i]] = new Node('GROUPING', groupingPatterns[i]);
            groupingNode.createGroupingSubgraph(set, getBinStringsCallback);
        }
    }
};

module.exports = Graph;
