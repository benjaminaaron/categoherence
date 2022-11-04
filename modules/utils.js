const latinize = require('latinize');
const Strinc = require('strinc');

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
        let sorted = this.sortStrArr(arr);
        let groupId = '';
        for (let i = 0; i < sorted.length; i ++)
            groupId += '-' + sorted[i];
        return groupId.substring(1);
    },
    cloneArr: function(arr) {
        let clone = [];
        for (let i = 0; i < arr.length; i ++)
            clone.push(arr[i]);
        return clone;
    },
    generateBinStrings: function(memberCount, onlyThisSize) {
        let generate = Strinc(Strinc.BIN);
        let zeroes = '';
        for (let i = 0; i < memberCount; i ++)
            zeroes += '0';
        let binStrings = [];
        let nextBinStr = generate(); // skip the empty group
        for (let i = 1; i < Math.pow(2, memberCount); i ++) {
            nextBinStr = generate();
            if (onlyThisSize)
                if (this.sumOfDigits(nextBinStr) != onlyThisSize)
                    continue;
            binStrings.push(zeroes.substring(0, zeroes.length - nextBinStr.length) + nextBinStr);
        }
        return binStrings;
    },
    sumOfDigits: function(numb) {
        let sum = 0;
        while (numb > 0) {
            sum += numb % 10;
            numb = Math.floor(numb / 10);
        }
        return sum;
    }
};
