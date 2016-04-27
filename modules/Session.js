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
            var gId = utils.sort(data.groups[i]);
            var group = this.groups[gId]
            if(!group)
                group = this.groups[gId] = new Group(gId);
            group.asWhole.count += 1;
            
            var binStrings = utils.generateBinStrings(gId.length);
                        
            for(j in binStrings) {
                var binArr = binStrings[j].map(Number);
                var sum = binArr.reduce(utils.add, 0);
                
                if(sum != 0 && sum != binArr.length) {
                    var subgroupArr = [];
                    for(k in binArr)
                        if(binArr[k] == 1)
                            subgroupArr.push(gId[k]);
                    var subgroup = this.groups[subgroupArr];
                    if(!subgroup)
                        subgroup = this.groups[subgroupArr] = new Group(subgroupArr);
                    subgroup.asPart.count += 1;
                }
            }
        }
        console.log(this.groups);
        console.log(this.groupsToString());
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
