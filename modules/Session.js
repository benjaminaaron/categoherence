const utils = require('./utils.js');
const Graph = require('./Graph.js');
const Group = require('./Group.js');

const Session = function(sessionData) {
    this.data = sessionData;

    this.groups = {};
    // this.graph = new Graph(); // default size-leaf-graph
    this.submissions = [];
    this.binStringsStock = {};
    this.retroSubmissions = [];
    this.guests = [];

    //this.showInfo();
};

Session.prototype = {
    showInfo: function() {
        console.log('---------- start: ' + this.info.id);
        console.log(this.info);
        console.log('---------- end: ' + this.info.id);
    },
    getDashboardEntry: function() {
        return {
            'id': this.data.id,
            'name': this.data.name,
            'timestamp': this.data.timestamp,
            'entitiesCount': Object.keys(this.data.entities).length,
            'submissionsCount': this.submissions.length
        };
    },
    handleRetroSubmission: function(submissionData) {
        this.retroSubmissions.push(submissionData)
    },
    addGuest: function(guest) {
      this.guests.push(guest);
    },
    addReactionToSubmission: function(submissionId) {
        this.retroSubmissions[submissionId].reactionCount ++;
    },
    handleSubmission: function(data) {
        this.submissions.push(data);
        console.log('session [' + this.info.id + '] received submission #' + this.submissions.length + ', containing ' + data.groups.length + ' groups');
        
        for (let i = 0; i < data.groups.length; i ++) {
            let groupMembers = data.groups[i].members;
            let size = groupMembers.length;
            
            let binStrings = this.binStringsStock[size];
            if (!binStrings)
                binStrings = this.binStringsStock[size] = utils.generateBinStrings(size);

            for (let j = 0; j < binStrings.length; j ++) {
                let bin = binStrings[j];
                let subgroupMembers = [];
                for (let k = 0; k < bin.length; k ++)
                    if (bin[k] === '1')
                        subgroupMembers.push(groupMembers[k]);
                        
                let subgroupSize = subgroupMembers.length;
                let subgroupId = utils.toGroupId(subgroupMembers);
                let group = this.groups[subgroupId];
                if (!group)
                    group = this.groups[subgroupId] = new Group(subgroupId, subgroupSize);
                group.handle(subgroupSize === size, data.groups[i].label, data.submitter);
                this.graph.handle(group);
            }
        }
        //console.log(this.graph.toString());
    },
    groupIdToNames: function(groupId) {
        let arr = groupId.split('-');
        let str = '';
        for (let i = 0; i < arr.length; i ++)
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
        let getScoreCallback = function(groupId) {
            return this.groups[groupId].getScore(ScoreRules.default);
        }.bind(this); 
        
        let sizeScoreGraph = this.graph.clone();
        sizeScoreGraph.insertNewLevel2(getScoreCallback, 'SCORE');
        
        let scoreSizeGraph = sizeScoreGraph.clone();
        scoreSizeGraph.swapLevels1and2();
        
        console.log('\ndefault graph:\n');
        console.log(this.graph.toString());
        console.log('\nsize-score graph:\n');
        console.log(sizeScoreGraph.toString());
        console.log('\nscore-size graph:\n');
        console.log(scoreSizeGraph.toString());
        console.log('');
        
        // leaderboard entries
        let cap = 10;
        let entries = [];
        let scores = Object.keys(scoreSizeGraph.ROOT.children).reverse();
        for (let i = 0; i < scores.length; i ++) {
            if (entries.length === cap)
                break;
            let score = scores[i];
            let groupIds = []; // groupIdsWithThatScore
            scoreSizeGraph.ROOT.children[score].collectEntries(groupIds);
            groupIds.reverse();
            for (let j = 0; j < groupIds.length; j ++) {
                let groupId = groupIds[j];
                let group = this.groups[groupId];
                entries.push({
                    'score': score,
                    'names': this.groupIdToNames(groupId),
                    'size': group.size,
                    'wholeCount': group.asWhole.count,
                    'partCount': group.asPart.count,
                    'labels': '',
                    'submitters': ''
                });
                if (entries.length === cap)
                    break;
            }
        }
        return {
            'entries': entries,
            'isAll': entries.length === Object.keys(this.groups).length
        };
    },
    getGroupingSuggestions: function() {    
        let groupingPatterns = [];
        // TODO Partitionierungsproblem / Partitionsfunktion...
        groupingPatterns.push([4, 3, 2]);
        
        let getBinStringsCallback = function(size, onlyThisSize) {
            let binStrings = this.binStringsStock[size + '_' + onlyThisSize];
            if (!binStrings)
                binStrings = this.binStringsStock[size + '_' + onlyThisSize] = utils.generateBinStrings(size, onlyThisSize);
            return binStrings;
        }.bind(this);
        
        let graph = new Graph();
        graph.initGroupingsGraph(groupingPatterns, Object.keys(this.info.entities), getBinStringsCallback);
        
        return '';
    }
};

let ScoreRules = {
    default: function(group) {
        return group.size * (group.asWhole.count * 2 + group.asPart.count);
    },
    justCounts: function(group) {
        return group.asWhole.count + group.asPart.count;
    }
};

module.exports = Session;
