
var Group = function(gId) {
    this.gId = gId;
    this.size = gId.length;
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
    getStats: function() {
        return '[' + this.size + ':' + this.asWhole.count + '|' + this.asPart.count + ']';
    }
};

module.exports = Group;
