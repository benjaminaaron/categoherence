
var Group = function(groupId, size) {
    this.groupId = groupId;
    this.size = size;
    this.asWhole = {
        'count': 0,
        'submitters': [],
        'labels': []
    };
    this.asPart = {
        'count': 0,
        'submitters': [],
        'labels': [] // each goes by the format {name: 'name', count: x}
    };
    this.scores = {};
};

Group.prototype = {
    toString: function() {
        return '[' + this.groupId + '] ' + this.size + ', ' + this.asWhole.count + '|' + this.asPart.count;
    },
    handleSubmittedGroup: function(groupMeta) {
        var type = groupMeta.isWhole ? this.asWhole : this.asPart;
        type.count ++;
        type.submitters.push(groupMeta.submitter);
        type.labels.push(groupMeta.label); // TODO distinguish labels and count ++
    },
    getScore: function() {
        return this.size * (this.asWhole.count * 2 + this.asPart.count);
    }
};

module.exports = Group;
