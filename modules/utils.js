var latinize = require('latinize');
var Strinc = require('strinc');

module.exports = {
    formatNameAsId: function(str) {
        return latinize(str).replace(/ /g, '_').replace('#', '').toLowerCase();
    },
    sortStrArr: function(arr) {
        return arr.map(Number).sort(function(a, b) {
            return a - b;
        });
    },
    toGroupId: function(arr) {
        var sorted = this.sortStrArr(arr);
        var groupId = '';
        for(var i = 0; i < sorted.length; i ++)
            groupId += '-' + sorted[i];
        return groupId.substring(1);
    },
    cloneArr: function(arr) {
        var clone = [];
        for(var i = 0; i < arr.length; i ++)
            clone.push(arr[i]);
        return clone;
    },
    generateBinStrings: function(memberCount, onlyThisSize) {
        var generate = Strinc(Strinc.BIN);
        var zeroes = '';
        for(var i = 0; i < memberCount; i ++)
            zeroes += '0';
        var binStrings = [];
        var nextBinStr = generate(); // skip the empty group
        for (var i = 1; i < Math.pow(2, memberCount); i ++) {
            nextBinStr = generate();
            if(onlyThisSize)
                if(this.sumOfDigits(nextBinStr) != onlyThisSize)
                    continue;
            binStrings.push(zeroes.substring(0, zeroes.length - nextBinStr.length) + nextBinStr);
        }
        return binStrings;
    },
    sumOfDigits: function(numb) {
        var sum = 0;
        while(numb > 0) {
            sum += numb % 10;
            numb = Math.floor(numb / 10);
        }
        return sum;
    }
};
