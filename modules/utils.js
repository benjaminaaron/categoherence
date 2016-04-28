var latinize = require('latinize');
var Strinc = require('strinc');

module.exports = {
    formatNameAsId: function(str) {
        return latinize(str).replace(/ /g, '_').replace('#', '').toLowerCase();
    },
    sort: function(arr) {
        return arr.map(Number).sort(function(a, b) {
            return a - b;
        });
    },
    add: function(a, b) {
        return a + b;
    },
    generateBinStrings: function(memberCount) {
        var binStrings = [];
        var generate = Strinc(Strinc.BIN);
        var nextBinStr = generate(); // skip out the empty group
        for (var i = 1; i < Math.pow(2, memberCount); i ++) {
            nextBinStr = generate();
            for(var j = 0; j < (memberCount - nextBinStr.length); j ++)
                nextBinStr = '0' + nextBinStr;
            binStrings.push(nextBinStr);
        }
        return binStrings;
    }
};
