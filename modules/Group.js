
var Group = function(idStr, size) {
    this.idStr = idStr;
    this.size = size;
    //TODO group creator is part or not
    this.asWholeCount = 1;
    this.asSubgroupCount = 0;
};

Group.prototype = {
    getStats: function() {
        return '[' + this.size + ':' + this.asWholeCount + '|' + this.asSubgroupCount + ']';
    }
};

module.exports = Group;
