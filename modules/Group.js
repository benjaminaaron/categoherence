
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
    show: function() {
        console.log(this.groupId + ': ' + this.size + ', ' + this.asWhole.count + '|' + this.asPart.count);
    },
    handleSubmittedGroup: function(groupData) {
        var type = groupData.isWhole ? this.asWhole : this.asPart;
        type.count ++;
        type.submitters.push(groupData.submitter);
        type.labels.push(groupData.label);
    }
};

module.exports = Group;
