var Group = require('./Group.js');

var Node = function(parent, value) {
    this.parent = parent;
    this.children = {};
    this.value = value;
    this.group = null;
};

Node.prototype = {
    show: function() {
        var keys = Object.keys(this.children);

        if(this.group == null)
            console.log('>> ' + this.value + ' has ' + keys.length + ' children');
        else
            this.group.show();
        
        for(var i = 0; i < keys.length; i ++)
            this.children[keys[i]].show();
    },
    handleSubmittedGroup: function(groupMeta, level) {
        var identifier = null;
        switch(level) {
            case 0:
                identifier = groupMeta.size;
            case 1:
                if(identifier == null) {
                    identifier = groupMeta.groupId;
                }
                var node = this.children[identifier];
                if(!node)
                    node = this.children[identifier] = new Node(this, identifier);
                node.handleSubmittedGroup(groupMeta, ++ level);
                break;
            case 2:
                if(this.group == null)
                    this.group = new Group(groupMeta.groupId, groupMeta.size);
                this.group.handleSubmittedGroup(groupMeta);
                break;
        }
    }
};

module.exports = Node;
