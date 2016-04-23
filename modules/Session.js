
var Session = function(info, set) {
    this.info = info;
    this.info.entities  = {};
    
    this.subgroups = {};
    
    for(var i = 0; i < set.length; i ++) {
        this.info.entities[i] = set[i];
        this.subgroups[i] = 0;
    }
    
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
    handleSubmission: function(data) {
        this.submissions.push(data);
        for(var i = 0; i < data.groupings.length; i ++) {
            var grouping = data.groupings[i];
            var idStr = this.sortIds(grouping);
            if(this.subgroups[idStr])
                this.subgroups[idStr] += 1;
            else 
                this.subgroups[idStr] = 1;
        }
        console.log(this.subgroups);
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
