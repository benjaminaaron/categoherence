var Group = require('./Group.js');
var utils = require('./utils.js');

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
    toString: function(level) {
        var keys = Object.keys(this.children);
        var str = Array((level * 4) + 1).join(' ') + '[' + this.type + '] ' + this.value + (keys.length > 0 ? ': ' + keys.length + ' children' : '') + '\n';
        for(var i = 0; i < keys.length; i ++)
            str += this.children[keys[i]].toString(level + 1);
        return str;
    },
    collectEntries: function(groupIds) {
        var keys = Object.keys(this.children);
        for(var i = 0; i < keys.length; i ++)
            this.children[keys[i]].collectEntries(groupIds);
        if(this.type == 'LEAF')
            groupIds.push(this.value);
    },
    createGroupingSubgraph: function(set) {
        var grouping = utils.cloneArr(this.value);
        var mySize = grouping[0];
        var rest = grouping.slice(1);
        
        if(rest.length > 0) {
            
        }
    }
};

module.exports = Node;
