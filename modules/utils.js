var latinize = require('latinize');

module.exports = {
    formatNameAsId: function(str) {
        return latinize(str).replace(/ /g, '_').replace('#', '').toLowerCase();
    },
    sort: function(arr) {
        return arr.map(Number).sort(function(a,b) {
            return a - b;
        });
    }
};
