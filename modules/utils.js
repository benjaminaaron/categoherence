var latinize = require('latinize');
var Strinc = require('strinc');

module.exports = {
    formatNameAsId: function(str) {
        return latinize(str).replace(/ /g, '_').replace('#', '').toLowerCase();
    },
    sort: function(arr) {
        return arr.map(Number).sort(function(a,b) {
            return a - b;
        });
    },
    add: function(a, b) {
        return a + b;
    },
    generateBinStrings: function(memberCount) {
        var binStrings = [];
        var generate = Strinc(Strinc.BIN);
        for (var i = 0; i < Math.pow(2, memberCount); i ++) {
            var ibinStr = generate();
            var diff = memberCount - ibinStr.length;
            for(var j = 0; j < diff; j ++)
                ibinStr = '0' + ibinStr;
            binStrings.push(ibinStr);
        }
        return binStrings;
    }
};
