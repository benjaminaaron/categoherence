var Group = require('./Group.js');

var Node = function(parent, type, value) {
    this.parent = parent;
    this.children = {};
    this.type = type;
    this.value = value;
    this.group = null;
};

Node.prototype = {
    toString: function() {
        var keys = Object.keys(this.children);
        var str;
        switch(this.type) {
            case 'ROOT':
                str = '[ROOT] has ' + keys.length + ' children';
                break;
            case 'SIZE':
                str = '  [SIZE ' + this.value + '] has ' + keys.length + ' children';
                break;
            case 'SCORE':
                str = '    [SCORE ' + this.value + '] has ' + keys.length + ' children';
                break;
            case 'LEAF':
                str = '      ' + this.group.toString();
                break;
        }
        str += '\n';
        for(var i = 0; i < keys.length; i ++)
            str += this.children[keys[i]].toString();
        return str;
    },
    handleSubmittedGroup: function(groupMeta, level) {
        switch(level) {
            case 0:
                var node = this.children[groupMeta.size];
                if(!node)
                    node = this.children[groupMeta.size] = new Node(this, 'SIZE', groupMeta.size);
                node.handleSubmittedGroup(groupMeta, ++ level);
                break;
            case 1:
                var node = this.children[groupMeta.groupId];
                if(!node)
                    node = this.children[groupMeta.groupId] = new Node(this, 'LEAF', groupMeta.groupId);
                node.handleSubmittedGroup(groupMeta, ++ level);
                break;
            case 2:
                if(this.group == null)
                    this.group = new Group(groupMeta.groupId, groupMeta.size);
                this.group.handleSubmittedGroup(groupMeta);
                break;
        }
    },
    insertScoreLevel: function() {
        var newChildren = {};
        var keys = Object.keys(this.children);
        for(var i = 0; i < keys.length; i ++) {
            var leaf = this.children[keys[i]];
            var score = leaf.group.getScore();
            var scoreNode = newChildren[score];
            if(!scoreNode)
                scoreNode = newChildren[score] = new Node(this, 'SCORE', score);
            leaf.parent = scoreNode;
            scoreNode.children[leaf.group.groupId] = leaf;
        }
        this.children = newChildren;
    }
};

module.exports = Node;
