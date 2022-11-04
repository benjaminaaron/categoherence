const Group = require('./Group.js');
const utils = require('./utils.js');

const Node = function(type, value) {
    this.children = {};
    this.type = type;
    this.value = value;
};

Node.prototype = {
    clone: function(cloneParent) {
        let keys = Object.keys(this.children);
        for(let i = 0; i < keys.length; i ++) {
            let originalChild = this.children[keys[i]];
            let cloneChild = cloneParent.children[keys[i]] = new Node(originalChild.type, originalChild.value);
            originalChild.clone(cloneChild);
        }
    },
    toString: function(level) {
        let keys = Object.keys(this.children);
        let str = Array((level * 4) + 1).join(' ') + '[' + this.type + '] ' + this.value + (keys.length > 0 ? ': ' + keys.length + ' children' : '') + '\n';
        for(let i = 0; i < keys.length; i ++)
            str += this.children[keys[i]].toString(level + 1);
        return str;
    },
    collectEntries: function(groupIds) {
        let keys = Object.keys(this.children);
        for(let i = 0; i < keys.length; i ++)
            this.children[keys[i]].collectEntries(groupIds);
        if(this.type == 'LEAF')
            groupIds.push(this.value);
    },
    createGroupingSubgraph: function(set, getBinStringsCallback) {
        let grouping = utils.cloneArr(this.value);
        let mySize = grouping[0];
        let rest = grouping.slice(1);
        let binStrings = getBinStringsCallback(set.length, mySize);
        
        if(rest.length > 0) {
            
        }
    }
};

module.exports = Node;
