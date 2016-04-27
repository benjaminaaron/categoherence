var utils = require('./utils.js');
var Group = require('./Group.js');

var Session = function(data) {
    this.info = data.info;
    this.info.entities  = {};
    
    this.groups = {};
    
    for(var i = 0; i < data.set.length; i ++)
        this.info.entities['' + i] = data.set[i]; // id = i
    
    this.submissions = [];
    
    this.showInfo();
};

Session.prototype = {
    showInfo: function() {
        console.log('---------- start: ' + this.info.id);
        console.log(this.info);
        console.log('---------- end: ' + this.info.id);
    },
    addSubmission: function(data) {
        this.submissions.push(data);
        for(var i = 0; i < data.groups.length; i ++) {
            var group = data.groups[i];
            var gId = utils.sort(group);
            if(this.groups[gId])
                this.groups[gId].asWholeCount += 1;
            else 
                this.groups[gId] = new Group(gId, group.length);
        }
    },
    groupsToString: function() {
        var str = '';
        for(var gIdStr in this.groups) {
            if(this.groups.hasOwnProperty(gIdStr)) {
                var group = this.groups[gIdStr];
                str += group.getStats() + ' ';
                for(var i = 0; i < group.size; i ++)
                    str += this.info.entities[group.gId[i]] + (i < group.size - 1 ? ' ' : '');
                str += '\n';
            }
        }
        return str;
    },
    getResult: function() {
        var resultData = {
            'info': this.info,
            'submissions': this.submissions.length,
            'stats' : null
        };
    }
};

module.exports = Session;
