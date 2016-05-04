var Node = require('./Node.js');

var Graph = function() {
    this.ROOT = new Node(null, 'ROOT', null);
};

Graph.prototype = {
    toString: function() {
        return this.ROOT.toString();
    },
    insertScoreLevel: function() {
        var keys = Object.keys(this.ROOT.children);
        for(var i = 0; i < keys.length; i ++)
            this.ROOT.children[keys[i]].insertScoreLevel();
    }
};

module.exports = Graph;
