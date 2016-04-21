var latinize = require('latinize');

module.exports = {
    formatNameAsId: function(str) {
        return latinize(str).replace(/ /g, '_').toLowerCase();
    }
};
