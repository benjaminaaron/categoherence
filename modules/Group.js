
const Group = function(groupId, size) {
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
};

Group.prototype = {
    toString: function() {
        return '[' + this.groupId + '] ' + this.size + ', ' + this.asWhole.count + '|' + this.asPart.count;
    },
    handle: function(isWhole, label, submitter) {
        let type = isWhole ? this.asWhole : this.asPart;
        type.count ++; // TODO allow minus counts for anti-groups
        type.submitters.push(submitter);
        type.labels.push(label); // TODO distinguish labels and count ++
    },
    getScore: function(scoreFunc) {
        return scoreFunc(this);
    }
};

module.exports = Group;
