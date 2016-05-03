var utils = require('./utils.js');
var Graph = require('./Graph.js');

var Session = function(data) {
    this.info = data.info;
    this.info.entities  = {};
    
    this.groups = {};
    this.graph = new Graph();
    
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
            var groupMembers = data.groups[i].members;
            var size = groupMembers.length;
            var binStrings = utils.generateBinStrings(size);
            for(j = 0; j < binStrings.length; j ++) {
                var bin = binStrings[j];
                var subgroupMembers = [];
                for(k = 0; k < bin.length; k ++)
                    if(bin[k] == '1')
                        subgroupMembers.push(groupMembers[k]);
                var groupMeta = {
                    'size': subgroupMembers.length,
                    'groupId': utils.toGroupId(subgroupMembers),
                    'isWhole': subgroupMembers.length == size,
                    'label': data.groups[i].label,
                    'submitter': data.submitter
                };
                this.graph.ROOT.handleSubmittedGroup(groupMeta, 0);
            }
        }
        console.log(this.graph.toString());
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
                var score = ScoreRules['default'](group);
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
        var scoreToGidMap = {}; // TODO
        
        var allowedSplittings = [];
        var splitting = [3, 3]; // TODO make neat algo for that, look for Partitionierungsproblem / Partitionsfunktion...
        allowedSplittings.push(splitting);
        
        //var graph = new Graph(this.groups, allowedSplittings[0], 'default');
    }
};

var ScoreRules = {
    default: function(group) {
        var score = group.size * (group.asWhole.count * 2 + group.asPart.count);
        group.scores['default'] = score;
        return score;
    }
};

module.exports = Session;
