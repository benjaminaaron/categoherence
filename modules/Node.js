var utils = require('./utils.js');
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
            console.log(this.value + ': ' + keys.length + ' children');
        else
            this.group.show();
        
        for(var i = 0; i < keys.length; i ++)
            this.children[keys[i]].show();
    },
    handleSubmittedGroup: function(groupData, level) {
        var identifier = null;
        switch(level) {
            case 0:
                identifier = groupData.ids.length;
                groupData.size = identifier;
            case 1:
                if(identifier == null) {
                    identifier = utils.toGroupId(groupData.ids);
                    groupData.groupId = identifier;
                }
                var node = this.children[identifier];
                if(!node)
                    node = this.children[identifier] = new Node(this, identifier);
                node.handleSubmittedGroup(groupData, ++ level);
                break;
            case 2:
                if(this.group == null)
                    this.group = new Group(groupData.groupId, groupData.size);
                this.group.handleSubmittedGroup(groupData);
                break;
        }
    }
};

module.exports = Node;
