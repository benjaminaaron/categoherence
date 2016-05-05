var Group = require('./Group.js');

var Node = function(type, value) {
    this.children = {};
    this.type = type;
    this.value = value;
};

Node.prototype = {
    clone: function(cloneParent) {
        var keys = Object.keys(this.children);
        for(var i = 0; i < keys.length; i ++) {
            var originalChild = this.children[keys[i]];
            var cloneChild = cloneParent.children[keys[i]] = new Node(originalChild.type, originalChild.value);
            originalChild.clone(cloneChild);
        }
    },
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
                str = '      ' + this.value;
                break;
        }
        str += '\n';
        for(var i = 0; i < keys.length; i ++)
            str += this.children[keys[i]].toString();
        return str;
    },
    insertScoreLevel: function(getScoreCallback) {
        var newChildren = {};
        var keys = Object.keys(this.children);
        for(var i = 0; i < keys.length; i ++) {
            var leaf = this.children[keys[i]];
            var score = getScoreCallback(leaf.value);
            var scoreNode = newChildren[score];
            if(!scoreNode)
                scoreNode = newChildren[score] = new Node('SCORE', score);
            scoreNode.children[leaf.value] = leaf;
        }
        this.children = newChildren;
    }
};

module.exports = Node;
