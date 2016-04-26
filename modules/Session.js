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
    sortIds: function(arr) {
        if(arr.length == 1)
            return arr[0];
        else {
            var sorted = arr.map(Number).sort(function(a,b){return a - b;});
            var idStr = '';
            for(var i = 0; i < sorted.length; i ++)
                idStr += '-' + sorted[i];
            return idStr.substring(1);
        }
    },
    addSubmission: function(data) {
        this.submissions.push(data);
        for(var i = 0; i < data.groups.length; i ++) {
            var group = data.groups[i];
            var idStr = this.sortIds(group);
            if(this.groups[idStr])
                this.groups[idStr].asWholeCount += 1;
            else 
                this.groups[idStr] = new Group(idStr, group.length);
            
            //TODO count/create subgroups...
        }
    },
    groupsToString: function() {
        var str = '';
        for(var idStr in this.groups) {
            if(this.groups.hasOwnProperty(idStr)) {
                str += this.groups[idStr].getStats() + ' ';
                var ids = idStr.split('-');
                for(var i = 0; i < ids.length; i ++)
                    str += this.info.entities[ids[i]] + (i < ids.length - 1 ? ' ' : '');
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
