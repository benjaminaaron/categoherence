var utils = require('./utils.js');
var Graph = require('./Graph.js');
var Group = require('./Group.js');

var Session = function(data) {
    this.info = data.info;
    this.info.entities = {};
    
    this.groups = {};
    this.graph = new Graph(); // default size-leaf-graph
    
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
    getDashboardEntry: function() {
        return {
            'id': this.info.id,
            'name': this.info.name,
            'timestamp': this.info.timestamp,
            'entitiesCount': Object.keys(this.info.entities).length,
            'submissionsCount': this.submissions.length
        };
    },
    handleSubmission: function(data) {
        this.submissions.push(data);
        console.log('session [' + this.info.id + '] received submission #' + this.submissions.length + ', containing ' + data.groups.length + ' groups');
        
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
                        
                var subgroupSize = subgroupMembers.length;
                var subgroupId = utils.toGroupId(subgroupMembers);
                var group = this.groups[subgroupId];
                if(!group)
                    group = this.groups[subgroupId] = new Group(subgroupId, subgroupSize);
                group.handle(subgroupSize == size, data.groups[i].label, data.submitter);
                this.graph.handle(group);
            }
        }
        //console.log(this.graph.toString());
    },
    groupIdToNames: function(groupId) {
        var arr = groupId.split('-');
        var str = '';
        for(var i = 0; i < arr.length; i ++)
            str += this.info.entities[arr[i]] + ', ';
        return str.substring(0, str.length - 2);
    },
    getInfo: function() {
        return {
            'info': this.info,
            'submissions': this.submissions.length
        };
    },
    getLeaderboard: function() {
        var getScoreCallback = function(groupId) {
            return this.groups[groupId].getScore(ScoreRules.default);
        }.bind(this); 
        
        var sizeScoreGraph = this.graph.clone();
        sizeScoreGraph.insertNewLevel2(getScoreCallback, 'SCORE');
        
        var scoreSizeGraph = sizeScoreGraph.clone();
        scoreSizeGraph.swapLevels1and2();
        
        console.log('\ndefault graph:\n');
        console.log(this.graph.toString());
        console.log('\nsize-score graph:\n');
        console.log(sizeScoreGraph.toString());
        console.log('\nscore-size graph:\n');
        console.log(scoreSizeGraph.toString());
        console.log('');
        
        // leaderboard entries
        var cap = 10;
        var entries = [];
        var scores = Object.keys(scoreSizeGraph.ROOT.children).reverse();
        for(var i = 0; i < scores.length; i ++) {
            if(entries.length == cap)
                break;
            var score = scores[i];
            var groupIds = []; // groupIdsWithThatScore
            scoreSizeGraph.ROOT.children[score].collectEntries(groupIds);
            groupIds.reverse();
            for(var j = 0; j < groupIds.length; j ++) {
                var groupId = groupIds[j];
                var group = this.groups[groupId];
                entries.push({
                    'score': score,
                    'names': this.groupIdToNames(groupId),
                    'size': group.size,
                    'wholeCount': group.asWhole.count,
                    'partCount': group.asPart.count,
                    'labels': '',
                    'submitters': ''
                });
                if(entries.length == cap)
                    break;
            }
        }
        return {
            'entries': entries,
            'isAll': entries.length == Object.keys(this.groups).length
        };
    },
    getGroupingSuggestions: function() {    
        var groupingPatterns = [];
        // TODO Partitionierungsproblem / Partitionsfunktion...
        groupingPatterns.push([3, 3]);
        
        var graph = new Graph();
        graph.initGroupingsGraph(groupingPatterns, Object.keys(this.info.entities));
        
        return '';
    }
};

var ScoreRules = {
    default: function(group) {
        return group.size * (group.asWhole.count * 2 + group.asPart.count);
    },
    justCounts: function(group) {
        return group.asWhole.count + group.asPart.count;
    }
};

module.exports = Session;
