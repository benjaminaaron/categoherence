var utils = require('./utils.js');
var Group = require('./Group.js');

var Session = function(data) {
    this.info = data.info;
    this.info.entities  = {};
    
    this.groups = {};
    
    for(var i = 0; i < data.set.length; i ++)
        this.info.entities['' + i] = data.set[i]; // id = i
    
    this.submissions = [];
    
    //this.showInfo();
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
        for(var i = 0; i < gId.length; i ++)
            str += this.info.entities[gId[i]] + ', ';
        return str.substring(0, str.length - 2);
    },
    getInfo: function() {
        return {
            'info': this.info,
            'submissions': this.submissions.length
        };
    },
    getLeaderboard: function(params) {
        var scoreToGidMap = {};
        var count = 0;
        for(var gIdStr in this.groups) {
            if(this.groups.hasOwnProperty(gIdStr)) {
                var group = this.groups[gIdStr];
                var score = group.size * (group.asWhole.count * 2 + group.asPart.count); // TODO pass it as parameters from frontend
                var scoreEntry = scoreToGidMap[score];
                if(!scoreEntry)
                    scoreEntry = scoreToGidMap[score] = [gIdStr];
                else
                    scoreEntry.push(gIdStr);
                if(++ count == 50) // TODO make a param somewhere
                    break;
            }
        }
        var sortedScores = utils.sort(Object.keys(scoreToGidMap)).reverse();
        var leaderboard = [];
        for(var i = 0; i < sortedScores.length; i ++) {
            var score = sortedScores[i];
            var groupsWithThisScore = scoreToGidMap[score];
            for(var j = 0; j < groupsWithThisScore.length; j ++) {
                var group = this.groups[groupsWithThisScore[j]];
                var entry = {
                    'score': score,
                    'labels': this.gIdToNames(group.gId),
                    'size': group.size,
                    'wholeCount': group.asWhole.count,
                    'partCount': group.asPart.count
                }
                leaderboard.push(entry);
            }
        }
        return {
            'leaderboard' : {
                'list': leaderboard,
                'isAll': leaderboard.length == Object.keys(this.groups).length
            }
        };
    },
    getGroupSuggestions: function() {
        //Object.keys(this.info.entities).length / n ...
        var allowedSplittings = [];
        var splitting = [3, 3];
        
        var graph = new Graph();        
        
    }
};

module.exports = Session;
