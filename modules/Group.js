
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
    handle: function(isWhole, label, submitter) {
        var type = isWhole ? this.asWhole : this.asPart;
        type.count ++; // TODO allow minus counts for anti-groups
        type.submitters.push(submitter);
        type.labels.push(label); // TODO distinguish labels and count ++
    },
    getScore: function() {
        return this.size * (this.asWhole.count * 2 + this.asPart.count);
    }
};

module.exports = Group;
