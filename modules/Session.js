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
    handleSubmission: function(data) {
        this.submissions.push(data);
        for(var i = 0; i < data.groups.length; i ++) {
            var gId = utils.sort(data.groups[i]);
            var binStrings = utils.generateBinStrings(gId.length);
            
            for(j = 0; j < binStrings.length; j ++) {
                var binStr = binStrings[j];
                var subgId = [];
                for(k = 0; k < binStr.length; k ++)
                    if(binStr[k] == '1')
                        subgId.push(gId[k]);
                subgId = utils.sort(subgId);
                var subgroup = this.groups[subgId];
                if(!subgroup)
                    subgroup = this.groups[subgId] = new Group(subgId);
                if(subgId.length == gId.length)
                    subgroup.asWhole.count += 1;
                else
                    subgroup.asPart.count += 1;
            }
        }
        //console.log(this.groups);
        console.log(this.groupsToString());
    },
    groupsToString: function() {
        var str = '';
        for(var gIdStr in this.groups) {
            if(this.groups.hasOwnProperty(gIdStr)) {
                var group = this.groups[gIdStr];
                str += group.getStats() + ' ' + this.gIdToNames(group.gId) + '\n';
            }
        }
        return str;
    },
    gIdToNames: function(gId) {
        var str = '';
        for(var i = 0; i < gId.size; i ++)
            str += this.info.entities[gId[i]];
        return str.substring(0, str.length - 2);
    },
    getResult: function() {
        return {
            'info': this.info,
            'submissions': this.submissions.length,
            'leaderboard' : this.getLeaderboard()
        };
    },
    getLeaderboard: function(params) {
        var scoreToGidMap = {};
        for(var gIdStr in this.groups) {
            if(this.groups.hasOwnProperty(gIdStr)) {
                var group = this.groups[gIdStr];
                var score = group.size * (group.asWhole.count * 2 + group.asPart.count);
                var scoreEntry = scoreToGidMap[score];
                if(!scoreEntry)
                    scoreEntry = scoreToGidMap[score] = [gIdStr];
                else
                    scoreEntry.push(gIdStr);
            }
        }
        var sortedScores = utils.sort(Object.keys(scoreToGidMap));
        var leaderboard = [];
        for(var i = 0; i < sortedScores.length; i ++) {
            var groupsWithThisScore = scoreToGidMap[sortedScores[i]];
            for(var j = 0; j < groupsWithThisScore.length; j ++) {
                var group = this.groups[groupsWithThisScore[j]];
                
                var groupEntry = {
                    'gId': group.gId,
                    'size': group.size,
                    'stats': group.getStats(),
                    'name': null
                }
                
                leaderboard.push(group);
            }
        }
        return leaderboard;
    }
};

module.exports = Session;
